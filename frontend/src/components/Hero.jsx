import React from 'react';
import { Link } from 'react-router-dom';

// landing page hero section
const Hero = () => {
    return (
        <>
            <div className="flex flex-row">
                <section className="flex flex-col justify-center text-center p-20">
                    <h1 className="text-5xl mb-2 font-bold text-white">🪄🪄🪄Presto🪄🪄🪄</h1>
                    <h2 className="text-2xl font-extrabold mb-6 text-white">Make better presentations</h2>
                    <p className="text-md text-gray-600 mb-8 max-w-2xl text-white">
                        Create exceptional slide decks in half the time using intuitive design tools and machine learning. Present remotely or on-site.
                    </p>
                    <div className='flex-row'>
                        <Link to="/login" className="inline-block bg-blue-400 text-white px-6 py-2 mx-2 rounded hover:bg-blue-700 transition-colors" style={{ color: 'white' }}>Login</Link>
                        <Link to="/register" className="inline-block bg-blue-400 text-white px-6 py-2 mx-2 rounded hover:bg-blue-700 transition-colors" style={{ color: 'white' }}>Register</Link>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Hero
