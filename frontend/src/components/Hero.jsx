import React from 'react';

export default function Hero() {
    return (
        <>
            <div className="flex flex-row">
                <main className="flex-grow">
                    <section className="flex flex-col justify-center text-center p-20">
                        <h2 className="font-extrabold mb-6">Make better presentations</h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                            Create exceptional slide decks in half the time using intuitive design tools and machine learning. Present remotely or on-site.
                        </p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">Get Started</button>
                    </section>
                </main>
            </div>
        </>
    )
}
