import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <>
            <button 
                onClick={handleLogOut}
                className='text-md font-bold text-white flex flex-row-reverse bg-gray-500 p-2 rounded hover:bg-gray-700'
            >
                Logout
            </button>
        </>
    );
  }
  
  export default  LogOut