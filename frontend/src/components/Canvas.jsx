import { useState, useRef, useEffect, useCallback } from "react";
import SlideElement from "./SlideElement";
import ContextMenu from "./ContextMenu";
import SaveTextModal from "./SaveTextModal";
import Uploadimage from "./ImageModal";
import UploadVideo from "./VideoModal";
import { ELEMENT_TYPES } from "../utils/elementFactory";

const Canvas = ({
    elements = [],
    onElementsChange,
    className = '',
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

    const bringToFront = (elementId) => {
        const newZ = zCounter + 1;
        setZCounter(newZ);
        onElementsChange?.(elements.map(element => element.id === elementId ? {...element, layer: newZ} : element ));
    }

    const handleDragStop = (elementId, { x, y }) => {
        bringToFront(elementId);
        onElementsChange?.(elements.map(element => element.id === elementId ? { ...element, x, y}: element ));
    };

    const handleResizeStop = (elementId, { x, y, width, height }) => {
        bringToFront(elementId);
        onElementsChange?.(elements.map(element => element.id === elementId ? { ...element, x, y, width, height}: element ));
    }

    const handleClick = (elementId) => {
        setSelectedElementId(elementId)
    };

    const handleDoubleClick = (elementId) => {
        const element = elements.find(element => element.id === elementId);
        if (element) {
            setEditingElement(element);
        }
    }

    const handleContextMenu = (e, elementId) => {
        e.preventDefault();
        setSelectedElementId(elementId);
        setContextMenu({ x:e.clientX, y:e.clientY, elementId });
    };

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
            case ELEMENT_TYPES.IMAGE:
                return (
                    <>
                        <div className="fixed inset-0 z-[9998]" onClick={handleCloseEditModal} />
                        <div className="fixed left-25 top-13 h-full w-90 z-[9999] shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation}>
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
                        <div className="fixed left-25 top-13 h-full w-90 z-[9999] shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation}>
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
                onClick={handleCanvasClick}
                onContextMenu={(e) => e.preventDefault()}
            >
                {elements.map((element) => (
                    <SlideElement
                        key={element.id}
                        element={element}
                        isSelected={element.id === selectedElementId}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
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