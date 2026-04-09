
const AddSlideButton = (props) => {


    return (
        <>
            <button
                className='text-md font-bold text-white flex flex-row-reverse p-2 rounded bg-blue-500 hover:bg-blue-600'
                onClick={props.onAddSlide}
            >

                Add Slide

            </button>
        
        </>
    )
    

}

export default AddSlideButton;