import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Toolbar from '../components/Toolbar';
import UpsertSlideModal from '../components/UpsertSlideModal';
import Alert from '../components/Alert';

const PresentationEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState(null);
    const [currentSlideId, setCurrentSlideId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        if (presentation?.slides?.length > 0 && !currentSlideId) {
            setCurrentSlideId(presentation.slides[0].id);
        }
    }, [presentation, currentSlideId]);

    const currentSlide = presentation?.slides?.find(slide => slide.id === currentSlideId);
    const currentSlideIndex = presentation?.slides?.findIndex(slide => slide.id === currentSlideId) ?? -1;

    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide =  currentSlideIndex === (presentation?.slides?.length ?? 0) -1;
    const slideCount = presentation?.slides.length ?? 0;

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

    const handleCreateSuccess = (editPresentation) => {
        setPresentation(editPresentation);
        window.dispatchEvent(new CustomEvent('presentationCreated', { detail: editPresentation }));
    };

    const handleAddSlide = async () => {
        const newSlide = {
            id: `slide-${Date.now()}`,
            elements: [],
            background: "#ffffff",
        };
    
        const updatedSlides = [...(presentation.slides || []), newSlide];
        const updatedPresentation = { ...presentation, slides: updatedSlides };

        setPresentation(updatedPresentation);
        setCurrentSlideId(newSlide.id);
        await savePresentation(updatedPresentation);
    }

    const handlePrevSlide = () => {
        if (!isFirstSlide && currentSlideIndex > 0) {
            setCurrentSlideId(presentation.slide[currentSlideIndex - 1].id);
        }
    };

    const handleNextSlide = () => {
        if (!isFirstSlide && currentSlideIndex > 0) {
            setCurrentSlideId(presentation.slides[currentSlideIndex + 1].id)
        }
    };

    const handleDeleteSlide = async () => {
        if (slideCount === 1) {
            setError("There is only one slide left. Please delete the presentation.")
            return;
        }

        const updatedSlides = presentation.slides.filter(slide => slide.id !== currentSlideId);
        let newSlideId;
        if (currentSlideIndex > 0) {
            newSlideId = updatedSlides[currentSlideIndex - 1]?.id
        } else {
            newSlideId = updatedSlides[0].id;
        }

        const updatedPresentation = { ...presentation, slides: updatedSlides };
        setPresentation(updatedPresentation);
        setCurrentSlideId(newSlideId);
        await savePresentation(updatedPresentation);
    };

    const handleAddElement = async (newElement) => {
        const updatedSlides = presentation.slides.map(slide => 
            slide.id === currentSlideId
                ? { ...slide, elements: [...(slide.elements || []), newElement] }
                : slide
        );

        const updatedPresentation = { ...presentation, slides: updatedSlides };
          setPresentation(updatedPresentation);
          await savePresentation(updatedPresentation);
    };

    const getCurrentLayer = () => {
        return currentSlide?.elements?.length || 0;
    }

    if (loading) return <div>Loading...</div>;
    if (!presentation) return <div>Presentation not found</div>;

    return (
        <>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <div className="min-h-screen flex flex-col ml-20 bg-gray-900 text-white">
            <Toolbar
                onAddSlide={handleAddSlide}
                onAddElement={handleAddElement}
                getCurrentLayer={getCurrentLayer}
                onDeleteSlide={handleDeleteSlide}
            />
            <div className="flex flex-row justify-between items-center px-6 py-3 h-14 bg-linear-to-t to-sky-500 from-sky-500">
                <div className="flex items-center gap-4 mx-2">
                    <img 
                        className="w-10 h-10 rounded bg-gray-200"
                        src={presentation.thumbnail || null}
                    />
                    <h1 className="text-lg font-semibold">{presentation.name}</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="cursor-pointer"
                    >
                        📝
                    </button>
                </div>
                <div className="text-sm text-white">
                    {slideCount} Slides
                </div>
            </div>
            <div className="flex-grow flex justify-center items-center p-8 bg-gray-300 overflow-y-auto">
                <button
                    onClick={handlePrevSlide}
                    disabled={isFirstSlide}
                    className={`mr-3 px-4 py-2 bg-blue-500 text-white rounded ${isFirstSlide ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                >
                    ←
                </button>
                <div className="bg-white w-full max-w-5xl aspect-video shadow-2xl flex items-center justify-center text-black">
                    {currentSlide ? (
                        currentSlide.elements?.length > 0 ? (
                            currentSlide.elements.map((element) => (
                                <div
                                    key={element.id}
                                    style={{
                                        position: 'absolute',
                                        left: `${element.x}px`,
                                        top: `${element.y}px`,
                                        width: `${element.width}px`,
                                        height: `${element.height}px`,
                                        fontSize: `${element.fontSize}em`,
                                        color: element.color,
                                    }}
                                >
                                    {element.type === 'text' && element.text}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Slide {currentSlideIndex + 1}</p>
                        )
                    ) : (
                        <p className="text-gray-500">No slide yet</p>
                    )}
                </div>
                <button
                    onClick={handleNextSlide}
                    className={`ml-3 px-4 py-2 bg-blue-500 text-white rounded ${isLastSlide ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'}`}
                >
                    →
                </button>
            </div>
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