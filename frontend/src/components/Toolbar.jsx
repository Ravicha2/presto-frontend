import { React, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOut from './Logout';
import UpsertSlideModal from './UpsertSlideModal';
import ConfirmPopup from './ConfirmPopup';
import AddSlideButton from './AddSlideButton';
import SaveTextModal from './SaveTextModal';
import DeleteSlideButton from './DeleteSlideButton';

const Toolbar = ({ onAddSlide, onAddElement, getCurrentLayer, onDeleteSlide }) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDelteOpen] = useState(false);
    const [isAddTextOpen, setIsAddTextOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleCreateSuccess = (newPresentation) => {
        window.dispatchEvent(new CustomEvent('presentationCreated', { detail: newPresentation }));
    }

    return (
        <>
            <aside className='fixed left-0 top-0 h-full w-25 flex flex-col items-center justify-between py-4 gap-4 bg-linear-to-t to-sky-500 from-gray-300'>
                <div className="flex flex-col items-center">
                    <Link to="/dashboard" className="text-xl font-bold text-white mb-4 mx-auto">
                        Presto
                    </Link>
                    {isDashboard && (
                        <>
                            <button 
                            className='px-5 py-3 rounded-full bg-blue-500 text-white mt-10 hover:bg-blue-700'
                            onClick={() => setIsModalOpen(true)}
                            >
                                +
                            </button>
                            <p className='text-white'>create</p>
                        </>
                    )}
                </div>
                {/* add add slide component button */}
                {/* add new slide to the right when clicked */}

                {!isDashboard && (
                    <>
                        <div className="flex flex-col items-center">
                            <AddSlideButton onAddSlide={onAddSlide} />
                            <DeleteSlideButton onDeleteSlide={onDeleteSlide} />
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="px-5 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                                onClick={() => setIsAddTextOpen(true)}
                            >
                                T
                            </button>
                            <p className="text-white">Add Text</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="px-5 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                                onClick={() => setIsUploadOpen(true)}
                            >
                                ⬆
                            </button>
                            <p className="text-white">Upload</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="px-5 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                                // onClick={() => setIsAddTextOpen(true)}
                            >
                                {`</>`}
                            </button>
                            <p className="text-white">Add Code</p>
                        </div>
                    </>
                    )
                }
                <div>
                    {/* on the slide */}
                    {!isDashboard && (
                        <div className="flex flex-col justify-end">
                            {/* delete button */}
                            <button 
                                className="p-3 rounded hover:bg-blue-500 text-white mb-3"
                                onClick={() => setIsDelteOpen(true)}
                            >
                                🗑️
                            </button>
                        </div>
                    )}
                    {/* logout button */}
                    <LogOut />
                </div>
            </aside>
            <UpsertSlideModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
            <ConfirmPopup
                isOpen={isDeleteOpen}
                onClose={() => setIsDelteOpen(false)}
            />
            {!isDashboard && (
                <SaveTextModal
                    isOpen={isAddTextOpen}
                    onClose={() => setIsAddTextOpen(false)}
                    onSuccess={onAddElement}
                    layer={getCurrentLayer()}
                />
            )}
            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 flex top-4 justify-center z-50">
                    <div className="bg-gray-100 rounded-lg p-6 w-80 h-50">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">Select Upload Type</h2>
                        <div className="flex flex-row justify-center gap-3">
                            <button
                                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 font-medium"
                                onClick={() => {
                                    // Handle image upload
                                    setIsUploadOpen(false);
                                }}
                            >
                                🖼️ Image
                            </button>
                            <button
                                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-700 font-medium"
                                onClick={() => {
                                    // Handle video upload
                                    setIsUploadOpen(false);
                                }}
                            >
                                🎬 Video
                            </button>
                        </div>
                        <button
                            className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            onClick={() => setIsUploadOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toolbar;