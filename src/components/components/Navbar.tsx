import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed bg-black h-10 w-full flex justify-between items-center px-6 shadow-lg z-50">
            {/* Logo and Title */}
            <div className="text-white text-lg font-bold flex-shrink-0 flex items-center">
                <img 
                    src="https://www.health.mil/-/media/Images/MHS/Infographics/DHA-Logo.svg?h=60&iar=0&w=138&hash=5890E798CDC400D0742649D53B4BD1694BC89A7F"
                    alt="DHA Logo" 
                    className="h-7 mr-3"
                />
                <span className="text-white">Global Nurse Tool</span>
            </div>

            {/* Center space - could add search here if needed */}
            <div className="flex-grow mx-4">
                {/* Intentionally left empty for now */}
            </div>

            {/* Profile and Chatbot Icons */}
            <div className="flex items-center space-x-4">
                {/* Profile Icon */}
                <button
                    title="Profile"
                    className="text-white hover:text-teal-200 transition-colors focus:outline-none"
                >
                    <FaUserCircle className="w-6 h-6" />
                </button>

                {/* Chatbot Icon */}
                <button
                    title="Agent Assistant"
                    className="text-white hover:text-teal-200 transition-colors focus:outline-none"
                >
                    <BsChatDots className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;