const PreviewButton = ({ onPreview }) => {
  return (
    <button
      type="button"
      className="mx-3 px-3 py-1 border border-white rounded-md text-white flex items-center bg-transparent hover:bg-sky-600 hover:shadow-xl"
      onClick={onPreview}
    >
      Preview
      <span className="ml-2">👁</span>
    </button>
  );
};

export default PreviewButton;