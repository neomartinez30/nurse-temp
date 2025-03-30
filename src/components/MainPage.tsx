import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AgentDesk1 from './pages/AgentDesk1';
import { ProviderLocation } from './pages/ProviderLocation';
import ClinicalNotes from './pages/ClinicalNotes';
import Reports from './pages/Reports';

const MainPage = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  useEffect(() => {
    // Listen for sidebar state changes
    const handleSidebarChange = (event: any) => {
      setSidebarExpanded(event.detail.isExpanded);
    };
    document.addEventListener('sidebarStateChange', handleSidebarChange);
    return () => {
      document.removeEventListener('sidebarStateChange', handleSidebarChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main content with dynamic margin based on sidebar state */}
        <main className={`flex-1 pt-1 mt-10 ${sidebarExpanded ? 'ml-40' : ''} transition-all h-auto duration-300`}>
          <div className="pt-1 pl-3 mb-[1.5rem]">
            <Routes>
              <Route path="/agent-desktop" element={<AgentDesk1 />} />
              <Route path="/clinical-notes" element={<ClinicalNotes />} />
              <Route path="/data" element={<ProviderLocation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/" element={<AgentDesk1 />} />
              <Route path="/settings" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
      
      {/* Fixed Footer */}
      <Footer />
    </div>
  )
}

export default MainPage