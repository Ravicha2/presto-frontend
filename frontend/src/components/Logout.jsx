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
        className='text-xs md:text-md font-bold text-white p-1.5 md:p-2 rounded bg-blue-500 hover:bg-blue-600 whitespace-nowrap'
      >
                Logout
      </button>
    </>
  );
}
  
export default  LogOut