import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed bg-gray-900 h-[2.5rem] w-full flex justify-between items-center px-4 shadow-md z-50">
            {/* Title */}
            <div className="text-white text-lg font-bold flex-shrink-0">
                Global Nurse Tool
            </div>

            {/* Global Searchbox
            <div className="flex-grow mx-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full max-w-md px-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div> */}


            {/* Profile and Chatbot Icons */}
            <div className="flex items-center space-x-4">
                {/* Profile Icon */}
                <button
                    title="Profile"
                    className="text-white hover:text-gray-300 focus:outline-none"
                >
                    <FaUserCircle className="w-6 h-6" />
                </button>

                {/* Chatbot Icon */}
                <button
                    title="Agent Assistant"
                    className="text-white hover:text-gray-300 focus:outline-none"
                >
                    <BsChatDots className="w-6 h-6" />
                </button>
            </div>


            {/* <div className="fixed top-0 mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">Global Nurse Tool</div>
                
            </div> */}
        </nav>
    );
};

export default Navbar;