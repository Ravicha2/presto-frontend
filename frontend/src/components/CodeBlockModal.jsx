import React, { useState } from "react";
import Alert from "./Alert";
import { createCodeElement } from "../utils/elementFactory";
import hljs from 'highlight.js';

const CodeBlockModal = ({ isOpen, onClose, onSuccess, layer, mode = "add", element = null}) => {
  const [codeWidth, setCodeWidth] = useState(() => 
    mode === "edit" && element ? (element.width ?? 30) : 30
  );
  const [codeHeight, setCodeHeight] = useState(() =>
    mode === "edit" && element ? (element.height ?? 20) : 20
  );
  const [code, setCode] = useState(() =>
    mode === "edit" && element ? (element.code ?? "") : ""
  );
  const [fontSize, setFontSize] = useState(() =>
    mode === "edit" && element ? (element.fontSize ?? 1) : 1
  );
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(() =>
    mode === 'edit' && element ? (element.language ?? 'auto') : 'auto'
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    if (mode === "edit" && element) {
      setCodeWidth(element.width ?? 30);
      setCodeHeight(element.height ?? 20);
      setCode(element.code ?? "");
      setFontSize(element.fontSize ?? 1);
      setLanguage(element.language ?? 'auto');
    } else {
      setCodeWidth(30);
      setCodeHeight(20);
      setCode("");
      setFontSize(1);
      setLanguage("auto");
    }
    setError("");
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Code content is required");
      return;
    }

    if (mode == "add") {
      const resolvedLanguage = language === "auto"
        ? hljs.highlightAuto(code, ['javascript', 'python', 'c']).language ?? "javascript"
        : language;
      const newElement = createCodeElement(
        {
          width: codeWidth,
          height: codeHeight,
          code: code,
          fontSize: fontSize,
          language: resolvedLanguage,
        }, layer);
      onSuccess(newElement);
    } else {
      const resolvedLanguage = (language === "auto" 
        ? (hljs.highlightAuto(code, ['javascript', 'python', 'c']).language ?? element.language) 
        : language);
      const updatedElement = {
        ...element,
        width: codeWidth,
        height: codeHeight,
        code: code,
        fontSize: fontSize,
        language: resolvedLanguage,
      };
      onSuccess(updatedElement);
    }

    onClose();
  }

  if (!isOpen) return null;

  const isEditMode = mode === "edit";

  return (
    <>
      <Alert type="error" message={error} onClose={() => setError("")} />
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div
        className="fixed left-25 top-13 h-full w-90 z-[9999] shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-xl p-2">
          <h1 className="text-md font-semibold mb-2 text-black">
            {isEditMode ? "Edit Code Block" : "New Code Block"}
          </h1>

          <form onSubmit={handleSubmit}>
            {!isEditMode && (
              <div className="flex flex-row justify-between">
                <div className="mb-2 mx-2">
                  <label className="block text-xs font-medium mb-1 text-black text-left">
                            Box Width
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.000000000000001"
                    value={codeWidth}
                    onChange={(e) => setCodeWidth(Number(e.target.value))}
                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                    placeholder="Enter Box Width"
                  />
                </div>

                <div className="mb-2 mx-2">
                  <label className="block text-xs font-medium mb-1 text-black text-left">
                            Box Height
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.000000000000001"
                    value={codeHeight}
                    onChange={(e) => setCodeHeight(Number(e.target.value))}
                    className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                    placeholder="Enter Box Height"
                  />
                </div>
              </div>
            )}
            <div className="mb-2 mx-2">
              <label className="block text-xs font-medium mb-1 text-black text-left">
                        Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
              >
                <option value="auto">Auto-detect</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C</option>
              </select>
            </div>

            <div className="mb-2 mx-2">
              <label className="block text-xs font-medium mb-1 text-black text-left">
                        Font Size
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                placeholder="1em"
              />
            </div>

            <div className="mb-2 mx-2">
              <label className="block text-xs font-medium mb-1 text-black text-left">
                        Code
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
                placeholder="Paste your code here"
                rows={10}
                required
                style={{ whiteSpace: "pre", fontFamily: "inherit" }}
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
                {mode === "add" ? "Create" : "Save Change"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CodeBlockModal;