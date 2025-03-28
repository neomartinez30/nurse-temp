import React, { useState, useRef, useEffect } from 'react';
import { IoMdCall } from 'react-icons/io';
import { AiOutlineMinusCircle, AiOutlineExpandAlt, AiTwotoneUpCircle, AiTwotoneDownCircle } from 'react-icons/ai';
// import { useDispatch } from 'react-redux';
// import { RootState } from '../../store';
// import { updateCallState, endCall } from '../../store/slices/callSlice';
// import { useNavigate } from 'react-router-dom';
import useCallState from '../../hooks/useCallState';

const Footer: React.FC = () => {
    const [isSoftphoneOpen, setIsSoftphoneOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const callState = useCallState(); // Use our hook to monitor call state
    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    const [isToolboxOpen, setIsToolboxOpen] = useState(false);
    const [isToolboxMinimized, setIsToolboxMinimized] = useState(false);
    const ToolboxbuttonRef = useRef<HTMLButtonElement>(null);

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

    // Calculate position relative to Softphone button
    const getPopupStyle = () => {
        if (!buttonRef.current) return {};
        const buttonRect = buttonRef.current.getBoundingClientRect();
        return {
            bottom: `calc(100vh - ${buttonRect.top}px)`,
            left: `${buttonRect.left}px`,
        };
    };

    // Calculate position relative to Softphone button
    const getToolboxPopupStyle = () => {
        // if (!ToolboxbuttonRef.current) return {};
        // const ToolboxbuttonRect = ToolboxbuttonRef.current.getBoundingClientRect();
        // return {
        //     bottom: `calc(100vh - ${ToolboxbuttonRect.top}px)`,
        //     left: `${ToolboxbuttonRect.left}px`,
        // };
        if (!ToolboxbuttonRef.current || !buttonRef.current) return {};
        const toolboxButtonRect = ToolboxbuttonRef.current.getBoundingClientRect();
        const softphoneButtonRect = buttonRef.current.getBoundingClientRect();

        return {
            bottom: `calc(100vh - ${toolboxButtonRect.top}px + 50px)`, // Position above the button
            left: `${softphoneButtonRect.right + 10}px`, // Position beside the Softphone popup
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
                    } bottom-8 left-14 w-70 bg-white rounded-t-lg shadow-lg border border-gray-200`}>
                <div className="flex justify-between items-center p-2 bg-gray-400 rounded-t-lg">
                    <span className="text-sm font-semibold ">Genesys Softphone</span>
                    <div className="flex gap-2">
                        <button onClick={handleSoftphoneClick}>
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
                    } bottom-8 left-100 w-70 bg-white rounded-t-lg shadow-lg border border-gray-200`}>
                <div className="flex justify-between items-center p-2 bg-gray-400 rounded-t-lg">
                    <span className="text-sm font-semibold">Genesys Softphone</span>
                    <div className="flex gap-2">
                        <button onClick={handleToolboxClick}>
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
                    //  style={{
                    //     width: '100%',
                    //     height: '100%',
                    //     border: 'none',
                    //     borderRadius: '4px',
                    //     boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    //   }}
                    title="Genesys Softphone"
                />
            </div >

            {/* Footer */}
            < footer className="bg-gray-900 h-[1.5rem] pl-8 text-white fixed bottom-0 w-full" >
                <div className="container mx-auto flex justify-between items-center align-center px-4">
                    <div className='flex justify-between items-center px-1'>
                        {/* softphone */}
                        <div className='flex justify-between items-center bg-gray-800 px-1'>
                            <IoMdCall
                                className={` ${callState.isCallActive ? 'text-green-500 text-xs' : 'text-gray-400 text-xs'}`}
                            />
                            <button
                                ref={buttonRef}
                                onClick={handleSoftphoneClick}
                                className="flex items-center gap-2 pl-4 py-1 rounded-md transition-colors"
                            >
                                <span className={`flex text-[9px]
                             ${isSoftphoneOpen ?
                                        isMinimized
                                            ? 'text-teal-600 text-xs hover:text-teal-700'
                                            : 'text-green-600 text-xs hover:text-green-700'
                                        : 'text-yellow-600 hover:text-yellow-700'
                                    }`}>
                                    {isSoftphoneOpen
                                        ? isMinimized
                                            ? (<div className='flex text-xs items-center gap-1'><span>Softphone</span> <AiTwotoneUpCircle /></div>)
                                            : (<div className='flex text-xs items-center gap-1'><span>Softphone</span>< AiTwotoneDownCircle /></div>)
                                        : 'Softphone'
                                    }
                                </span>
                            </button>
                        </div>
                        {/* toolbox */}
                        <div className='flex ml-4 justify-between items-center bg-gray-800 px-1'>
                            {/* <IoMdCall 
                             className={` ${callState.isCallActive ? 'text-green-500 text-xs' : 'text-gray-400 text-xs'}`} 
                         /> */}
                            <button
                                ref={ToolboxbuttonRef}
                                onClick={handleToolboxClick}
                                className="flex items-center  gap-2 pl-4 py-1 rounded-md transition-colors"
                            >
                                <span className={`flex text-[9px]
                             ${isToolboxOpen ?
                                        isToolboxMinimized
                                            ? 'text-teal-600 text-xs hover:text-teal-700'
                                            : 'text-green-600 text-xs hover:text-green-700'
                                        : 'text-yellow-600 hover:text-yellow-700'
                                    }`}>
                                    {isToolboxOpen
                                        ? isToolboxMinimized
                                            ? (<div className='flex text-xs items-center gap-1'><span>Genesys Toolbox</span> <AiTwotoneUpCircle /></div>)
                                            : (<div className='flex text-xs items-center gap-1'><span>Genesys Toolbox</span>< AiTwotoneDownCircle /></div>)
                                        : 'Genesys Toolbox'
                                    }
                                </span>
                            </button>
                        </div>
                    </div>

                    <span className={`text-[9px] ${callState.isCallActive ? 'text-green-500' : 'text-gray-400'}`}>
                        {callState.stateOfCall || 'IDLE'}
                    </span>
                    <p className="text-[9px] text-gray-400">&copy; {new Date().getFullYear()} P. P.</p>
                </div>
            </footer >
        </>
    );
};

export default Footer;