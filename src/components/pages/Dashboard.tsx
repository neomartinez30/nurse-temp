// import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full pl-10 pt-0"> {/* pl-10 to account for sidebar width */}
      <div className="flex-1 bg-gray-100">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {/* <iframe
          src="https://apps.mypurecloud.com/directory/#/analytics/interactions" // Replace with your iframe URL
          title="Dashboard Application"
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          allow="camera *; microphone *; autoplay *"
        /> */}
      </div>
    </div>
  );
};

export default Dashboard;