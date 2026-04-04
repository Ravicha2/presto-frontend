import { React, useState } from 'react';
import Alert from './Alert'
import api from '../utils/api'

const CreateSlideModal = ({ isOpen, onClose, onSuccess}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;
        setLoading(true);

        try {
            const { store } = await api.GET('/store');
            const newPresentation = {
                id: Date.now().toString(),
                name: name.trim(),
                description: description.trim(),
                thumbnail: thumbnail,
                createdAt: new Date().toISOString(),
            };
            const presentations = store.presentations || [];
            const updateStore = {
                ...store,
                presentation: [...presentations, newPresentation]
            }
            await api.PUT('/store', { store: updateStore });
            onSuccess(newPresentation);
            onClose();
        } catch (error) {
            console.error('Failed to create presentation:', error);
            setError('Failed to create presentation, Please try again.')
        } finally {
            setLoading(false)
        }
    };
    return (
        <>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-25">
                <div className="bg-gray-500 rounded-lg p-6 w-full max-w-xl shadow-xl">  
                    <h1 className="text-xl font-semibold mb-4 text-black">New Presentation</h1>
                    <form onSubmit={handleCreate}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-black text-left">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                                placeholder="Enter presentation name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-black text-left">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>
                        <div className="mb-4 flex flex-col items-start">
                            <label className="block text-sm font-medium mb-1 text-black text-left">Thumbnail</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                className="text-sm border rounded p-2"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateSlideModal;