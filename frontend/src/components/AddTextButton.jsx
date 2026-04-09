import React, { useState } from 'react';
import AddTextModal from './AddTextModal';

const AddTextButton = ({ onSuccess, layer }) => {
    const [isAddTextOpen, setIsAddTextOpen] = useState(false);

    return (
        <>
            <button
                className="px-5 py-3 rounded-full bg-blue-500 text-white mt-3 text-xl hover:bg-blue-700 font-serif"
                onClick={() => setIsAddTextOpen(true)}
            >
                T
            </button>
            <p className="text-white">Add Text</p>
            <AddTextModal
                isOpen={isAddTextOpen}
                onClose={() => setIsAddTextOpen(false)}
                onSuccess={onSuccess}
                layer={layer}
            />
        </>
    );
};

export default AddTextButton;