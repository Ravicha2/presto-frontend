import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Alert from './Alert';

const ConfirmDeletePopup = ({ isOpen, onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            api.GET(`/store`).then(response => {
                const current = response.store.presentations.find(p => p.id === id);
                setPresentation(current);
            });
        }
    }, [isOpen, id]);
    if (!isOpen) return null;
    if (!presentation) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await api.GET("/store");
            const filteredPresentations = response.store.presentations.filter(p => p.id !== id);   
            await api.PUT(`/store`, {                                          
                store: {                                                       
                    ...response.store,                    
                    presentations: filteredPresentations
                }
            });
            onClose();
            navigate('/dashboard');
        } catch (error) {
            console.error(error)
            setError('delete failed')
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Alert type="error" message={error} onClose={() => setError('')} />
                <div className="bg-white p-6 rounded-lg">
                    <h3 className='text-black font-bold'>Are you sure?</h3>
                    <p className='text-black mb-10'> {presentation.name} will permanently deleted</p>
                    <button 
                        onClick={onClose}
                        className='text-black mx-6'
                    >
                        No
                    </button>
                    <button 
                        onClick={handleDelete}
                        className='text-white bg-red-500 mx-6 p-2 rounded'
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Yes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConfirmDeletePopup