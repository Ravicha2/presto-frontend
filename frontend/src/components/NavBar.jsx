import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between absolute top-0 left-0 w-full p-3 md:p-4"> 
      <Link to="/" className="text-xl font-bold text-white" style={{ color: 'white' }}>Presto</Link>
    </nav>
  );
}

export default  Navbar