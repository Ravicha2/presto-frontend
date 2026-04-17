import React, { useState } from "react";

const ThemeBackgroundModal = ({ isOpen, onClose }) => {
    const [backgroundType, setBackgroundType] = useState("color");
    const [solidColor, setSolidColor] = useState("#ffffff");
    const [gradientFrom, setGradientFrom] = useState("#60a5fa");
    const [gradientTo, setGradientTo] = useState("#cbd5e1");
    const [gradientDirection, setGradientDirection] = useState("to bottom");
    const [imageUrl, setImageUrl] = useState("");

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[9998]" onClick={onClose} />

            <div
            className="fixed left-25 top-13 h-full w-90 z-[9999] shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
            >
            <div className="w-full max-w-xl p-2">
                <h1 className="text-md font-semibold mb-2 text-black">
                Theme & Background
                </h1>

                <form>
                <div className="mb-2 mx-2">
                    <label className="block text-xs font-medium mb-1 text-black text-left">
                    Background Type
                    </label>
                    <select
                    value={backgroundType}
                    onChange={(e) => setBackgroundType(e.target.value)}
                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                    >
                    <option value="color">Solid Colour</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Image</option>
                    </select>
                </div>

                {backgroundType === "color" && (
                    <div className="mb-2 mx-2">
                    <label className="block text-xs font-medium mb-1 text-black text-left">
                        Background Colour
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                        type="color"
                        value={solidColor}
                        onChange={(e) => setSolidColor(e.target.value)}
                        className="w-8 h-8 cursor-pointer border-0"
                        />
                        <span className="text-xs text-gray-600 font-mono">
                        {solidColor}
                        </span>
                    </div>
                    </div>
                )}

                {backgroundType === "gradient" && (
                    <>
                    <div className="mb-2 mx-2">
                        <label className="block text-xs font-medium mb-1 text-black text-left">
                        Gradient Direction
                        </label>
                        <select
                        value={gradientDirection}
                        onChange={(e) => setGradientDirection(e.target.value)}
                        className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                        >
                        <option value="to bottom">Top to Bottom</option>
                        <option value="to right">Left to Right</option>
                        <option value="to bottom right">Top Left to Bottom Right</option>
                        <option value="to bottom left">Top Right to Bottom Left</option>
                        </select>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="mb-2 mx-2">
                        <label className="block text-xs font-medium mb-1 text-black text-left">
                            From
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                            type="color"
                            value={gradientFrom}
                            onChange={(e) => setGradientFrom(e.target.value)}
                            className="w-8 h-8 cursor-pointer border-0"
                            />
                            <span className="text-xs text-gray-600 font-mono">
                            {gradientFrom}
                            </span>
                        </div>
                        </div>

                        <div className="mb-2 mx-2">
                        <label className="block text-xs font-medium mb-1 text-black text-left">
                            To
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                            type="color"
                            value={gradientTo}
                            onChange={(e) => setGradientTo(e.target.value)}
                            className="w-8 h-8 cursor-pointer border-0"
                            />
                            <span className="text-xs text-gray-600 font-mono">
                            {gradientTo}
                            </span>
                        </div>
                        </div>
                    </div>
                    </>
                )}

                {backgroundType === "image" && (
                    <div className="mb-2 mx-2">
                    <label className="block text-xs font-medium mb-1 text-black text-left">
                        Image URL
                    </label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                        placeholder="Paste image URL here"
                    />
                    </div>
                )}

                <div className="flex justify-end gap-2 ml-2 mt-4">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                    Cancel
                    </button>
                    <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                    Apply
                    </button>
                </div>
                </form>
            </div>
            </div>
        </>
    );
};

export default ThemeBackgroundModal;