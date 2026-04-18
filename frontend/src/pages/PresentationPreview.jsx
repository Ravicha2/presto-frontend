import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Canvas from '../components/Canvas';

const PresentationPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [presentation, setPresentation] = useState(null);
    const [loading, setLoading] = useState(true);

    const slideParam = searchParams.get('slide');
    const currentSlideIndex = slideParam ? parseInt(slideParam, 10) : 0;

    const [transition, setTransition] = useState(null);

    useEffect(() => {
        const fetchPresentation = async () => {
        try {
            const response = await api.GET('/store');
            const currentPresentation = response.store.presentations.find(p => p.id === id);
            setPresentation(currentPresentation);
        } finally {
            setLoading(false);
        }
        };

        fetchPresentation();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                handlePrevSlide();
            }
    
            if (event.key === "ArrowRight") {
                handleNextSlide();
            }
    
            if (event.key === "Escape") {
                navigate(`/presentation/${id}?slide=${currentSlideIndex}`);
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentSlideIndex, navigate, id, presentation]);

    const setCurrentSlideIndex = (index) => {
        setSearchParams({ slide: index.toString() });
    };

    if (loading) return <div>Loading...</div>;
    if (!presentation) return <div>Presentation not found</div>;

    const slides = presentation.slides || [];
    const slideCount = slides.length;
    const currentSlide = slides[currentSlideIndex] ?? null;

    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === slideCount - 1;

    const handlePrevSlide = () => {
        if (isFirstSlide || transition) return;
        
        setTransition({
            from: currentSlideIndex,
            to: currentSlideIndex - 1,
            direction: "prev",
        });
        
        setTimeout(() => {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setTransition(null);
        }, 300);
        };
        
        const handleNextSlide = () => {
        if (isLastSlide || transition) return;
        
        setTransition({
            from: currentSlideIndex,
            to: currentSlideIndex + 1,
            direction: "next",
        });
        
        setTimeout(() => {
            setCurrentSlideIndex(currentSlideIndex + 1);
            setTransition(null);
        }, 300);
    };

    const renderSlide = (slide, extraClass = "") => {
        if (!slide) return null;
        
        return (
            <div className={`absolute inset-0 ${extraClass}`}>
            <Canvas
                elements={slide.elements || []}
                onElementsChange={() => {}}
                previewMode={true}
                themeBackground={slide.background || null}
            />
            </div>
        );
    };

    return (
        <div className="w-screen h-screen bg-gray-900 relative overflow-hidden">
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                    type="button"
                    onClick={handlePrevSlide}
                    disabled={isFirstSlide}
                    className="px-3 py-2 rounded bg-black/60 text-white disabled:opacity-40"
                >
                    ←
                </button>
                <button
                    type="button"
                    onClick={handleNextSlide}
                    disabled={isLastSlide}
                    className="px-3 py-2 rounded bg-black/60 text-white disabled:opacity-40"
                >
                    →
                </button>
                <button
                    type="button"
                    onClick={() => window.close()}
                    className="px-3 py-2 rounded bg-red-600 text-white"
                >
                    Exit
                </button>
            </div>

            <div className="w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="w-full h-full relative bg-white overflow-hidden">
                    {!transition && currentSlide && renderSlide(currentSlide)}

                    {transition && (
                    <>
                        {renderSlide(
                            slides[transition.from],
                            transition.direction === "next"
                                ? "slide-out-left"
                                : "slide-out-right"
                        )}

                        {renderSlide(
                            slides[transition.to],
                            transition.direction === "next"
                                ? "slide-in-right"
                                : "slide-in-left"
                        )}
                    </>
                    )}

                    <p className="text-gray-500 bottom-4 left-4 absolute z-10">
                        {transition ? transition.to + 1 : currentSlideIndex + 1}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PresentationPreview;