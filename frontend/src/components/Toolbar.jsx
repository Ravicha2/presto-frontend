import { React, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOut from './Logout';
import CreateSlideModal from './CreateSlideModal';
import ConfirmPopup from './ConfirmPopup';

const Toolbar = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDelteOpen] = useState(false);

    const handleCreateSuccess = (newPresentation) => {
        window.dispatchEvent(new CustomEvent('presentationCreated', { detail: newPresentation }));
    }

    return (
        <>
            <aside className='fixed left-0 top-0 h-full w-20 bg-gray-900 flex flex-col items-center justify-between py-4 gap-4'>
                <div>
                    <Link to="/dashboard" className="text-xl font-bold text-white mb-4">
                        Presto
                    </Link>
                    {isDashboard && (
                        <>
                            <button 
                            className='px-5 py-3 rounded-full bg-gray-500 text-white mt-10 hover:bg-gray-700'
                            onClick={() => setIsModalOpen(true)}
                            >
                                +
                            </button>
                            <p>create</p>
                        </>
                    )}
                </div>
                <div>
                    {!isDashboard && (
                        <div className="flex flex-col justify-end">
                            <button 
                                className="p-3 rounded hover:bg-gray-700 text-white mb-3"
                                onClick={() => setIsDelteOpen(true)}
                            >
                                🗑️
                            </button>
                            <ConfirmPopup
                                isOpen={isDeleteOpen}
                                onClose={() => setIsDelteOpen(false)}
                            />
                        </div>
                    )}
                    <LogOut />
                </div>
            </aside>
            <CreateSlideModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSuccess={handleCreateSuccess}
            />
        </>
    );
};

export default Toolbar;