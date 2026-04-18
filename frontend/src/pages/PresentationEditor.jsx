import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../utils/api';
import Toolbar from '../components/Toolbar';
import UpsertSlideModal from '../components/UpsertSlideModal';
import Alert from '../components/Alert';
import SlideControlPanel from '../components/SlideControlPanel';
import ConfirmPopup from '../components/ConfirmPopup';
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
  const [isDeleteOpen, setIsDelteOpen] = useState(false);

  const handleApplyThemeBackground = async ({ scope, background }) => {
    const withRevision = captureRevision(presentation);

    if (scope == "current") {
      const updatedSlides = presentation.slides.map((slide, index) =>
        index === currentSlideIndex
          ? { ...slide, background }
          : slide
      );

      const updatedPresentation = { ...withRevision, slides: updatedSlides };
      setPresentation(updatedPresentation);
      await savePresentation(updatedPresentation);

      return;
    }

    if (scope === "default") {
      const previousDefault = presentation.defaultBackground || {
        type: "color",
        color: "#ffffff",
      };

      const updatedSlides = presentation.slides.map((slide) => {
        const isUsingDefault =
          !slide.background ||
          JSON.stringify(slide.background) === JSON.stringify(previousDefault);

        return isUsingDefault
          ? { ...slide, background }
          : slide;
      });

      const updatedPresentation = {
        ...withRevision,
        defaultBackground: background,
        slides: updatedSlides,
      };

      setPresentation(updatedPresentation);
      await savePresentation(updatedPresentation);
    }
  }

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
  const themeBackground = currentSlide?.background || null;

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
      background: presentation.defaultBackground || { type: "color", color: "#ffffff" },
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
      <div className="h-screen flex flex-col md:ml-20 bg-white text-white">
        <Toolbar
          onAddSlide={handleAddSlide}
          onAddElement={handleAddElement}
          getCurrentLayer={getCurrentLayer}
          onDeleteSlide={handleDeleteSlide}
          onApplyThemeBackground={handleApplyThemeBackground}
        />
        <div className="flex flex-row justify-between items-center px-3 md:px-6 py-2 md:py-3 pt-14 md:pt-3 min-h-14 bg-linear-to-t to-sky-500 from-sky-500">
          <div className="flex items-center gap-2 mx-1 md:mx-2 min-w-0">
            {presentation.thumbnail
              ? <img
                className="w-8 h-8 md:w-10 md:h-10 rounded flex-shrink-0"
                src={presentation.thumbnail || null}
                alt="Presentation thumbnail"
              />
              : <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-gray-200 flex-shrink-0"></div>
            }
            <h1 className="text-sm md:text-lg font-semibold truncate">{presentation.name}</h1>
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
          <div className="flex flex-row items-center justify-center flex-shrink-0">
            <PreviewButton onPreview={handlePreview} />

            <button
              className='mx-1 md:mx-3 px-2 md:px-3 py-1 border-1 border-white rounded-md text-white flex items-center bg-transparent hover:bg-sky-600 hover:shadow-xl text-sm md:text-base'
              onClick={() => setIsHistoryOpen(true)}
            >
              <span className="hidden md:inline">History</span>
              <img
                className='w-4 h-4 md:w-5 md:h-5 invert brightness-0 invert-[1] md:ml-2 hover:color-sky-500'
                src={revisionIcon} alt="revision"
              />
            </button>
            <button
              className="m-1 md:m-3 px-2 md:px-3 py-1 rounded hover:bg-blue-500 text-white md:mb-3 border-1 border-white"
              onClick={() => setIsDelteOpen(true)}
            >
              🗑️
            </button>
          </div>
        </div>
        <RevisionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          revisions={presentation.revisions || []}
          onRestore={handleRestoreRevision}
        />
        <div className={`flex-grow flex justify-center items-center bg-gray-300 overflow-hidden min-h-0 transition-all duration-300 ${isPanelOpen ? 'p-2 md:p-10' : 'p-2 md:p-8'}`}>
          <button
            onClick={handlePrevSlide}
            disabled={isFirstSlide}
            className={`mr-1 md:mr-3 px-2 md:px-4 py-2 bg-blue-500 text-white rounded text-sm md:text-base ${isFirstSlide ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
          >
                    ←
          </button>
          <div className={`bg-white w-full aspect-video shadow-2xl flex items-center justify-center text-black relative z-10 max-w-full ${isPanelOpen ? 'md:max-w-4xl' : 'md:max-w-5xl'}`}>
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
            className={`ml-1 md:ml-3 px-2 md:px-4 py-2 bg-blue-500 text-white rounded text-sm md:text-base ${isLastSlide ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'}`}
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
      <ConfirmPopup
        isOpen={isDeleteOpen}
        onClose={() => setIsDelteOpen(false)}
      />
    </>
  );
};

export default PresentationEditor;