import React, { useEffect, useState } from "react";
import Alert from "./Alert";
import { createTextElement } from "../utils/elementFactory";

const SaveTextModal = ({ isOpen, onClose, onSuccess, layer, mode = "add", element = null }) => {
    const [textWidth, setTextWidth] = useState(10);
    const [textHeight, setTextHeight] = useState(10);
    const [text, setText] = useState("");
    const [fontSize, setFontSize] = useState(2);
    const [color, setColor] = useState("#000000");
    const [posX, setPosX] = useState(0)
    const [posY, setPosY] = useState(0)
    const [error, setError] = useState("");

    const normalizeHexColor = (color) => {
        if (!color) return "#000000";
        const hex = color.replace('#', "");
        if (hex.length === 3) {
            return "#" + hex.split('').map(color => color+color).join('');
        }
        return color
    }

    useEffect(() => {
        if (mode === "edit" && element) {
            setTextWidth(element.width ?? 10);
            setTextHeight(element.height ?? 10);
            setText(element.text ?? "");
            setFontSize(element.fontSize ?? 2);
            setColor(element.color ?? "#000000");
            setPosX(element.x ?? 0);
            setPosY(element.y ?? 0);
        }
    }, [mode, element]);

    useEffect(() => {
        if (isOpen && mode === "add") {
            setTextWidth(10);
              setTextHeight(10);
              setText("");
              setFontSize(2);
              setColor("#000000");
              setPosX(0);
              setPosY(0);
        }
    }, [isOpen, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setError("Text content is required");
            return;
        }

        if (mode === "add") {
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
        } else {
            const updatedElement = {
                ...element,
                width: textWidth,
                height: textHeight,
                text: text,
                fontSize: fontSize,
                color: color,
                x: posX,
                y: posY
            };
            onSuccess(updatedElement);
        }
        onClose();
    };
    
    if (!isOpen) return null;

    const isEditMode = mode === "edit";

    return (
        <>
            <Alert type="error" message={error} onClose={() => setError('')} />
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gray-200 rounded-lg p-3 w-full max-w-xl shadow-xl">  
                    <h1 className="text-md font-semibold mb-2 text-black">
                        {isEditMode ? "Edit Text" : "New Text"}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        {isEditMode && (
                            <div className="flex flex-row justify-between">
                                <div className="mb-2 mx-2">
                                    <label className="block text-xs font-medium mb-1 text-black text-left">X Position</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={posX}
                                        onChange={(e) => setPosX(Number(e.target.value))}
                                        className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    />
                                </div>
                                <div className="mb-2 mx-2">
                                    <label className="block text-xs font-medium mb-1 text-black text-left">Y Position</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={posY}
                                        onChange={(e) => setPosY(Number(e.target.value))}
                                        className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-row justify-between">
                            <div className="mb-2 mx-2">
                                <label className="block text-xs font-medium mb-1 text-black text-left">Box Width</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={textWidth}
                                    onChange={(e) => setTextWidth(Number(e.target.value))}
                                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="Enter Box Width"
                                />
                            </div>
                            <div className="mb-2 mx-2">
                                <label className="block text-xs font-medium mb-1 text-black text-left">Box Height</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={textHeight}
                                    onChange={(e) => setTextHeight(Number(e.target.value))}
                                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="Enter Box Height"
                                />
                            </div>
                            <div className="mb-2 mx-2">
                                <label className="block text-xs text-xs font-medium mb-1 text-black text-left">Font Size</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                                    placeholder="2em"
                                />
                            </div>
                            <div className="mb-2 mx-2">
                                <label className="block text-xs font-medium mb-1 text-black text-left">Text Colour</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={normalizeHexColor(color)}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-8 h-8 cursor-pointer border-0"
                                    />
                                    <span className="text-xs text-gray-600 font-mono">
                                        {color || '#000000'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-2 mx-2">
                            <label className="block text-xs font-medium mb-1 text-black text-left">Content</label>
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

export default SaveTextModal