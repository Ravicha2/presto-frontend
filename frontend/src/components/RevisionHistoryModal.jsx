import React from 'react';

const RevisionHistoryModal = ({ isOpen, onClose, revisions, onRestore }) => {
  if (!isOpen) return null;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const sorted = [...revisions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50' onClick={onClose}>
      <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-xl flex flex-col' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-lg font-semibold text-black mb-4'>Revision History</h2>
        {sorted.length === 0 ? (
          <p className='text-gray-500 text-sm'>No revision yet. Modifications will be captured every minutes.</p>
        ) : (
          <ul className='overflow-y-auto flex-1 space-y-2'>
            {sorted.map((version) => 
              <li key={version.id} className='flex items-center justify-between border rounded-lg px-3 py-2 hover:bg-gray-500'>
                <div>
                  <p className='text-sm font-medium text-black'>{formatTime(version.timestamp)}</p>
                  <p className='text-xs text-gray-500'>{version.slideCount} slide{version.slideCount !== 1 ? 's' : ''}</p>
                </div>
                <button 
                  onClick={() => onRestore(version)}
                  className='px-3 py-1 text-sm bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors'>
                  Restore
                </button>
              </li>
            )}
          </ul>
        )}
        <div className='flex justify-end mt-4'>
          <button 
            onClick={onClose}
            className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
          >
              Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionHistoryModal;