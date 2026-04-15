import { ELEMENT_TYPES } from "../utils/elementFactory";

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

const renderMiniElement = (element) => {
    const style = {
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        zIndex: element.layer || 0,
        overflow: 'hidden',
        pointerEvents: 'none',
    };

    switch (element.type) {
        case ELEMENT_TYPES.TEXT:
            return (
                <div key={element.id} style={{
                    ...style,
                    fontSize: `${element.fontSize * 0.15}em`,
                    color: element.color,
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                }}>
                    {element.text}
                </div>
            );
        case ELEMENT_TYPES.IMAGE:
            return (
                <div key={element.id} style={style}>
                    <img src={element.src} alt={element.alt} draggable={false}
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                </div>
            );
        case ELEMENT_TYPES.VIDEO: {
            const youtubeId = getYouTubeId(element.src);
            if (youtubeId) {
                return (
                    <div key={element.id} style={{ ...style, background: '#000' }}>
                        <img src={`https://img.youtube.com/vi/${youtubeId}/default.jpg`}
                            alt="video" draggable={false}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                );
            }
            return (
                <div key={element.id} style={{
                    ...style, background: '#000', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '6px',
                }}>▶️</div>
            );
        }
        case ELEMENT_TYPES.CODE:
            return (
                <div key={element.id} style={{
                    ...style, backgroundColor: '#1e1e1e', color: '#d4d4d4',
                    fontFamily: 'monospace', fontSize: '4px', padding: '2px',
                    lineHeight: 1.2, overflow: 'hidden',
                }}>{element.code}</div>
            );
        default:
            return null;
    }
};

const SlidePreview = ({ slide, className = '' }) => {
    return (
        <div className={`w-full h-full relative overflow-hidden ${className}`}
            style={{ background: slide.background || '#ffffff' }}>
                {(slide.elements || [])
                .sort((a,b) => (a.layer || 0) - (b.layer || 0))
                .map(renderMiniElement)}
        </div>
    );
};

export default SlidePreview;