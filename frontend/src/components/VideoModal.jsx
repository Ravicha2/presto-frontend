import React, { useState } from "react";
import { createVideoElement } from "../utils/elementFactory";

const UploadVideo = ({ onClose, onError, mode="add" ,onSuccess, layer, element }) => {
  const [url, setUrl] = useState(element?.src || '');
  const [width, setWidth] = useState(element?.width || 30);
  const [height, setHeight] = useState(element?.height || 30);
  const [autoplay, setAutoplay] = useState(true);

  const handleError = (msg) => {
    if (typeof onError === 'function') {
      onError(msg);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (mode === "add" && !url.trim()) {
      handleError('Please input a YouTube URL');
      return;
    }

    try {
      let src = url.trim() || element?.src || '';

      if (mode === "edit" && element) {
        const updatedElement = {
          ...element,
          src: src,
          autoplay: autoplay,
        };
        onSuccess(updatedElement);
      } else {
        const newElement = createVideoElement(
          {
            src: src,
            autoplay: autoplay,
            width,
            height,
          },
          layer
        );
        onSuccess(newElement);
      }
      handleClose();
    } catch (_err) {
      handleError('Failed to process Video');
    }
  };

  const handleClose = () => {
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
            {mode === "add" ? "Add YouTube Video" : "Edit YouTube Video"}
          </label>
          <div className="mb-3">
            <label className="block text-xs font-medium text-black text-left">URL</label>
            <input
              className="w-full border text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </div>
          {mode === "add" && (
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
          )}
          <div className="flex flex-col mb-3">
            <div className="flex flex-row items-center">
              <button
                type="button"
                className={`text-black border border-gray-300 rounded-lg p-2 mb-2 text-sm ${autoplay ? 'bg-blue-500 text-white' : 'bg-transparent text-black'}`}
                onClick={() => setAutoplay(!autoplay)}
              >
                                Autoplay
              </button>
            </div>
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
                        Add Video
          </button>
        </div>
      </form>
    </>
  )
}

export default UploadVideo;