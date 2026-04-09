import { React, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOut from './Logout';
import UpsertSlideModal from './UpsertSlideModal';
import ConfirmPopup from './ConfirmPopup';
import AddSlideButton from './AddSlideButton';

const Toolbar = ({ onAddSlide }) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDelteOpen] = useState(false);

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

                <div>
                    <AddSlideButton onAddSlide={onAddSlide} />
                </div>
                  
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
                            {/* delete button popup */}
                            <ConfirmPopup
                                isOpen={isDeleteOpen}
                                onClose={() => setIsDelteOpen(false)}
                            />
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
        </>
    );
};

export default Toolbar;