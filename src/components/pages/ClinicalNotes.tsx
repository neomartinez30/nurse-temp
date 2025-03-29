
import React from 'react';

const ClinicalNotes: React.FC = () => {
  return (
    <div className="h-[calc(100vh-3.5rem)] ml-12 mr-3 bg-white overflow-hidden">
      <iframe
        src="https://main.d1ekasyjgek930.amplifyapp.com/conversations"
        className="w-full h-full border-none"
        title="Clinical Notes"
      />
    </div>
  );
};

export default ClinicalNotes;