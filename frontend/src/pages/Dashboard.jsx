import { React, useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import PresentationCard from '../components/PresentationCard';
import api from '../utils/api';

/**
 * List of presentations on Dashboard
 *
 * On the dashboard page, the card for each presentation should appear as rectangles with a 2:1 width:height ratio.
 * Each rectangle should include name, thumbnail (grey square if empty), description (no text if empty) and the Number of slides it contains
 * Rectangles should be evenly spaced in several rows and columns if needed, where each rectangle has a minimum of 100px width, the actual width of rectangles in different viewports should look reasonable.
 */
const Dashboard = () => {
    const [presentation, setPresentations] = useState([]);

    useEffect(() => {
        const fetchPresentation = async () => {
            const { store } = await api.GET('/store');
            setPresentations(store.presentations || []);
        };
        fetchPresentation();
        const handleRefresh = () => fetchPresentation()
        window.addEventListener('presentationCreated', handleRefresh);
        return () => window.removeEventListener('presentationCreated', handleRefresh)
    }, []);
    return (
        <div className='min-h-screen flex flex-col ml-20'>
            <Toolbar />
            <div className="p-4 w-full">
                <h3 className="text-2xl font-bold mb-4">Your presentations</h3>
                <div
                    className="gap-4 flex flex-wrap"
                >
                    {presentation.map(p => (
                        <PresentationCard key={p.id} presentation={p} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;