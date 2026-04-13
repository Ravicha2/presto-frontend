import React, { useState } from "react";
import { createImageElement } from "../utils/elementFactory";
import fileToBase64 from "../utils/encodeFile";


const Uploadimage = ({ onClose, onError, mode="add" ,onSuccess, layer, element }) => {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState(element?.src || '');
    const [posX, setPosX] = useState(element?.x || 0);
    const [posY, setPosY] = useState(element?.y || 0);
    const [width, setWidth] = useState(element?.width || 30);
    const [height, setHeight] = useState(element?.height || 30);
    const [description, setDescription] = useState(element?.alt || "");

    const handleError = (msg) => {
        if (typeof onError === 'function') {
            onError(msg);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (mode === "add" && !file && !url.trim()) {
            handleError('Please select an Image file or input URL');
            return;
        }

        try {
            let src;
            if (file) {
                src = await fileToBase64(file);
            } else if (url.trim()) {
                src = url.trim()
            } else {
                src = element?.src || ''
            }

            if (mode === "edit" && element) {
                const updatedElement = {
                    ...element,
                    src: src,
                    alt: description || file?.name || "image",
                    width,
                    height,
                    x: posX,
                    y: posY,
                };
                onSuccess(updatedElement);
            } else {
                const newElement = createImageElement(
                    {
                        src: src,
                        alt: description || file?.name || "image",
                        width,
                        height,
                    },
                    layer
                );
                onSuccess(newElement);
            }
            handleClose();
        } catch (err) {
            handleError('Failed to process Image');
        }
    };

    const handleClose = () => {
        setFile(null);
        setUrl('');
        onClose();
    };

    return (
        <>
            <form className="mt-2"
                onSubmit={handleSubmit}
            >
                <div className="mb-4 mx-2">
                    <label className="block text-lg font-medium mb-1 text-black text-left">
                        {mode === "add" ? "Upload Image or URL" : "Change Image"}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-3 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <span className="text-sm text-gray-700">{file.name}</span>
                            ) : (
                                <>
                                    <p className="text-2xl mb-1">🖼️</p>
                                    <p className="text-xs text-gray-500">
                                        Click to select image
                                    </p>
                                </>
                            )}
                        </label>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-black text-left">URL</label>
                        <input
                            className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    {mode === "edit" && (
                        <div className="flex flex-row justify-between">
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-black text-left">Position X</label>
                                <input
                                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={posX}
                                    onChange={(e) => setPosX(Number(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-black text-left">Position Y</label>
                                <input
                                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={posY}
                                    onChange={(e) => setPosY(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-row justify-around gap-6 mb-3">
                        <div className="w-full">
                            <label className="block text-xs font-medium mb-1 text-black text-left">Width</label>
                            <input
                                className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                type="number"
                                min="0"
                                max="100"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-xs font-medium mb-1 text-black text-left">Height</label>
                            <input
                                className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                type="number"
                                min="0"
                                max="100"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-black text-left">Description</label>
                        <textarea
                            className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                        {mode === 'add' ? 'Upload Image' : 'Save Change'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default Uploadimage;