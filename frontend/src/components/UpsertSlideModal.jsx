import { React, useEffect, useState } from 'react';
import Alert from './Alert'
import api from '../utils/api'
import fileToBase64 from '../utils/encodeFile';

const SaveSlideModal = ({ isOpen, onClose, onSuccess, presentationToEdit=null}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [thumbnailFileName, setThumbnailFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (presentationToEdit) {
            setName(presentationToEdit.name);
            setDescription(presentationToEdit.description);
            setThumbnail(presentationToEdit.thumbnail || '');
            setThumbnailFileName('');
        } else {
            setName('');
            setDescription('');
            setThumbnail('');
            setThumbnailFileName('');
        }
    }, [presentationToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;
        setLoading(true);

        try {
            const { store } = await api.GET('/store');
            const presentations = store.presentations || [];
            let updatedPresentations;
            let editedPresentation;

            if (presentationToEdit){
                editedPresentation = {
                    ...presentationToEdit,
                    name: name.trim(),
                    description: description.trim(),
                    thumbnail: thumbnail
                };
                updatedPresentations = presentations.map((item) => {
                    if (item.id === presentationToEdit.id) {
                        return {
                            ...item,
                            name: name.trim(),
                            description: description.trim(),
                            thumbnail: thumbnail
                        };
                    }
                    return item;
                });
            } else {
                const newPresentation = {
                    id: Date.now().toString(),
                    name: name.trim(),
                    description: description.trim(),
                    thumbnail: thumbnail,
                    createdAt: new Date().toISOString(),
                    slides: [{
                        id: `slide-${Date.now()}`,
                        elements: [],
                        background: "#ffffff",
                    }],
                };
                updatedPresentations = [...presentations, newPresentation];
                editedPresentation = newPresentation;
            }
            const updateStore = {
                ...store,
                presentations: updatedPresentations
            }
            await api.PUT('/store', { store: updateStore });
            onSuccess(editedPresentation)
            onClose();
        } catch (error) {
            setError('Failed to save presentation, Please try again.')
        } finally {
            setLoading(false)
        }
    };
    const isEditing = !!presentationToEdit;
    return (
        <>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-25" onClick={onClose}>
                <div className="bg-gray-200 rounded-lg p-6 w-full max-w-xl shadow-xl">  
                    <h1 className="text-xl font-semibold mb-4 text-black">{isEditing ? "Edit Presentation": "New Presentation"}</h1>
                    <form onSubmit={handleSave}>
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
                            {thumbnail && (
                                <img
                                    src={thumbnail}
                                    alt="Current thumbnail"
                                    className="w-32 h-20 object-cover rounded mb-2 border"
                                />
                            )}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-2 w-full text-center hover:border-blue-400 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={ async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const base64 = await fileToBase64(file)
                                            setThumbnail(base64);
                                            setThumbnailFileName(file.name);
                                        }
                                    }}
                                    className="hidden"
                                    id="thumbnail-upload"
                                />
                                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                    {thumbnailFileName ? (
                                        <span className="text-sm text-gray-700">{thumbnailFileName}</span>
                                    ) : (
                                        <>
                                            <p className="text-2xl mb-1">🖼️</p>
                                            <p className="text-xs text-gray-500">
                                                Click to select thumbnail
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
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
                                {loading ? 'Saving...' : (isEditing ? "Save Changes" : "Create")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SaveSlideModal;