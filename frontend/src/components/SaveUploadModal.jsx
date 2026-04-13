import React, { useEffect, useState } from "react";
import Alert from "./Alert";

const SaveUploadModal = ({ isOpen, onClose }) => {
    const [uploadMode, setUploadMode] = useState(null);
    const [file, setFile] = useState(null);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [width, setWidth] = useState(30);
    const [height, setHeight] = useState(30);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setUploadMode("image");
            setFile(null);
            setPosX(0);
            setPosY(0);
            setWidth(30);
            setHeight(30);
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setUploadMode(null);
        setFile(null);
        setError("");
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError(`Please select a ${uploadMode} file`);
            return;
        }
        handleClose();
    };

    const isImage = uploadMode === "image";

    return (
        <>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <div className="fixed inset-0 z-40" onClick={handleClose} />
            <div className="fixed right-0 top-14 h-full w-90 z-50 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
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
                                video
                        </button>
                    </div>
                        <>
                            <form className="mt-2" 
                                onSubmit={handleSubmit}
                            >
                                <div className="mb-4 mx-2">
                                    <label className="block text-xs font-medium mb-1 text-black text-left">
                                        {isImage ? "Image" : "Video"}
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                        <input
                                            type="file"
                                            accept={isImage ? "image/*" : "video/*"}
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            {file ? (
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                            ) : (
                                                <>
                                                    <p className="text-2xl mb-1">{isImage ? "🖼️" : "🎬"}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Click to select {isImage ? "an image" : "a video"}
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-start gap-2 ml-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isImage ? "Upload Image" : "Upload Video"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </>
                </div>
            </div>
        </>
    );
};

export default SaveUploadModal;