import React from 'react';

import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-grow justify-center">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage