import { ELEMENT_TYPES } from "../utils/elementFactory";
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

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

const CORNER_HANDLE_STYLE = {
  width: "5px",
  height: "5px",
  background: '#333',
};

const SlideElement = ({ 
  element,
  isSelected,
  canvasWidth,
  canvasHeight,
  onDragStop,
  onResizeStop,
  onMouseDown,
  onClick,
  onDoubleClick,
  onContextMenu, 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // convert % to px
  const x = (element.x / 100) * canvasWidth;
  const y = (element.y / 100) * canvasHeight;
  const width = (element.width / 100) * canvasWidth;
  const height = (element.height / 100) * canvasHeight;

  const minWidth = canvasWidth * 0.01;
  const minHeight = canvasHeight * 0.01;

  const pxToPercentX = (px) => (px / canvasWidth) * 100;
  const pxToPercenty = (px) => (px / canvasHeight) * 100;

  // calculate new position after drag
  const handleDragStop = (e, d) => {
    const maxX = canvasWidth - width;
    const maxY = canvasHeight - height;
    const clampedX = Math.max(0, Math.min(d.x, maxX));
    const clampedY = Math.max(0, Math.min(d.y, maxY));

    onDragStop?.({
      x: pxToPercentX(clampedX),
      y: pxToPercenty(clampedY),
    });
  };

  // calculate new width/height/x/y after resize
  const handleResizeStop = (e, direction, ref, delta, position) => {
    const newWidth = parseFloat(ref.style.width);
    const newHeight = parseFloat(ref.style.height);

    const clampedX = Math.max(0, Math.min(position.x, canvasWidth - newWidth));
    const clampedY = Math.max(0, Math.min(position.y, canvasHeight - newHeight));

    onResizeStop?.({
      x: pxToPercentX(clampedX),
      y: pxToPercenty(clampedY),
      width: pxToPercentX(newWidth),
      height: pxToPercenty(newHeight),
    });
  };

  // render elements with defualt properties
  const renderContent = () => {
    if (element.type === ELEMENT_TYPES.TEXT) {
      return (
        <div style={{
          fontSize: `${element.fontSize}em`,
          color: element.color,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          border: '1px transparent'
        }}>
          {element.text}
        </div>
      );
    }
    if (element.type === ELEMENT_TYPES.IMAGE) {
      return (
        <img 
          style={{ objectFit: 'contain', width: '100%', height: '100%', border: '1px transparent' }}
          src={element.src}
          alt={element.alt}
          draggable={false}
        />
      );
    }

    if (element.type === ELEMENT_TYPES.VIDEO) {
      const youtubeId = getYouTubeId(element.src);
      if (youtubeId) {
        return (
          <div
            className="no-drag"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          >
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
      const lang = element.language || 'javascript';
      let highlighted;
      try {
        highlighted = hljs.highlight(element.code, { language: lang }).value;
      } catch {
        highlighted = hljs.highlightAuto(element.code, ['javascript', 'python', 'c']).value;
      }
      return (
        <pre style={{
          backgroundColor: 'transparent',
          color: '#1e1e1e',
          padding: '8px',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          <code
            className={`hljs language-${lang}`}
            style={{ fontSize: `${element.fontSize}em` }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      );
    }
    return null;
  };

  // rnd rendering logic
  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      bounds="parent"
      minWidth={minWidth}
      minHeight={minHeight}
      enableResizing={isSelected ? {
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }: false}
      resizeHandleStyles={{
        topLeft: CORNER_HANDLE_STYLE,
        topRight: CORNER_HANDLE_STYLE,
        bottomLeft: CORNER_HANDLE_STYLE,
        bottomRight: CORNER_HANDLE_STYLE,
      }}
      cancel=".no-drag"
      style={{
        zIndex: element.layer,
        border: (element.type === ELEMENT_TYPES.VIDEO 
          ? ((isSelected || isHovered) ? "7px solid #ccc" : "7px solid transparent")
          : ((isSelected || isHovered) ? "1px solid #ccc" : "1px solid transparent")),
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={(e) => onMouseDown?.(e)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.(e);
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onContextMenu?.(e);
      }}
    >
      {renderContent()}
    </Rnd>
  );
};

export default SlideElement;