import React, { useState } from 'react';

const NodeCreatorButton = ({ onAddNode }) => {
  const [nodeName, setNodeName] = useState('');
  const [isAcceptState, setIsAcceptState] = useState(false);

  const handleAddNode = () => {
    if (nodeName.trim() === '') return;
    onAddNode({
      label: nodeName,
      isAcceptState: isAcceptState
    });
    setNodeName('');
    setIsAcceptState(false);
  };

  return (
    <div className='grid grid-cols-2' style={{ gap: '8px', padding: '5px 10px', borderRadius: '5px' }}>
      <input
        type="text"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
        placeholder="Add state"
        className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label style={{ color: 'white' }} className='flex items-center gap-1 justify-center'>
        <input
          className='mt-0.5'
          type="checkbox"
          checked={isAcceptState}
          onChange={(e) => setIsAcceptState(e.target.checked)}
        />
        Accept State
      </label>
      <button
        onClick={handleAddNode}
        className="mt-2 w-full p-2 bg-gray-600 rounded border-solid-white cursor-pointer text-white hover:bg-gray-500 transition-colors"
      >
        Add State
      </button>
    </div>
  );
};

export default NodeCreatorButton;