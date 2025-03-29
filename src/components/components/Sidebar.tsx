import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiUserLine, RiSettings4Line, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineNotes } from "react-icons/md";


const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const getLiClassName = (path: string) => {
        return `p-2.5 rounded-lg ${isExpanded ? 'w-full' : 'w-9'} flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} cursor-pointer transition-all duration-300 
            ${isActive(path)
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-white hover:bg-teal-800 hover:shadow-sm'
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
        <div className={`fixed top-10 left-0 ${isExpanded ? 'w-48 bg-gradient-to-b from-sky-800 to-teal-700' : 'w-12 bg-sky-800'} h-[calc(100vh-4rem)] flex flex-col text-white shadow-lg z-10 transition-all duration-300`}>
            <div className="flex justify-end pr-2 pt-3 mb-3">
                <button onClick={toggleSidebar} className="text-white hover:text-teal-200 transition-colors rounded-full p-1">
                    {isExpanded ? <RiMenuFoldLine className="h-5 w-5" /> : <RiMenuUnfoldLine className="h-5 w-5" />}
                </button>
            </div>
            <div className="flex-1">
                <ul className="flex flex-col items-center w-full mt-4 space-y-5 px-1.5">
                    <li className={getLiClassName('/')}>
                        <Link to="/" className="flex items-center space-x-3 w-full">
                            <HiOutlineDocumentReport className="h-5 w-5" />
                            {isExpanded && <span className="text-sm font-medium ml-2">Reports</span>}
                        </Link>
                    </li>
                    <li className={getLiClassName('/agent-desktop')}>
                        <Link to="/agent-desktop" className="flex items-center space-x-3 w-full">
                            <RiUserLine className="h-5 w-5" />
                            {isExpanded && <span className="text-sm font-medium ml-2">Ticket</span>}
                        </Link>
                    </li>
                    <li className={getLiClassName('/data')}>
                        <Link to="/data" className="flex items-center space-x-3 w-full">
                            <GrMapLocation className="h-5 w-5" style={{ filter: isActive('/data') ? 'brightness(0) invert(1)' : 'none' }} />
                            {isExpanded && <span className="text-sm font-medium ml-2">Provider Location</span>}
                        </Link>
                    </li>
                    <li className={getLiClassName('/settings')}>
                        <Link to="/settings" className="flex items-center space-x-3 w-full">
                            <RiSettings4Line className="h-5 w-5" />
                            {isExpanded && <span className="text-sm font-medium ml-2">Settings</span>}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;