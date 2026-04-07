import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Toolbar from '../components/Toolbar';
import UpsertSlideModal from '../components/UpsertSlideModal'
import Alert from '../components/Alert';

const PresentationEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
                // load not found slide?
            }
        };
        fetchPresentation()
        window.addEventListener('presentationCreated', fetchPresentation);
        return () => window.removeEventListener('presentationCreated', fetchPresentation)
    }, [id, navigate])

    if (loading) return <div>Loading...</div>;
    if (!presentation) return <div>Presentation not found</div>;

    const currentSlide = presentation.slides?.[currentSlideIndex];

    const handleCreateSuccess = (editPresentation) => {
        setPresentation(editPresentation);
        window.dispatchEvent(new CustomEvent('presentationCreated', { detail: editPresentation }));
    }

    return (
        <>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <div className="min-h-screen flex flex-col ml-20 bg-gray-900 text-white">
            <Toolbar />
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
                    {presentation.slides?.length || 0} Slides
                </div>
            </div>
            <div className="flex-grow flex justify-center p-8 bg-gray-300 overflow-y-auto">
                
                <div className="bg-white w-full max-w-5xl aspect-video shadow-2xl flex items-center justify-center text-black">
                    <p className="text-gray-500">
                        Content for Slide {currentSlideIndex + 1} goes here
                    </p>
                </div>

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