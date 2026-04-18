import { React, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogOut from './Logout';
import UpsertSlideModal from './UpsertSlideModal';
import AddSlideButton from './AddSlideButton';
import SaveTextModal from './SaveTextModal';
import CodeBlockModal from './CodeBlockModal';
import SaveUploadModal from './SaveUploadModal';
import DeleteSlideButton from './DeleteSlideButton';
import homeIcon from '../assets/home.svg'
import uploadIcon from '../assets/cloud-computing-upload-svgrepo-com.svg';
import codeIcon from '../assets/code-svgrepo-com.svg';
import backgroundIcon from '../assets/background-icon.svg';
import ThemeBackgroundModal from './ThemeBackgroundModal';

const Toolbar = ({ onAddSlide, onAddElement, getCurrentLayer, onDeleteSlide, onApplyThemeBackground }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTextOpen, setIsAddTextOpen] = useState(false);
  const [isAddCodeOpen, setIsAddCodeOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [IsThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // when presentation created, dispatch event so modal know that it need to be closed
  const handleCreateSuccess = (newPresentation) => {
    window.dispatchEvent(new CustomEvent('presentationCreated', { detail: newPresentation }));
  }

  return (
    <>
      {/* Mobile: bottom bar */}
      <aside className='fixed bottom-0 left-0 right-0 h-14 md:hidden flex flex-row items-center justify-around px-2 bg-linear-to-t to-sky-500 from-gray-300 z-50 overflow-x-auto'>
        <Link to="/dashboard" className="text-sm font-bold text-white">
          {isDashboard ? 'P' : <img className="w-5 h-5 brightness-0 invert-[1]" src={homeIcon}/>}
        </Link>
        {isDashboard ? (
          <button
            className='px-3 py-1.5 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-700'
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        ) : (
          <>
            <AddSlideButton onAddSlide={onAddSlide} />
            <DeleteSlideButton onDeleteSlide={onDeleteSlide} />
            <button
              className="px-2 py-1.5 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-700 font-serif"
              onClick={() => setIsAddTextOpen(true)}
            >
              T
            </button>
            <button
              className="px-2 py-1.5 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-700"
              onClick={() => setIsUploadOpen(true)}
            >
              <img className='w-5 h-5 brightness-0 invert-[1]' src={uploadIcon}/>
            </button>
            <button
              className="px-2 py-1.5 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-700"
              onClick={() => setIsAddCodeOpen(true)}
            >
              <img className='w-5 h-5 brightness-0 invert-[1]' src={codeIcon}/>
            </button>
            <button
              className="px-2 py-1.5 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-700"
              onClick={() => setIsThemeModalOpen(true)}
            >
              <img className='w-5 h-5 brightness-0 invert-[1]' src={backgroundIcon}/>
            </button>
          </>
        )}
        <LogOut />
      </aside>

      {/* Desktop: left sidebar */}
      <aside className='hidden md:flex fixed left-0 top-0 h-full w-25 flex-col items-center justify-between py-4 gap-2 bg-linear-to-t to-sky-500 from-gray-300 overflow-y-auto z-50'>
        {/* top left logo */}
        <div className="flex flex-col items-center">
          <Link to="/dashboard" className="text-xl font-bold text-white mb-4 mx-auto">
            {isDashboard ? 'Presto' : <img className="w-7 h-7 brightness-0 invert-[1]" src={homeIcon}/> }
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
              <p className='text-white text-xs'>create</p>
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
              <p className="text-white text-xs">Add Text</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="px-3 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsUploadOpen(true)}
              >
                <img className='w-7 h-7' src={uploadIcon}/>
              </button>
              <p className="text-white text-xs">Upload</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="px-3 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsAddCodeOpen(true)}
              >
                <img className='w-7 h-7 brightness-0 invert-[1]' src={codeIcon}/>
              </button>
              <p className="text-white text-xs">Add Code</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="px-3 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsThemeModalOpen(true)}
              >
                <img className='w-7 h-7 brightness-0 invert-[1]' src={backgroundIcon}/>
              </button>
              <p className="text-white text-xs">Set Theme</p>
            </div>
          </>
        )
        }
        <div>
          {/* logout button */}
          <LogOut />
        </div>
      </aside>
      <UpsertSlideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
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
            onApply={onApplyThemeBackground}
          />
        </>
      )}
    </>
  );
};

export default Toolbar;