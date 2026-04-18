const DeleteSlideButton = (props) => {
  return (
    <>
      <button
        className='px-2 py-1.5 md:px-5 md:py-3 rounded-full bg-red-500 text-white md:mt-3 hover:bg-red-700 text-sm md:text-base'
        onClick={props.onDeleteSlide}
      >
        -
      </button>
      <p className="text-white text-xs hidden md:block">Delete Slide</p>
    </>
  )
}

export default DeleteSlideButton;