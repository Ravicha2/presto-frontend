import { ELEMENT_TYPES } from "../utils/elementFactory";
import { useState } from 'react';

const getYouTubeId = (url) => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

const SlideElement = ({ element, isSelected }) => {

    let baseStyle = {
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        zIndex: element.layer,
        border: '1px solid transparent',
        overflow: 'auto'
    }

    baseStyle.border = isSelected ? '1px solid #ccc' : '1px solid transparent';

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
        const youtubeId = getYouTubeId(element.src);
        const [isHovered, setIsHovered] = useState(false);
        if (youtubeId) {
            return (
                <div 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ ...baseStyle, overflow: 'hidden', border: isHovered ? '10px solid #ccc' : (isSelected ? '10px solid #ccc' : '10px solid transparent') }}>
                    <iframe
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${element.autoplay ? 1 : 0}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
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