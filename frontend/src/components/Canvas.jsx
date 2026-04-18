import { useState, useRef, useEffect } from "react";
import SlideElement from "./SlideElement";
import ContextMenu from "./ContextMenu";
import SaveTextModal from "./SaveTextModal";
import CodeBlockModal from "./CodeBlockModal";
import Uploadimage from "./ImageModal";
import UploadVideo from "./VideoModal";
import { ELEMENT_TYPES } from "../utils/elementFactory";

const Canvas = ({
  elements = [],
  onElementsChange,
  className = '',
  themeBackground,
  previewMode = false,
}) => {
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [zCounter, setZCounter] = useState(
    Math.max(...elements.map(element => element.layer || 0), 0) + 1
  );
  const canvasRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // delete selected element on Backspace
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace" && selectedElementId) {
        // don't delete if user is typing in an input/textarea
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        e.preventDefault();
        onElementsChange?.(elements.filter(element => element.id !== selectedElementId));
        setSelectedElementId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, elements, onElementsChange]);

  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasWidth(canvasRef.current.offsetWidth);
        setCanvasHeight(canvasRef.current.offsetHeight);
      }
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // bring element to front so draggin/resizing is more intuitive and less buggy
  const bringToFront = (elementId) => {
    const newZ = zCounter + 1;
    setZCounter(newZ);
    onElementsChange?.(elements.map(element => element.id === elementId ? {...element, layer: newZ} : element ));
  }

  // send element to back
  const sendToBack = (elementId) => {
    const minLayer = Math.min(...elements.map(e => e.layer || 0));
    const newZ = minLayer - 1;
    const updated = elements.map(element =>
      element.id === elementId ? {...element, layer: newZ} : element
    );
    // If any layer is negative, shift all layers up so minimum is 0
    if (newZ < 0) {
      const shift = -newZ;
      onElementsChange?.(updated.map(element => ({
        ...element,
        layer: (element.layer || 0) + shift
      })));
    } else {
      onElementsChange?.(updated);
    }
  }

  // update x/y after drag
  const handleDragStop = (elementId, { x, y }) => {
    bringToFront(elementId);
    onElementsChange?.(elements.map(element => element.id === elementId ? { ...element, x, y}: element ));
  };

  // update x/y/width/height after resize
  const handleResizeStop = (elementId, { x, y, width, height }) => {
    bringToFront(elementId);
    onElementsChange?.(elements.map(element => element.id === elementId ? { ...element, x, y, width, height}: element ));
  }

  // set select element
  const handleClick = (elementId) => {
    setSelectedElementId(elementId)
  };

  // set select element
  const handleDoubleClick = (elementId) => {
    const element = elements.find(element => element.id === elementId);
    if (element) {
      setEditingElement(element);
    }
  }

  // set context menu on element and show at cursor
  const handleContextMenu = (e, elementId) => {
    e.preventDefault();
    setSelectedElementId(elementId);
    setContextMenu({ x:e.clientX, y:e.clientY, elementId });
  };

  // reset select element when click on canvas
  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  const handleDelete = () => {
    if (contextMenu?.elementId) {
      onElementsChange?.(elements.filter(element => element.id !== contextMenu.elementId));
      setSelectedElementId(null);
    }
  }

  const handleEditSuccess = (updatedElement) => {
    onElementsChange?.(elements.map(element =>
      element.id === updatedElement.id ? updatedElement : element
    ));
    setEditingElement(null);
  }

  const handleCloseEditModal = () => {
    setEditingElement(null);
  }

  // render element onto Canvas logic
  const renderEditModal = () => {
    if (!editingElement) return null;
    switch (editingElement.type) {
    case ELEMENT_TYPES.TEXT:
      return (
        <SaveTextModal
          isOpen={true}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          mode="edit"
          element={editingElement}
        />
      );
    case ELEMENT_TYPES.CODE:
      return (
        <CodeBlockModal
          isOpen={true}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          mode="edit"
          element={editingElement}
        />
      )
    case ELEMENT_TYPES.IMAGE:
      return (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={handleCloseEditModal} />
          <div className="fixed inset-x-0 top-0 md:left-25 md:top-13 md:inset-x-auto md:h-full md:w-90 h-full w-full md:max-w-90 z-[9999] shadow-lg rounded-md bg-white overflow-y-auto" onClick={(e) => e.stopPropagation}>
            <div className="w-full max-w-xl p-2">
              <h1 className="text-xl font-semibold mb-2 text-black">Edit Image</h1>
              <Uploadimage
                isOpen={true}
                onClose={handleCloseEditModal}
                onSuccess={handleEditSuccess}
                mode="edit"
                element={editingElement}
              />
            </div>
          </div>
        </>
      );
    case ELEMENT_TYPES.VIDEO:
      return (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={handleCloseEditModal} />
          <div className="fixed inset-x-0 top-0 md:left-25 md:top-13 md:inset-x-auto md:h-full md:w-90 h-full w-full md:max-w-90 z-[9999] shadow-lg rounded-md bg-white overflow-y-auto" onClick={(e) => e.stopPropagation}>
            <div className="w-full max-w-xl p-2">
              <h1 className="text-xl font-semibold mb-2 text-black">Edit Video</h1>
              <UploadVideo
                isOpen={true}
                onClose={handleCloseEditModal}
                onSuccess={handleEditSuccess}
                mode="edit"
                element={editingElement}
              />
            </div>
          </div>
        </>
      );
    default:
      return null;
    }
  };

  const canvasBackgroundStyle =
    themeBackground?.type === "color"
      ? {
        backgroundColor: themeBackground.color,
      }
      : themeBackground?.type === "gradient"
        ? {
          background: `linear-gradient(${themeBackground.direction}, ${themeBackground.from}, ${themeBackground.to})`,
        }
        : themeBackground?.type === "image"
          ? {
            backgroundImage: `url(${themeBackground.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
          : {};


  if (canvasWidth === 0 || canvasHeight === 0) {
    return (
      <div
        ref={canvasRef}
        className={`relative w-full h-full ${className}`}
      />
    );
  }

  return (
    <>
      <div
        ref={canvasRef}
        className={`relative w-full h-full ${className}`}
        style={canvasBackgroundStyle}
        onClick={handleCanvasClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* rendering elements onto canvas */}
        {elements.map((element) => (
          <SlideElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            previewMode={previewMode}
            onDragStop={(pos) => handleDragStop(element.id, pos)}
            onResizeStop={(size) => handleResizeStop(element.id, size)}
            onMouseDown={() => bringToFront(element.id)}
            onClick={() => handleClick(element.id)}
            onDoubleClick={() => handleDoubleClick(element.id)}
            onContextMenu={(e) => handleContextMenu(e, element.id)}
          />
        ))}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={[
            {label: 'Bring to Front', icon: '⬆️', onClick: () => bringToFront(contextMenu.elementId) },
            {label: 'Send to Back', icon: '⬇️', onClick: () => sendToBack(contextMenu.elementId) },
            {label: 'Delete', icon: '🗑️', onClick: handleDelete },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}
      {renderEditModal()}
    </>
  );
};

export default Canvas;