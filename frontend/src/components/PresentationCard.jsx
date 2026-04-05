import { useNavigate  } from "react-router-dom";

const PresentationCard = ({ presentation }) => {
    const navigate = useNavigate();
    const { id, name, description, thumbnail, slides } = presentation;

    return (
        <div
            onClick={() => navigate(`/presentation/${id}`)}
            className="cursor-pointer min-w-[100px] w-[200px]"
        >
            <div
                className="bg-gray-300 rounded-lg overflow-hidden flex flex-row p-2"
                style={{ backgroundColor: 'white', aspectRatio: '2/1' }}>

                <div
                    className="rounded flex-shrink-0 my-2"
                    style={{
                        width: '70px',
                        minHeight: '70%',
                        backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: thumbnail ? 'transparent' : '#e5e7eb',
                    }}
                />

                <div className="p-2 rounded flex justify-between flex-col flex-1 min-w-0">
                    <div>
                        <h3 className="font-semibold text-gray-600 flex-wrap text-sm text-left">{name}</h3>
                        {description && <p className="text-xs text-gray-600 truncate text-left">{description}</p>}
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 text-left">{slides?.length || 0} slides</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PresentationCard;