import React, { useEffect, useState } from "react";
import Alert from "./Alert";

const UploadVideo = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [width, setWidth] = useState(30);
    const [height, setHeight] = useState(30);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a Video file");
            return;
        }
        onClose();
    };

    const handleClose = () => {
        setFile(null);
        setError("");
        onClose();
    };

    return (
        <>
            <form className="mt-2" 
                onSubmit={handleSubmit}
            >
                <div className="mb-4 mx-2">
                    <label className="block text-xs font-medium mb-1 text-black text-left">
                        Video
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <span className="text-sm text-gray-700">{file.name}</span>
                            ) : (
                                <>
                                    <p className="text-2xl mb-1">🎬</p>
                                    <p className="text-xs text-gray-500">
                                        Click to select Video
                                    </p>
                                </>
                            )}
                        </label>
                    </div>
                </div>
                <div className="flex justify-end gap-2 ml-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        Upload Video
                    </button>
                </div>
            </form>
        </>
    )
}

export default UploadVideo;