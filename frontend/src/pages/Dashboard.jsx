import { React, useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import PresentationCard from '../components/PresentationCard';
import api from '../utils/api';

// dashboard page
const Dashboard = () => {
  const [presentation, setPresentations] = useState([]);

  useEffect(() => {
    // get all presentation
    const fetchPresentation = async () => {
      const { store } = await api.GET('/store');
      setPresentations(store.presentations || []);
    };
    fetchPresentation();
    const handleRefresh = () => fetchPresentation();
    window.addEventListener('presentationCreated', handleRefresh);
    return () => window.removeEventListener('presentationCreated', handleRefresh)
  }, []);

  return (
    <div className='min-h-screen flex flex-col md:ml-20 bg-linear-to-t to-sky-500 from-gray-300'>
      <Toolbar />
      <div className="flex flex-col p-4 pt-16 md:pt-4 w-full items-center">
        <h3 className="text-2xl md:text-4xl font-bold my-5 text-white">Your presentations</h3>
        <div
          className="gap-4 flex flex-wrap justify-center"
        >
          {/* render all presentation fetched from backend */}
          {presentation.map(p => (
            <PresentationCard key={p.id} presentation={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;