import React, { useState, useRef, useEffect } from 'react';
import { IoMdCall } from 'react-icons/io';
import { AiOutlineMinusCircle, AiOutlineExpandAlt, AiTwotoneUpCircle, AiTwotoneDownCircle } from 'react-icons/ai';
import { RiRobot2Line } from 'react-icons/ri';
import useCallState from '../../hooks/useCallState';
import AgentChat from './AgentChat'; // Import the separate AgentChat component

const Footer: React.FC = () => {
    const [isSoftphoneOpen, setIsSoftphoneOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const callState = useCallState();

    const [isToolboxOpen, setIsToolboxOpen] = useState(false);
    const [isToolboxMinimized, setIsToolboxMinimized] = useState(false);
    const ToolboxbuttonRef = useRef<HTMLButtonElement>(null);
    
    // Agent Chat state
    const [isAgentChatOpen, setIsAgentChatOpen] = useState(false);
    const [isAgentChatMinimized, setIsAgentChatMinimized] = useState(false);
    const agentChatButtonRef = useRef<HTMLButtonElement>(null);

    // Show softphone when call becomes active
    useEffect(() => {
        if (callState.isCallActive) {
            setIsSoftphoneOpen(true);
            setIsMinimized(false);
        }
    }, [callState.isCallActive]);

    // Handle softphone toggle
    const handleSoftphoneClick = () => {
        if (isSoftphoneOpen) {
            setIsMinimized(!isMinimized);
        } else {
            setIsSoftphoneOpen(true);
            setIsMinimized(false);
        }
    };

    // Handle Toolbox toggle
    const handleToolboxClick = () => {
        if (isToolboxOpen) {
            setIsToolboxMinimized(!isToolboxMinimized);
        } else {
            setIsToolboxOpen(true);
            setIsToolboxMinimized(false);
        }
    };
    
    // Handle Agent Chat toggle
    const handleAgentChatClick = () => {
        if (isAgentChatOpen) {
            setIsAgentChatMinimized(!isAgentChatMinimized);
        } else {
            setIsAgentChatOpen(true);
            setIsAgentChatMinimized(false);
        }
    };

    // Calculate position relative to Softphone button
    const getPopupStyle = () => {
        if (!buttonRef.current) return {};
        const buttonRect = buttonRef.current.getBoundingClientRect();
        return {
            bottom: `calc(100vh - ${buttonRect.top}px)`,
            left: `${buttonRect.left}px`,
        };
    };

    // Calculate position for toolbox
    const getToolboxPopupStyle = () => {
        if (!ToolboxbuttonRef.current || !buttonRef.current) return {};
        const toolboxButtonRect = ToolboxbuttonRef.current.getBoundingClientRect();
        const softphoneButtonRect = buttonRef.current.getBoundingClientRect();

        return {
            bottom: `calc(100vh - ${toolboxButtonRect.top}px + 50px)`,
            left: `${softphoneButtonRect.right + 10}px`,
        };
    };
    
    // Calculate position for agent chat
    const getAgentChatPopupStyle = () => {
        if (!agentChatButtonRef.current) return {};
        const agentChatButtonRect = agentChatButtonRef.current.getBoundingClientRect();
        
        return {
            bottom: `calc(100vh - ${agentChatButtonRect.top}px)`,
            left: `${agentChatButtonRect.left - 300}px`, // Position more to the left
        };
    };

    return (
        <>
            {/* Softphone Container */}
            <div
                style={getPopupStyle()}
                className={`fixed transition-all duration-300 ease-in-out 
                 ${!isSoftphoneOpen || isMinimized
                        ? 'opacity-0 pointer-events-none scale-95 translate-y-98'
                        : 'opacity-100 scale-100 translate-y-0'
                    } bottom-12 left-14 w-70 bg-white rounded-t-lg shadow-lg border border-gray-200`}>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-sky-700 to-teal-600 rounded-t-lg">
                    <span className="text-sm font-semibold text-white">Genesys Softphone</span>
                    <div className="flex gap-2">
                        <button onClick={handleSoftphoneClick} className="text-white hover:text-gray-100 transition-colors">
                            {isMinimized ?
                                <AiOutlineExpandAlt className="w-4 h-4" /> :
                                <AiOutlineMinusCircle className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </div>

                <iframe
                    allow="camera *; microphone *; autoplay *; hid *"
                    src="https://apps.mypurecloud.com/crm/embeddableFramework.html"
                    className="w-70 h-113 text-xs"
                    title="Genesys Softphone"
                />
            </div>

            {/* Toolbox Container */}
            <div
                style={{
                    ...getToolboxPopupStyle(),
                    width: '400px',
                    height: '450px',
                }}
                className={`fixed transition-all duration-300 ease-in-out 
                 ${!isToolboxOpen || isToolboxMinimized
                        ? 'opacity-0 pointer-events-none scale-95 translate-y-98'
                        : 'opacity-100 scale-100 translate-y-0'
                    } bottom-12 left-100 w-70 bg-white rounded-t-lg shadow-lg border border-gray-200`}>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-sky-700 to-teal-600 rounded-t-lg">
                    <span className="text-sm font-semibold text-white">Genesys Toolbox</span>
                    <div className="flex gap-2">
                        <button onClick={handleToolboxClick} className="text-white hover:text-gray-100 transition-colors">
                            {isToolboxMinimized ?
                                <AiOutlineExpandAlt className="w-4 h-4" /> :
                                <AiOutlineMinusCircle className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </div>

                <iframe
                    allow="camera *; microphone *; autoplay *; hid *"
                    src="https://apps.mypurecloud.com/crm/interaction.html"
                    className="w-full h-full text-xs"
                    title="Genesys Toolbox"
                />
            </div>
            
            {/* Agent Chat Component */}
            <AgentChat 
                isOpen={isAgentChatOpen}
                isMinimized={isAgentChatMinimized}
                onToggle={handleAgentChatClick}
                position={getAgentChatPopupStyle()}
            />

            {/* Footer - Increased height from h-8 to h-12 */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 h-12 fixed bottom-0 w-full shadow-lg z-10">
                <div className="container mx-auto flex justify-between items-center h-full px-4">
                    <div className='flex space-x-4 items-center h-full'>
                        {/* Softphone - Improved visibility */}
                        <div className='group relative flex items-center px-4 h-full hover:bg-gray-700 transition-colors duration-200'>
                            <IoMdCall
                                className={`${callState.isCallActive ? 'text-green-400' : 'text-gray-200'} mr-2`}
                                size={18}
                            />
                            <button
                                ref={buttonRef}
                                onClick={handleSoftphoneClick}
                                className="flex items-center gap-2"
                            >
                                <span className={`text-sm font-medium
                                    ${isSoftphoneOpen ?
                                        isMinimized
                                            ? 'text-teal-300'
                                            : 'text-green-300'
                                        : 'text-gray-200 group-hover:text-white'
                                    } transition-colors`}>
                                    {isSoftphoneOpen
                                        ? isMinimized
                                            ? (<div className='flex items-center gap-1'><span>Softphone</span> <AiTwotoneUpCircle size={12} /></div>)
                                            : (<div className='flex items-center gap-1'><span>Softphone</span> <AiTwotoneDownCircle size={12} /></div>)
                                        : 'Softphone'
                                    }
                                </span>
                            </button>
                        </div>
                        
                        {/* Toolbox - Improved visibility */}
                        <div className='group relative flex items-center px-4 h-full hover:bg-gray-700 transition-colors duration-200'>
                            <button
                                ref={ToolboxbuttonRef}
                                onClick={handleToolboxClick}
                                className="flex items-center gap-2"
                            >
                                <span className={`text-sm font-medium
                                    ${isToolboxOpen ?
                                        isToolboxMinimized
                                            ? 'text-teal-300'
                                            : 'text-green-300'
                                        : 'text-gray-200 group-hover:text-white'
                                    } transition-colors`}>
                                    {isToolboxOpen
                                        ? isToolboxMinimized
                                            ? (<div className='flex items-center gap-1'><span>Genesys Toolbox</span> <AiTwotoneUpCircle size={12} /></div>)
                                            : (<div className='flex items-center gap-1'><span>Genesys Toolbox</span> <AiTwotoneDownCircle size={12} /></div>)
                                        : 'Genesys Toolbox'
                                    }
                                </span>
                            </button>
                        </div>
                        
                        {/* Agent Chat button - Improved visibility */}
                        <div className='group relative flex items-center px-4 h-full hover:bg-gray-700 transition-colors duration-200'>
                            <RiRobot2Line 
                                className="text-blue-300 mr-2" 
                                size={18}
                            />
                            <button
                                ref={agentChatButtonRef}
                                onClick={handleAgentChatClick}
                                className="flex items-center gap-2"
                            >
                                <span className={`text-sm font-medium
                                    ${isAgentChatOpen ?
                                        isAgentChatMinimized
                                            ? 'text-teal-300'
                                            : 'text-green-300'
                                        : 'text-gray-200 group-hover:text-white'
                                    } transition-colors`}>
                                    {isAgentChatOpen
                                        ? isAgentChatMinimized
                                            ? (<div className='flex items-center gap-1'><span>Nurse AI Assistant</span> <AiTwotoneUpCircle size={12} /></div>)
                                            : (<div className='flex items-center gap-1'><span>Nurse AI Assistant</span> <AiTwotoneDownCircle size={12} /></div>)
                                        : 'Nurse AI Assistant'
                                    }
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className={`text-sm px-4 py-1.5 rounded-full ${callState.isCallActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                            {callState.stateOfCall || 'IDLE'}
                        </span>
                        <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} P. P.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;