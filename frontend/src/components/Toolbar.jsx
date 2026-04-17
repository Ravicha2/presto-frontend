import { React, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOut from './Logout';
import UpsertSlideModal from './UpsertSlideModal';
import ConfirmPopup from './ConfirmPopup';
import AddSlideButton from './AddSlideButton';
import SaveTextModal from './SaveTextModal';
import CodeBlockModal from './CodeBlockModal';
import SaveUploadModal from './SaveUploadModal';
import DeleteSlideButton from './DeleteSlideButton';
import uploadIcon from '../assets/cloud-computing-upload-svgrepo-com.svg';
import codeIcon from '../assets/code-svgrepo-com.svg';
import ThemeBackgroundButton from './ThemeBackgroundButton';
import backgroundIcon from '../assets/background-icon.svg';
import ThemeBackgroundModal from './ThemeBackgroundModal';

const Toolbar = ({ onAddSlide, onAddElement, getCurrentLayer, onDeleteSlide }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDelteOpen] = useState(false);
  const [isAddTextOpen, setIsAddTextOpen] = useState(false);
  const [isAddCodeOpen, setIsAddCodeOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [IsThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // when presentation created, dispatch event so modal know that it need to be closed
  const handleCreateSuccess = (newPresentation) => {
    window.dispatchEvent(new CustomEvent('presentationCreated', { detail: newPresentation }));
  }

  const handleApplyThemeBackground = (backgroundSettings) => {
    console.log(backgroundSettings);
  }

  return (
    <>
      <aside className='fixed left-0 top-0 h-full w-25 flex flex-col items-center justify-between py-4 gap-4 bg-linear-to-t to-sky-500 from-gray-300'>
        {/* top left logo */}
        <div className="flex flex-col items-center">
          <Link to="/dashboard" className="text-xl font-bold text-white mb-4 mx-auto">
                        Presto
          </Link>
          {/* if dashboard, render add presentation button. else render the slide tools */}
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

        {/* add / delete slide button */}
        {!isDashboard && (
          <>
            <div className="flex flex-col items-center">
              <AddSlideButton onAddSlide={onAddSlide} />
              <DeleteSlideButton onDeleteSlide={onDeleteSlide} />
            </div>
            {/* slide tools - text, upload(image & video), code */}
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
                className="px-3 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsUploadOpen(true)}
              >
                <img className='w-7 h-7' src={uploadIcon}/>
              </button>
              <p className="text-white">Upload</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="px-3 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsAddCodeOpen(true)}
              >
                <img className='w-7 h-7 brightness-0 invert-[1]' src={codeIcon}/>
              </button>
              <p className="text-white">Add Code</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="px-3 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsThemeModalOpen(true)}
              >
                <img className='w-7 h-7 brightness-0 invert-[1]' src={backgroundIcon}/>
              </button>
              <p className="text-white">Set Theme</p>
            </div>
          </>
        )
        }
        <div>
          {/* also delete presentation button */}
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
        <>
          <SaveTextModal
            isOpen={isAddTextOpen}
            onClose={() => setIsAddTextOpen(false)}
            onSuccess={onAddElement}
            layer={getCurrentLayer()}
          />
          <SaveUploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onSuccess={onAddElement}
            layer={getCurrentLayer()}
          />
          <CodeBlockModal
            isOpen={isAddCodeOpen}
            onClose={() => setIsAddCodeOpen(false)}
            onSuccess={onAddElement}
            layer={getCurrentLayer()}
          />
          <ThemeBackgroundModal
            isOpen={IsThemeModalOpen}
            onClose={() => setIsThemeModalOpen(false)}
            onApply={handleApplyThemeBackground}
          />
        </>
      )}
    </>
  );
};

export default Toolbar;