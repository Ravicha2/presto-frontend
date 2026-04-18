import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../utils/api';
import Toolbar from '../components/Toolbar';
import UpsertSlideModal from '../components/UpsertSlideModal';
import Alert from '../components/Alert';
import SlideControlPanel from '../components/SlideControlPanel';
import Canvas from '../components/Canvas';
import RevisionHistoryModal from '../components/RevisionHistoryModal';
import editIcon from '../assets/edit-button-svgrepo-com.svg';
import revisionIcon from '../assets/history_7.svg'
import PreviewButton from '../components/PreviewButton';

// presentation editor page
const PresentationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [presentation, setPresentation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [themeBackground, setThemeBackground] = useState(null);

  const handleApplyThemeBackground = async (backgroundSettings) => {
    setThemeBackground(backgroundSettings);
  
    const withRevision = captureRevision(presentation);
    const updatedSlides = presentation.slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, background: backgroundSettings }
        : slide
    );
  
    const updatedPresentation = { ...withRevision, slides: updatedSlides };
    setPresentation(updatedPresentation);
    await savePresentation(updatedPresentation);
  };

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const saveQueueRef = useRef(Promise.resolve());
  const lastRevisionTimeRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slideParam = searchParams.get('slide');
  const currentSlideIndex = slideParam ? parseInt(slideParam, 10) : 0;

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

  useEffect(() => {
    setThemeBackground(currentSlide?.background || null);
  }, [currentSlide]);

  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide =  currentSlideIndex === (presentation?.slides?.length ?? 0) -1;
  const slideCount = presentation?.slides.length ?? 0;

  // save new state of presentation (queued to prevent race conditions)
  const savePresentation = (updatedPresentation) => {
    saveQueueRef.current = saveQueueRef.current.then(async () => {
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
    });
    return saveQueueRef.current;
  };

  // shout out when presentation created
  const handleCreateSuccess = (editPresentation) => {
    setPresentation(editPresentation);
    window.dispatchEvent(new CustomEvent('presentationCreated', { detail: editPresentation }));
  };

  // add slide logic, create new empty slide
  const handleAddSlide = async () => {
    const newSlide = {
      id: `slide-${uuidv4()}`,
      elements: [],
      background: { type: "color", color: "#ffffff" },
    };

    const withRevision = captureRevision(presentation);
    const updatedSlides = [...(presentation.slides || []), newSlide];
    const updatedPresentation = { ...withRevision, slides: updatedSlides };

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
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") return;
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

    const withRevision = captureRevision(presentation);
    const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
    const newSlideIndex = currentSlideIndex > 0 ? currentSlideIndex - 1: 0;

    const updatedPresentation = { ...withRevision, slides: updatedSlides };
    setPresentation(updatedPresentation);
    setCurrentSlideIndex(newSlideIndex);
    await savePresentation(updatedPresentation);
  };

  // update element in a slide when element changed
  const handleElementsChange = (updatedElements) => {
    setPresentation((prev) => {
      const slideId = prev.slides?.[currentSlideIndex]?.id;
      const updatedSlides = prev.slides.map(slide =>
        slide.id === slideId
          ? { ...slide, elements: updatedElements }
          : slide
      );
      const withRevision = captureRevision(prev);
      const updatedPresentation = { ...withRevision, slides: updatedSlides };
      savePresentation(updatedPresentation);
      return updatedPresentation;
    });
  };

  // add element in a slide when element craeted
  const handleAddElement = (newElement) => {
    handleElementsChange([...(currentSlide.elements || []), newElement]);
  };

  const getCurrentLayer = () => {
    return currentSlide?.elements?.length || 0;
  }

  const handleReorderSlides = async (reorderSlides) => {
    const withRevision = captureRevision(presentation);
    const updatedPresentation = { ...withRevision, slides: reorderSlides };
    setPresentation(updatedPresentation);
    await savePresentation(updatedPresentation);
  }

  const MAX_REVISIONS = 15;

  const captureRevision = (presentation) => {
    const now = Date.now();
    if (lastRevisionTimeRef.current === null || now - lastRevisionTimeRef.current >= 60000) {
      lastRevisionTimeRef.current = now;
      const newRevision = {
        id: `rev-${now}`,
        timestamp: new Date().toISOString(),
        slides: JSON.parse(JSON.stringify(presentation.slides)),
        slideCount: presentation.slides.length,
      };
      const existingRevisions = presentation.revisions || [];
      const updatedRevisions = [...existingRevisions, newRevision].slice(-MAX_REVISIONS);
      return { ...presentation, revisions: updatedRevisions };
    }
    return presentation;
  };

  const handleRestoreRevision = async (revision) => {
    const updatedPresentation = {
      ...presentation,
      slides: JSON.parse(JSON.stringify(revision.slides)),
    };
    const clampedIndex = Math.min(currentSlideIndex, revision.slides.length - 1);
    setPresentation(updatedPresentation);
    setCurrentSlideIndex(clampedIndex);
    await savePresentation(updatedPresentation);
    setIsHistoryOpen(false);
  };

  const handlePreview = () => {
    const url = `/presentation/${id}/preview?slide=${currentSlideIndex}`;
    window.open(url, '_blank');
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
          onApplyThemeBackground={handleApplyThemeBackground}
        />
        <div className="flex flex-row justify-between items-center px-6 py-3 h-14 bg-linear-to-t to-sky-500 from-sky-500">
          <div className="flex items-center gap-2 mx-2">
            <img
              className="w-10 h-10 rounded bg-gray-200"
              src={presentation.thumbnail || null}
              alt="Presentation thumbnail"
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
          <div className="flex flex-row items-center">
            <PreviewButton onPreview={handlePreview} />

            <button 
              className='mx-3 px-3 py-1 border-1 border-white rounded-md text-white flex items-center bg-transparent hover:bg-sky-600 hover:shadow-xl'
              onClick={() => setIsHistoryOpen(true)}
            >
              History 
              <img
                className='w-5 h-5 invert brightness-0 invert-[1] ml-2 hover:color-sky-500'
                src={revisionIcon} alt="revision"
              />
            </button>
            <div className="text-sm text-white">
              {slideCount} Slides
            </div>
          </div>
        </div>
        <RevisionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          revisions={presentation.revisions || []}
          onRestore={handleRestoreRevision}
        />
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
                themeBackground={themeBackground}
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