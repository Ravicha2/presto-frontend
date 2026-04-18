import { useState, Fragment } from "react";
import SlidePreview from "./SlidePreview";

const SlideControlPanel = ({ slides, currentSlideIndex, setCurrentSlideIndex, slideCount, isOpen, setIsOpen, onReorderSlides }) => {
  const togglePanel = () => setIsOpen(prev => !prev);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rectangle = e.currentTarget.getBoundingClientRect();
    const midX = rectangle.left + rectangle.width / 2;
    const gapIndex = e.clientX < midX ? index : index + 1;
    setDragOverIndex(gapIndex);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragIndex !== null && dragOverIndex !== null) {
      const reordered = [...slides];
      const [moved] = reordered.splice(dragIndex, 1);
      const insertIndex = dragOverIndex > dragIndex ? dragOverIndex - 1 : dragOverIndex;
      reordered.splice(insertIndex, 0, moved);
      onReorderSlides?.(reordered);
      setCurrentSlideIndex(insertIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="relative pl-4 md:pl-10 md:pb-0">
      <div className="flex flex-col pt-1 justify-center items-center">
        <button
          onClick={togglePanel}
          className={`py-1 rounded text-sm font-semibold transition-all duration-300 cursor-pointer w-10 flex justify-center mb-1
                    ${isOpen
      ? 'bg-blue-500 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
        >
          <span className='text-md'>{isOpen ? '⬇️' : '⬆️'}</span>
        </button>
        {isOpen && (
          <div className='flex items-center w-full'>
            <div 
              className='absolute inset-0'
              onClick={togglePanel}
            />
            <div className='relative w-full bg-white shadow-2xl animate-slide-up'>
              <div
                className='flex items-center gap-3 overflow-x-auto pb-2 px-1'
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {dragOverIndex === 0 && (
                  <div className="flex-shrink-0 self-stretch rounded-full bg-blue-500" />
                )}
                {slides?.map((slide, index) => (
                  // same as <></> but Fragment allow key property
                  <Fragment key={slide.id}>
                    <button
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => { setCurrentSlideIndex(index) }}
                      className={`flex-shrink-0 cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                                        ${index === currentSlideIndex
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                                        ${dragIndex === index ? 'opacity-50' : ''}
                                        `}
                      style={{ width: `${Math.max(60, Math.min(100, 700/ slideCount))}px` }}
                    >
                      <div className='w-full aspect-video rounded-t-md overflow-hidden'>
                        <SlidePreview slide={slide} />
                      </div>
                      <div className={`text-center py-0 text-xs font-medium rounded-b-md
                                            ${index === currentSlideIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }`}
                      >
                                            Slide {index + 1}
                      </div>
                    </button>
                    {dragOverIndex === index + 1 && (
                      <div className="flex-shrink-0 w-1 self-stretch rounded-full bg-blue-500" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideControlPanel    