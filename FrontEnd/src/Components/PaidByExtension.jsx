import React from 'react';
import { useSelector } from 'react-redux';

export const PaidByExtension = ({setPayer}) => {
  const groupMember = useSelector((state) => state.CurrentGroupReducer.ob);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 max-h-96 overflow-y-auto">
      <div className='flex items-center justify-center'>
        <h2 className="text-xl font-semibold text-white mb-4">Select Payer</h2>
      </div>
      <div className='flex flex-col justify-center items-center space-y-2'>
        {groupMember.Members.map((member, index) => (
          <button 
            key={index}
            onClick={()=>setPayer(member.username)}
            className="w-full px-4 py-2 text-sm text-white border border-orange-500 bg-gray-700 rounded hover:bg-orange-500 transition-colors"
          >
            {member.username}
          </button>
        ))}
      </div>
    </div>
  );
};
