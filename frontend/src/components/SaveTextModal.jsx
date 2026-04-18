import React, { useState } from "react";
import Alert from "./Alert";
import { createTextElement } from "../utils/elementFactory";

const SaveTextModal = ({ isOpen, onClose, onSuccess, layer, mode = "add", element = null }) => {
  const [textWidth, setTextWidth] = useState(() => mode === "edit" && element ? (element.width ?? 10) : 10);
  const [textHeight, setTextHeight] = useState(() => mode === "edit" && element ? (element.height ?? 10) : 10);
  const [text, setText] = useState(() => mode === "edit" && element ? (element.text ?? "") : "");
  const [fontSize, setFontSize] = useState(() => mode === "edit" && element ? (element.fontSize ?? 2) : 2);
  const [fontFamily, setFontFamily] = useState(() =>
    mode === "edit" && element ? (element.fontFamily ?? "Arial") : "Arial" 
  );
  const [color, setColor] = useState(() => mode === "edit" && element ? (element.color ?? "#000000") : "#000000");
  const [error, setError] = useState("");

  const normalizeHexColor = (color) => {
    if (!color) return "#000000";
    const hex = color.replace('#', "");
    if (hex.length === 3) {
      return "#" + hex.split('').map(color => color+color).join('');
    }
    return color
  }

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
          color: color,
          fontFamily: fontFamily
        },
        layer
      );
      onSuccess(newElement);
    } else {
      const updatedElement = {
        ...element,
        text: text,
        fontSize: fontSize,
        color: color,
        fontFamily: fontFamily
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
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div className="fixed inset-x-0 top-0 md:left-25 md:top-13 md:inset-x-auto md:h-full md:w-90 h-full w-full md:max-w-90 z-[9999] shadow-lg rounded-md bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-xl p-2">  
          <h1 className="text-md font-semibold mb-2 text-black">
            {isEditMode ? "Edit Text" : "New Text"}
          </h1>
          <form onSubmit={handleSubmit}>
            {!isEditMode && (
              <div className="flex flex-col md:flex-row justify-between">
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
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
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
                <label className="block text-xs font-medium mb-1 text-black text-left">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500 bg-white"
                >
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                </select>
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
            <div className="flex justify-end gap-2 ml-2">
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
                {mode === 'add' ? 'create' : 'Save Change'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SaveTextModal