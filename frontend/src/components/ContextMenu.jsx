import { useEffect, useRef } from "react";

// context menu window
const ContextMenu = ({ x, y, options, onClose}) => {
    
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
  // attached reference to div
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-[9999]"
      style={{ left:x, top: y}}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.onClick();
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          {option.icon && <span>{option.icon}</span>}
          <span>{option.label}</span>
        </button>
      ))}

    </div>
  );
};

export default ContextMenu