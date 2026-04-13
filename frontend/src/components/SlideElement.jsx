import { ELEMENT_TYPES } from "../utils/elementFactory";

const SlideElement = ({ element }) => {
    const baseStyle = {
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        zIndex: element.layer,
        border: '1px solid #ccc',
        overflow: 'auto'
    }

    if (element.type === ELEMENT_TYPES.TEXT) {
        return (
            <div style={{
                ...baseStyle,
                fontSize: `${element.fontSize}em`,
                color: element.color
            }}>
                {element.text}
            </div>
        );
    }

    if (element.type === ELEMENT_TYPES.IMAGE) {
        return (
            <img
                style={{
                    ...baseStyle,
                    objectFit: 'contain',
                }}
                src={element.src}
                alt={element.alt}
            />
        );
    }

    if (element.type === ELEMENT_TYPES.VIDEO) {
        return (
            <video
                style={baseStyle}
                src={element.src}
                autoPlay={element.autoPlay}
                controls={element.controls}
            />
        );
    }

    if (element.type === ELEMENT_TYPES.CODE) {
        return (
            <pre style={{
                ...baseStyle,
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                fontFamily: 'monospace',
                padding: '8px'
            }}>
                <code>{element.code}</code>
            </pre>
        );
    }
    return null;
}

export default SlideElement;