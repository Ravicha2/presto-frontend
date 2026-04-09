import React, { useState } from "react";
import Alert from "./Alert";
import { createTextElement } from "../utils/elementFactory";

const AddTextModal = ({ isOpen, onClose, onSuccess, layer }) => {
    const [textWidth, setTextWidth] = useState(0);
    const [textHeight, setTextHeight] = useState(0);
    const [text, setText] = useState("");
    const [fontSize, setFontSize] = useState(0);
    const [color, setColor] = useState("");
    const [error, setError] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();
        const newElement = createTextElement(
            {
                width: textWidth,
                height: textHeight,
                text: text,
                fontSize: fontSize,
                color: color
            },
            layer
        );
        onSuccess(newElement);
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-25">
                <div className="bg-gray-200 rounded-lg p-6 w-full max-w-xl shadow-xl">  
                    <h1 className="text-xl font-semibold mb-4 text-black">New Text</h1>
                    <form onSubmit={handleCreate}>
                        <div className="flex flex-row justify-between">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black text-left">Box Width</label>
                                <input
                                    type="number"
                                    value={textWidth}
                                    onChange={(e) => setTextWidth(Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="Enter Box Width"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black text-left">Box Height</label>
                                <input
                                    type="number"
                                    value={textHeight}
                                    onChange={(e) => setTextHeight(Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="Enter Box Height"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black text-left">Font Size</label>
                                <input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="2em"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black text-left">Text Colour</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="#FFFFFF"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-black text-left">Content</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                placeholder="Your text goes here"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddTextModal