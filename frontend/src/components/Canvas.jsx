import { useState } from "react";
import SlideElement from "./SlideElement";
import ContextMenu from "./ContextMenu";
import SaveTextModal from "./SaveTextModal";
import Uploadimage from "./ImageModal";
import { ELEMENT_TYPES } from "../utils/elementFactory";

const Canvas = ({
    elements = [],
    onElementsChange,
    className = '',
}) => {
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [editingElement, setEditingElement] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);

    const handleClick = (e, elementId) => {
        e.stopPropagation();
        setSelectedElementId(elementId);
    };

    const handleDoubleClick = (e, elementId) => {
        e.stopPropagation();
        const element = elements.find(el => el.id === elementId);
        if (element) {
            setEditingElement(element);
        }
    }

    const handleContextMenu = (e, elementId) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedElementId(elementId);
        setContextMenu({ x:e.clientX, y:e.clientY, elementId });
    };

    const handleCanvasClick = () => {
        setSelectedElementId(null);
    };

    const handleDelete = () => {
        if (contextMenu?.elementId) {
            onElementsChange?.(elements.filter(el => el.id !== contextMenu.elementId));
            setSelectedElementId(null);
        }
    }

    const handleEditSuccess = (updatedElement) => {
        onElementsChange?.(elements.map(el =>
            el.id === updatedElement.id ? updatedElement : el
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
                        <div className="fixed inset-0 z-40" onClick={handleCloseEditModal} />
                        <div className="fixed left-25 top-13 h-full w-90 z-50 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation}>
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
            default:
                return null;
        }
    }

    return (
        <>
            <div
                className={`relative w-full h-full ${className}`}
                onClick={handleCanvasClick}
                onContextMenu={(e) => e.preventDefault()}
            >
                {elements.map((element) => {
                    const isSelected = element.id === selectedElementId;
                    return (
                        <div
                            key={element.id}
                            onClick={(e) => handleClick(e, element.id)}
                            onDoubleClick={(e) => handleDoubleClick(e, element.id)}
                            onContextMenu={(e) => handleContextMenu(e, element.id)}
                            className={`cursor-pointer ${
                                isSelected
                                ? 'border-transparent'
                                : 'hover: border-gray-300'
                            }`}
                        >
                            <SlideElement element={element} />
                        </div>
                    );
                })}
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