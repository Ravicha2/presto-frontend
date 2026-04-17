const ThemeBackgroundButton = (props) => {
    return (
        <>
            <button
                className='px-5 py-3 rounded-full bg-blue-500 text-white mt-3 hover:bg-blue-700'
                onClick={props.onOpen}
            >
                🎨
            </button>
            <p className="text-white">Theme</p>
        </>
    )
}

export default ThemeBackgroundButton;