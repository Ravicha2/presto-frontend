import React from 'react';

import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

// simple landing page
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col h-14 bg-linear-to-t from-sky-500 to-indigo-500">
      <Navbar />
      <main className="flex flex-grow justify-center">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage