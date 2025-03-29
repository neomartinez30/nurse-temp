import React from 'react';

const ClinicalNotes: React.FC = () => {
  return (
    <div className="h-[85vh] ml-2 mt-1 mr-3 bg-gray-100 p-1 overflow-auto">
      <div className="bg-white w-full h-full rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-sky-700 to-teal-600">
          <h1 className="text-xl font-semibold text-white">Clinical Notes</h1>
        </div>
        <div className="w-full h-[calc(100%-3.5rem)]">
          <iframe
            src="https://main.d1ekasyjgek930.amplifyapp.com/conversations"
            className="w-full h-full border-none"
            title="Clinical Notes"
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;