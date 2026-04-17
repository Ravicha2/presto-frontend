import React, { useState } from "react";

const ThemeBackgroundModal = ({ isOpen, onClose, onApply }) => {
    const [backgroundType, setBackgroundType] = useState("color");
    const [solidColor, setSolidColor] = useState("#ffffff");
    const [gradientFrom, setGradientFrom] = useState("#60a5fa");
    const [gradientTo, setGradientTo] = useState("#cbd5e1");
    const [gradientDirection, setGradientDirection] = useState("to bottom");
    const [imageUrl, setImageUrl] = useState("");
    const [imageMode, setImageMode] = useState("url");
    const [uploadedImage, setUploadedImage] = useState("");

    const handleApply = () => {
        let backgroundSettings;

        if (backgroundType === "color") {
            backgroundSettings = {
                type: "color",
                color: solidColor,
            };
        } else if (backgroundType === "gradient") {
            backgroundSettings = {
                type: "gradient",
                from: gradientFrom,
                to: gradientTo,
                direction: gradientDirection,
            };
        } else {
            backgroundSettings = {
                type: "image",
                imageUrl: imageMode === "upload" ? uploadedImage : imageUrl,
            }
        }

        onApply(backgroundSettings);
        resetImageState(); 
        onClose();
    }

    const resetImageState = () => {
        setImageUrl("");
        setImageMode("url");
        setUploadedImage("");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();

        reader.onloadend = () => {
            setUploadedImage(reader.result);
        }

        reader.readAsDataURL(file);
    }

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
                    <>
                        <div className="mb-2 mx-2">
                        <div className="flex justify-around border border-gray-300 rounded">
                            <button
                                type="button"
                                className={`w-full py-1 text-sm ${
                                    imageMode === "url" ? "bg-blue-500 text-white" : "bg-transparent text-black"
                                }`}
                                onClick={() => setImageMode("url")}
                                >
                                URL
                            </button>
                            <button
                                type="button"
                                className={`w-full py-1 text-sm ${
                                    imageMode === "upload" ? "bg-blue-500 text-white" : "bg-transparent text-black"
                                }`}
                                onClick={() => setImageMode("upload")}
                                >
                                Upload
                            </button>
                        </div>
                        </div>

                        {imageMode === "url" ? (
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
                        ) : (
                            <div className="mb-2 mx-2">
                            <label className="block text-xs font-medium mb-1 text-black text-left">
                              Upload Image
                            </label>
                          
                            <input
                              id="background-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          
                            <label
                              htmlFor="background-image-upload"
                              className="w-full h-28 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                            >
                              {uploadedImage ? (
                                <>
                                  <img
                                    src={uploadedImage}
                                    alt="Uploaded preview"
                                    className="w-10 h-10 object-contain mb-2"
                                  />
                                  <p className="text-xs text-green-600">Image selected</p>
                                </>
                              ) : (
                                <>
                                  <span className="text-3xl mb-2">🖼️</span>
                                  <p className="text-sm text-gray-500">Click to select image</p>
                                </>
                              )}
                            </label>
                          </div>
                        )}
                    </>
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
                            onClick={handleApply}
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