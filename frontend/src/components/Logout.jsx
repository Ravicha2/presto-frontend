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
        className='text-md font-bold text-white flex flex-row-reverse p-2 rounded bg-blue-500 hover:bg-blue-600'
      >
                Logout
      </button>
    </>
  );
}
  
export default  LogOut