import React from "react";

// generic alert popup, support success and error
const Alert = ({ type = 'error', message, onClose }) => {
  const styles = {
    error: 'bg-red-50 text-red-600 border border-red-200',
    success: 'bg-green-50 text-green-600 border border-green-200',
  }
  if (!message) return null;

  return (
    <div className={`${styles[type]} px-4 py-3 rounded-lg flex items-center justify-between fixed top-2 right-2 md:top-17 md:right-5 z-[9999] max-w-[90vw]`}>
      <p className="text-sm">{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="bg-transparent appearance-none border-none text-gray-400 hover:text-black-600 ml-2 p-0"
        >
                    x
        </button>
      )}
    </div>
  );
};

export default Alert;