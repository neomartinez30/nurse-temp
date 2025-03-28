import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiUserLine, RiSettings4Line, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
// import { BiAnalyse } from 'react-icons/bi';
import { HiOutlineDocumentReport } from "react-icons/hi";
// import { FiDatabase } from 'react-icons/fi';
import { GrMapLocation } from "react-icons/gr";

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const getLiClassName = (path: string) => {
        return `p-2 rounded-lg ${isExpanded ? 'w-full' : 'w-8'} flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} cursor-pointer transition-all duration-200 
            ${isActive(path)
                ? 'bg-cyan-800 text-white'
                : 'hover:bg-cyan-700'
            }`;
    };

    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);

        // Dispatch custom event when sidebar state changes
        document.dispatchEvent(new CustomEvent('sidebarStateChange', {
            detail: { isExpanded: newExpandedState }
        }));
    };

    return (
        <div className={`fixed top-[2.5rem] left-0 ${isExpanded ? 'w-48 bg-gradient-to-t from-sky-700 to-teal-600' : 'w-10 bg-sky-700'} h-[calc(100vh-4rem)] flex flex-col  text-white shadow-lg z-10 transition-all duration-300`}>
            <div className="flex justify-end pr-2 pt-2 mb-3">
                <button onClick={toggleSidebar} className="text-gray-800 hover:text-white">
                    {isExpanded ? <RiMenuFoldLine className="h-4 w-4" /> : <RiMenuUnfoldLine className="h-4 w-4" />}
                </button>
            </div>
            <div className="flex-1">
                <ul className="flex flex-col items-center w-full mt-2 space-y-4 px-1">
                    {/* <li className={getLiClassName('/')}>
                        <Link to="/" className="flex items-center space-x-3 w-full">
                            <RiHomeLine className="h-4 w-4" />
                            {isExpanded && <span className="text-sm">Home</span>}
                        </Link>
                    </li> */}
                    <li className={getLiClassName('/')}>
                        <Link to="/" className="flex items-center space-x-2 w-full">
                            <HiOutlineDocumentReport className="h-4 w-4" />
                            {isExpanded && <span className="text-sm">Reports</span>}
                        </Link>
                    </li>
                    <li className={getLiClassName('/agent-desktop')}>
                        <Link to="/agent-desktop" className="flex items-center space-x-2 w-full">
                            <RiUserLine className="h-4 w-4" />
                            {isExpanded && <span className="text-sm">Ticket</span>}
                        </Link>
                    </li>
                    <li className={getLiClassName('/data')}>
                        <Link to="/data" className="flex items-center space-x-2 w-full">
                            <GrMapLocation className="h-4 w-4" />
                            {isExpanded && <span className="text-sm">Provider Location</span>}
                        </Link>
                    </li>
                    <li className={getLiClassName('/settings')}>
                        <Link to="/settings" className="flex items-center space-x-3 w-full">
                            <RiSettings4Line className="h-4 w-4" />
                            {isExpanded && <span className="text-sm">Settings</span>}
                        </Link>
                    </li>
                    {/* <li className={getLiClassName('/messages')}>
                        <Link to="/messages" className="flex items-center space-x-3 w-full">
                            <RiMailLine className="h-4 w-4" />
                            {isExpanded && <span className="text-sm">Messages</span>}
                        </Link>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;