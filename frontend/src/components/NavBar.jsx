import React from 'react';
import { Link } from 'react-router-dom';
import LogOut from './Logout';

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("token") ? true : false;
  return (
    <nav className="flex justify-between absolute top-0 left-0 w-full p-4"> 
        {
          isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-xl font-bold text-white" style={{ color: 'white' }}>Presto</Link> 
              <LogOut />
            </>
          ) : (
            <Link to="/" className="text-xl font-bold text-white" style={{ color: 'white' }}>Presto</Link>
          )}
    </nav>
  );
}

export default  Navbar