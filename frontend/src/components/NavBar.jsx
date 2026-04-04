import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = false; // TODO: update after auth fully done
  return (
    <nav className="flex justify-between absolute top-0 left-0 p-4"> 
        {
          isLoggedIn ? 
          <Link to="/dashboard" className="text-xl font-bold text-white" style={{ color: 'white' }}>Presto</Link> 
          : 
          <Link to="/" className="text-xl font-bold text-white" style={{ color: 'white' }}>Presto</Link>
        }
    </nav>
  );
}

export default  Navbar