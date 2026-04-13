import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import Uploadimage from "./ImageModal";
import UploadVideo from "./VideoModal";

const SaveUploadModal = ({ isOpen, onClose, onSuccess, layer }) => {
    const [uploadMode, setUploadMode] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setUploadMode("image");
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setUploadMode(null);
        setError("");
        onClose();
    };

    const isImage = uploadMode === "image";

    return (
        <>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <div className="fixed inset-0 z-40" onClick={handleClose} />
            <div className="fixed left-25 top-13 h-full w-90 z-50 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="w-full max-w-xl p-2">
                    <div className="flex justify-around border border-gray-300 rounded">
                        <button 
                            className={`w-full text-black py-1 ${isImage ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                            onClick={() => setUploadMode("image")}
                        >
                                Image
                        </button>
                        <button 
                            className={`w-full text-black ${!isImage ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                            onClick={() => setUploadMode("video")}
                            >
                                Video
                        </button>
                    </div>
                    {isImage ? 
                        <Uploadimage 
                            onClose={onClose} 
                            onSuccess={onSuccess} 
                            onError={setError} 
                            layer={layer} 
                        /> 
                        : 
                        <UploadVideo 
                            onClose={onClose} 
                            onSuccess={onSuccess} 
                            onError={setError} 
                            layer={layer} 
                        />
                    }
                </div>
            </div>
        </>
    );
};

export default SaveUploadModal;