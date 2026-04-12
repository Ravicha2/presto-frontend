import { useState } from "react";
import SlideElement from "./SlideElement";
import ContextMenu from "./ContextMenu";

const Canvas = ({
    elements = [],
    onElementSelect,
    onElementEdit,
    onElementDelete,
    selectedElementId: externalSelectedId,
    className = '',
}) => {
    const [internalSelectedId, setInternalSelectedId] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const selectedElementId = externalSelectedId ?? internalSelectedId;

    const handleClick = (e, elementId) => {
        e.stopPropagation();
        setInternalSelectedId(elementId);
        onElementSelect?.(elementId);
    };

    const handleDoubleClick = (e, elementId) => {
        e.stopPropagation();
        onElementEdit?.(elementId);
    }

    const handleContextMenu = (e, elementId) => {
        e.stopPropagation();
        e.preventDefault();
        setInternalSelectedId(elementId);
        onElementSelect?.(elementId);
        setContextMenu({ x:e.clientX, y:e.clientY, elementId });
    };

    const handleCanvasClick = () => {
        setInternalSelectedId(null);
        onElementSelect?.(null);
    };

    const handleDelete = () => {
        if (contextMenu?.elementId) {
            onElementDelete?.(contextMenu.elementId);
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
        </>
    );
};

export default Canvas;