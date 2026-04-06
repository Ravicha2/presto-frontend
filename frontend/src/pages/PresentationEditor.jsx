import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Toolbar from '../components/Toolbar';

const PresentationEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);

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
                // load not found slide?
            }
        };
        fetchPresentation();
    }, [id, navigate])
    if (loading) return <div>Loading...</div>;
    console.log(presentation)
    if (!presentation) return <div>Presentation not found</div>;

    const currentSlide = presentation.slides?.[currentSlideIndex];

    return (
        <div className="min-h-screen flex flex-col ml-20">
            <Toolbar />
            <h1>{presentation.name}</h1>
            <div>slide {currentSlideIndex+1} of {presentation.slides?.length || 0}</div>
        </div>
    );
};

export default PresentationEditor;