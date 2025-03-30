import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="p-6 ml-10 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
      </div>

      {/* Placeholder content */}
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Reports Dashboard Coming Soon</h3>
        <p className="mt-2 text-sm text-gray-500">
          This section will contain analytics, charts, and exportable reports for tracking patient interactions and healthcare metrics.
        </p>
        <div className="mt-6">
        </div>
      </div>
    </div>
  );
};

export default Reports;