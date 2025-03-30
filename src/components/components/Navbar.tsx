import React, { useState } from 'react';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { BsChatDots, BsBell } from 'react-icons/bs';

const Navbar: React.FC = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <nav className="fixed bg-gradient-to-r from-gray-900 to-gray-800 h-12 w-full flex justify-between items-center px-6 shadow-md z-50 border-b border-gray-700">
            {/* Logo and Title */}
            <div className="text-white font-bold flex-shrink-0 flex items-center">
                <img 
                    src="https://www.health.mil/-/media/Images/MHS/Infographics/DefenseHealthAgencyDHALogo2white.svg?iar=0&hash=2FDBEB9454DF95A1186BF15671AFFAF5F6ED997C"
                    alt="DHA Logo" 
                    className="h-8 mr-3 transition-transform duration-300 hover:scale-105"
                />
                <span className="text-white text-lg font-semibold">
                    <span className="text-teal-400">MHS</span> Nurse Advice Line
                </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative max-w-md w-1/3 mx-4">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-gray-800 text-white text-sm rounded-full px-4 py-1.5 pl-10 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 text-gray-400" />
            </div>

            {/* Profile and Chatbot Icons */}
            <div className="flex items-center space-x-5">
                {/* Notification Icon */}
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    title="Notifications"
                    className="text-white hover:text-teal-300 transition-colors focus:outline-none relative"
                >
                    <BsBell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Chatbot Icon */}
                <button
                    title="Agent Assistant"
                    className="text-white hover:text-teal-300 transition-colors focus:outline-none p-1.5 rounded-full hover:bg-gray-700"
                >
                    <BsChatDots className="w-5 h-5" />
                </button>

                {/* Profile Icon with Dropdown */}
                <button
                    title="Profile"
                    className="text-white hover:text-teal-300 transition-colors focus:outline-none flex items-center space-x-2 border-l border-gray-700 pl-4"
                >
                    <FaUserCircle className="w-6 h-6" />
                    <span className="text-sm hidden md:inline-block">Nancy Pineda</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;