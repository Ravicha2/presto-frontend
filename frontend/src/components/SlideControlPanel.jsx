const SlideControlPanel = ({ slides, currentSlideIndex, setCurrentSlideIndex, slideCount, isOpen, setIsOpen }) => {
    const togglePanel = () => setIsOpen(prev => !prev);

    return (
        <div className="relative">
            <div className="flex flex-col pt-1 justify-center items-center border-t border-gray-300">
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
                <div className='z-[9999] flex items-center w-full ml-30'>
                    <div 
                        className='absolute inset-0'
                        onClick={togglePanel}
                    />
                    <div className='relative w-full bg-white shadow-2xl animate-slide-up'>
                        <button
                            onClick={togglePanel}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer leading-none"
                        >
                            &times;
                        </button>
                        <div className='flex gap-4 overflow-x-auto pb-2 px-1'>
                            {slides?.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    onClick={() => {
                                        setCurrentSlideIndex(index);
                                    }}
                                    className={`felx-shrink-0 cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                                    ${index === currentSlideIndex 
                                        ? 'border-blue-500 shadow-md'
                                        : 'border-blue-300 hover-border-gray-400'
                                    }`}
                                    style={{ width: `${Math.max(80, Math.min(160, 700/ slideCount))}px` }}
                                >
                                    <div 
                                        className='w-full aspect-video rounded-t-md flex items-center justify-center text-xs'
                                        style={{ background: slide.background || '#ffffff' }}
                                    >
                                        <span className={`${slide.background === '#ffffff' || !slide.background ? 'text-gray-400' : 'text-gray-200'}`}>
                                              {slide.elements?.length || 0} elements
                                          </span>
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