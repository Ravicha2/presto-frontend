const DeleteSlideButton = (props) => {
    return (
        <>
            <button
                className='px-5 py-3 rounded-full bg-red-500 text-white mt-3 hover:bg-red-700'
                onClick={props.onDeleteSlide}
            >
                -
            </button>
            <p className="text-white">Delete Slide</p>
        </>
    )
}

export default DeleteSlideButton;