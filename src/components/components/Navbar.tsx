import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed bg-gradient-to-r from-sky-800 to-teal-700 h-10 w-full flex justify-between items-center px-6 shadow-lg z-50">
            {/* Title */}
            <div className="text-white text-lg font-bold flex-shrink-0 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Global Nurse Tool
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