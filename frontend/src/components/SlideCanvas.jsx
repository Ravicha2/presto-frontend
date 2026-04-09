import SlideElement from "./SlideElement";

const SlideCanvas = ({ slide }) => {
    const elements = slides?.elements || [];

    const sortedElements = [...elements].sort((a, b) => a.layer - b.layer);

    return (
        <div className="relative w-full h-full bg-white">
            {sortedElements.map(element => (
                <SlideElement
                    key={element.id}
                    element={element}
                />
            ))}
        </div>
    )
}

export default SlideCanvas;