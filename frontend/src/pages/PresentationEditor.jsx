import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import Toolbar from '../components/Toolbar';
import UpsertSlideModal from '../components/UpsertSlideModal';
import Alert from '../components/Alert';
import SlideControlPanel from '../components/SlideControlPanel';
import Canvas from '../components/Canvas';
import editIcon from '../assets/edit-button-svgrepo-com.svg';

// presentation editor page
const PresentationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [presentation, setPresentation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slideParam = searchParams.get('slide');
  const currentSlideIndex = slideParam ? parseInt(slideParam, 10) : 0;
  const currentSlideId = presentation?.slides?.[currentSlideIndex]?.id ?? null;

  const setCurrentSlideIndex = (index) => {
    setSearchParams({ slide: index.toString() });
  };

  // get current presentation params
  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await api.GET(`/store`);
        const currentPresentation = response.store.presentations.find(p => p.id === id);
        setPresentation(currentPresentation);
        setLoading(false);
      } catch {
        setError('Presentation not found')
        setLoading(false);
      }
    };
    fetchPresentation()
    window.addEventListener('presentationCreated', fetchPresentation);
    return () => window.removeEventListener('presentationCreated', fetchPresentation)
  }, [id, navigate])

  // get current slide index
  useEffect(() => {
    if (presentation?.slides?.length > 0) {
      const maxIndex = presentation.slides.length - 1;
      if (currentSlideIndex > maxIndex) {
        setSearchParams({ slide: maxIndex.toString() });
      } else if (currentSlideIndex < 0) {
        setSearchParams({ slide: '0' });
      }
    }
  }, [presentation, currentSlideIndex, setSearchParams]);

  const currentSlide = presentation?.slides?.[currentSlideIndex] ?? null;

  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide =  currentSlideIndex === (presentation?.slides?.length ?? 0) -1;
  const slideCount = presentation?.slides.length ?? 0;

  // save new state of presentation
  const savePresentation = async (updatedPresentation) => {
    try {
      const { store } = await api.GET('/store');
      const updatedPresentations = store.presentations.map(p => p.id === id ? updatedPresentation : p);
      await api.PUT('/store', {
        store: { ...store, presentations: updatedPresentations }
      });
    } catch (err) {
      console.log(err);
      setError('Failed to save changes');
    }
  };

  // shout out when presentation created
  const handleCreateSuccess = (editPresentation) => {
    setPresentation(editPresentation);
    window.dispatchEvent(new CustomEvent('presentationCreated', { detail: editPresentation }));
  };

  // add slide logic, create new empty slide
  const handleAddSlide = async () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      elements: [],
      background: "#ffffff",
    };
    
    const updatedSlides = [...(presentation.slides || []), newSlide];
    const updatedPresentation = { ...presentation, slides: updatedSlides };

    setPresentation(updatedPresentation);
    setCurrentSlideIndex(updatedSlides.length - 1);
    await savePresentation(updatedPresentation);
  }

  // move back one slide
  const handlePrevSlide = () => {
    if (!isFirstSlide && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // move forward one slide
  const handleNextSlide = () => {
    if (!isLastSlide && currentSlideIndex >= 0) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handlePrevSlide();
      }

      if (event.key === "ArrowRight") {
        handleNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [currentSlideIndex, presentation]);

  // delete slide
  const handleDeleteSlide = async () => {
    if (slideCount === 1) {
      setError("There is only one slide left. Please delete the presentation.")
      return;
    }

    const updatedSlides = presentation.slides.filter(slide => slide.id !== currentSlideId);
    const newSlideIndex = currentSlideIndex > 0 ? currentSlideIndex - 1: 0; 

    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    setCurrentSlideIndex(newSlideIndex);
    await savePresentation(updatedPresentation);
  };

  // update element in a slide when element changed
  const handleElementsChange = async (updatedElements) => {
    const updatedSlides = presentation.slides.map(slide =>
      slide.id === currentSlideId
        ? { ...slide, elements: updatedElements }
        : slide
    );
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    await savePresentation(updatedPresentation);
  };

  // add element in a slide when element craeted
  const handleAddElement = (newElement) => {
    handleElementsChange([...(currentSlide.elements || []), newElement]);
  };

  const getCurrentLayer = () => {
    return currentSlide?.elements?.length || 0;
  }

  const handleReorderSlides = async (reorderSlides) => {
    const updatePresentation = { ...presentation, slides: reorderSlides };
    setPresentation(updatePresentation);
    await savePresentation(updatePresentation);
  }

  if (loading) return <div>Loading...</div>;
  if (!presentation) return <div>Presentation not found</div>;

  return (
    <>
      <Alert type="error" message={error} onClose={() => setError('')} />
      <div className="h-screen flex flex-col ml-20 bg-white text-white">
        <Toolbar
          onAddSlide={handleAddSlide}
          onAddElement={handleAddElement}
          getCurrentLayer={getCurrentLayer}
          onDeleteSlide={handleDeleteSlide}
        />
        <div className="flex flex-row justify-between items-center px-6 py-3 h-14 bg-linear-to-t to-sky-500 from-sky-500">
          <div className="flex items-center gap-2 mx-2">
            <img
              className="w-10 h-10 rounded bg-gray-200"
              src={presentation.thumbnail || null}
            />
            <h1 className="text-lg font-semibold">{presentation.name}</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer text-xl px-1 object-contain"
            >
              <img
                className='w-5 h-5 invert brightness-0 invert-[1]'
                src={editIcon} alt="Edit"
              />
            </button>
          </div>
          <div className="text-sm text-white">
            {slideCount} Slides
          </div>
        </div>
        <div className={`flex-grow flex justify-center items-center bg-gray-300 overflow-hidden min-h-0 transition-all duration-300 ${isPanelOpen ? 'p-10' : 'p-8'}`}>
          <button
            onClick={handlePrevSlide}
            disabled={isFirstSlide}
            className={`mr-3 px-4 py-2 bg-blue-500 text-white rounded ${isFirstSlide ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
          >
                    ←
          </button>
          <div className={`bg-white w-full aspect-video shadow-2xl flex items-center justify-center text-black relative z-10 ${isPanelOpen ? 'max-w-4xl' : 'max-w-5xl'}`}>
            {currentSlide && (
              <Canvas
                elements={currentSlide.elements || []}
                onElementsChange={handleElementsChange}
              />
            )}
            <p className="text-gray-500 bottom-2 left-2 absolute">{currentSlideIndex + 1}</p>
          </div>
          <button
            onClick={handleNextSlide}
            className={`ml-3 px-4 py-2 bg-blue-500 text-white rounded ${isLastSlide ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'}`}
          >
                    →
          </button>
        </div>
        <SlideControlPanel
          slides={presentation.slides}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          slideCount={slideCount}
          isOpen={isPanelOpen}
          setIsOpen={setIsPanelOpen}
          onReorderSlides={handleReorderSlides}
        />
      </div>
      <UpsertSlideModal
        isOpen={isModalOpen}
        presentationToEdit={presentation}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default PresentationEditor;