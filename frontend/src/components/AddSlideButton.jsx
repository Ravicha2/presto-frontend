const AddSlideButton = (props) => {
  return (
    <>
      <button
        className='px-2 py-1.5 md:px-5 md:py-3 rounded-full bg-blue-500 text-white md:mt-3 hover:bg-blue-700 text-sm md:text-base'
        onClick={props.onAddSlide}
      >
        +
      </button>
      <p className="text-white text-xs hidden md:block">Add Slide</p>
    </>
  )
}

export default AddSlideButton;