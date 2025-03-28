import React, { useEffect, useState } from 'react';

import { IoMdCall, IoMdPerson, IoMdCopy } from 'react-icons/io';
// import { BiTime } from 'react-icons/bi';
// import { FiMessageSquare } from 'react-icons/fi';
import { FiShare2, FiAlertTriangle } from 'react-icons/fi';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';


import { useCallerData } from '../../hooks/useCallerData';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateCallerDataTable } from '../../store/slices/databaseSlice';
// import useCallState from '../../hooks/useCallState';

// import AWSChime from '../components/AWSChime';
// import GenesysChat from '../components/GenesysChat';
// import ClearTriage from '../components/ClearTriage';


// FamilyMember interface matches what we need for the component
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  accountNumber: string;
  status: string;
}

const AgentDesktop: React.FC = () => {
  const dispatch = useDispatch();
  const callState = useSelector((state: RootState) => state.call);
  const callerData1 = useSelector((state: RootState) => state.database);
  const [callerId, setCallerId] = useState<string | null>(null);
  const { callerData, isLoading } = useCallerData(callerId);

  // const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // const [activePopup, setActivePopup] = useState<string | null>(null);

  useCallerData(callerId);

  useEffect(() => {
    let temp = callState.callerId?.slice(4) || null;
    console.log('tempppp:', temp);
    setCallerId(temp);
  }, [callState.callerId]);

  // Search functionality using data from Redux store
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim() || !callerData1.FamilyMembers) {
      setSearchResults([]);
      return;
    }

    const termLower = term.toLowerCase();

    // Add proper type checking before accessing properties
    const results = (callerData1.FamilyMembers as FamilyMember[])
      .filter(member =>
        member.name.toLowerCase().includes(termLower)
      );

    setSearchResults(results);
  };
  const handleEditClick = () => {
    // setTempName(callerData?.name ?? '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    // isLoading(true);
    try {
      // Optional: Call API to update the backend
      if (callerId) {
        // await api.updateCallerInfo("9d224bea-b8af-4934-9187-163cb57e8eb5", callerId, {
        //   Name: tempName
        // });
      }

      // Update Redux store
      dispatch(updateCallerDataTable({
        ...callerData,
        Name: tempName
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      // setIsLoading(false);
    }
  };


  // const togglePopup = (popup: string) => {
  //   setActivePopup(activePopup === popup ? null : popup);
  // };

  const renderNameField = () => (
    <div className='flex items-center space-x-2'>
      <IoMdPerson className='text-blue-500' />
      {isEditing ? (
        <div className='flex items-center space-x-2'>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className='text-xs border rounded px-2 py-1 w-40'
            autoFocus
          />
          <button
            onClick={handleSave}
            className='text-xs text-green-600 hover:text-green-700'
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className='text-xs text-red-600 hover:text-red-700'
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className='flex items-center space-x-2'>
          <span className='text-xs text-gray-600'>
            Name: {isLoading ? 'Loading...' : callerData1?.Name || 'Unknown'}
          </span>
          <button
            onClick={handleEditClick}
            className='text-xs text-blue-600 hover:text-blue-700'
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );


  return (
    <div className='h-[85vh] ml-12 mt-1 mr-3 bg-gray-100 p-1 overflow-auto'>
      {/* <h1 className='text-xl font-semibold mb-6'>Agent Desktop</h1> */}

      {/* Ticket Card */}
      <div className='bg-white w-full rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-1'>

        <div className='flex items-center justify-between px-2'>
          {/* Left side information */}
          <div className='flex items-center space-x-8'>
            <div>
              {renderNameField()}
              <div className='flex items-center space-x-2'>
                <IoMdCall className='text-blue-500' />
                <span className='text-xs text-gray-600'>Caller ID: {callState.callerId}</span>
              </div>
            </div>
            {/* Ticket Number with Copy */}
            <div className='flex items-center space-x-2'>
              <span className='text-xs font-medium text-gray-500'>Ticket:</span>
              <span className='text-xs font-semibold text-gray-700'>#{callerData1?.TicketNumber || '---'}</span>
              <button
                onClick={() => navigator.clipboard.writeText('TK-2024-001')}
                className='p-1 hover:bg-gray-100 rounded-full transition-colors'
              >
                <IoMdCopy className='w-4 h-4 text-gray-400 hover:text-blue-500' />
              </button>
            </div>

            {/* Creation Date */}
            {/* <div className='flex items-center space-x-2'>
              <span className='text-xs font-medium text-gray-500'>Created:</span>
              <span className='text-xs text-gray-700'>Mar 8, 2024</span>
            </div> */}

            {/* Owner */}
            <div className='flex items-center space-x-2'>
              <span className='text-xs font-medium text-gray-500'>Owner:</span>
              <span className='text-xs text-gray-700'>{callerData1?.TicketOwner || 'Unassigned'}</span>
            </div>

            {/* Status */}
            <div className='flex items-center space-x-2'>
              <span className='text-xs font-medium text-gray-500'>Status:</span>
              <span className='text-xs text-green-600'>{callerData1?.TicketStatus || 'Unknown'}</span>
            </div>
          </div>

          {/* Right side buttons */}
          <div className='flex items-center space-x-3'>
            <button className='flex items-center space-x-1 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-md transition-colors'>
              <FiShare2 className='w-4 h-4' />
              <span>Transfer</span>
            </button>

            <button className='flex items-center space-x-1 px-3 py-1 text-xs text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors'>
              <FiAlertTriangle className='w-4 h-4' />
              <span>Escalate</span>
            </button>

            <button className='flex items-center space-x-1 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors'>
              <IoCloseCircleOutline className='w-4 h-4' />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Call status + Medical */}
      <div className='flex'>
        <div className='grid grid-cols-1 mt-2 gap-2'>

          {/* Call Status Card */}
          <div className='bg-white w-[25vw] h-[30vh] rounded-lg shadow-sm p-2 border border-gray-100 hover:shadow-md transition-shadow'>
            {callState.isCallActive ? (
              <div className='space-y-1'>
                <div className=''>
                  <div className='flex flex-col'>
                    <div className='relative'>
                      <input
                        type="text"
                        placeholder="Search family members..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className='w-full text-xs border rounded-md px-8 py-1.5'
                      />
                      <BiSearch className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />

                      {/* Dropdown for search results */}
                      {searchResults.length > 0 && searchTerm && (
                        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg'>
                          {searchResults.map(member => (
                            <button
                              key={member.id}
                              onClick={() => {
                                setSelectedMember(member);
                                setSearchTerm(''); // Clear search after selection
                              }}
                              className='w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
                            >
                              <div className='font-medium'>{member.name}</div>
                              <div className='text-gray-500 text-xs'>
                                {member.relationship} • #{member.accountNumber}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>


                  </div>
                </div>
                {/* Customer Info Card */}
                <div className='bg-white rounded-lg p-1 border border-gray-300'>
                  <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-xs font-medium text-gray-800'>Patient Information</h2>
                    <IoMdPerson className='w-3 h-3 text-blue-500' />
                  </div>

                  <div className='space-y-2'>
                    {selectedMember ? (
                      <>
                        <p className='text-xs text-gray-600'>Name: {selectedMember.name}</p>
                        <p className='text-xs text-gray-600'>Relationship: {selectedMember.relationship}</p>
                        <p className='text-xs text-gray-600'>Account: #{selectedMember.accountNumber}</p>
                        <p className='text-xs text-gray-600'>Status: {selectedMember.status}</p>
                      </>
                    ) : (
                      <p className='text-xs text-gray-500 italic'>
                        {searchTerm ? 'No results found' : 'Search for a family member'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center space-x-2 text-gray-500'>
                <span className='text-xs'>Information will load after the call connects</span>
              </div>
            )}
          </div>

          {/* Redesign of Caller Info */}
          <div className='bg-white w-[25vw] h-[30vh] rounded-lg shadow-sm p-2 border border-gray-100 hover:shadow-md transition-shadow'>
            {renderNameField()}
            {!callState.isCallActive ? (
              <div className='space-y-1'>
                <div className=''>
                  <div className='flex flex-col'>
                    <div className='relative'>
                      <input
                        type="text"
                        placeholder="Search family members..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className='w-full text-xs border rounded-md px-8 py-1.5'
                      />
                      <BiSearch className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />

                      {/* Dropdown for search results */}
                      {searchResults.length > 0 && searchTerm && (
                        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg'>
                          {searchResults.map(member => (
                            <button
                              key={member.id}
                              onClick={() => {
                                setSelectedMember(member);
                                setSearchTerm(''); // Clear search after selection
                              }}
                              className='w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
                            >
                              <div className='font-medium'>{member.name}</div>
                              <div className='text-gray-500 text-xs'>
                                {member.relationship} • #{member.accountNumber}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>


                  </div>
                </div>
                {/* Customer Info Card */}
                <div className='bg-white rounded-lg p-1 border border-gray-300'>
                  <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-xs font-medium text-gray-800'>Patient Information</h2>
                    <IoMdPerson className='w-3 h-3 text-blue-500' />
                  </div>

                  <div className='space-y-2'>
                    {selectedMember ? (
                      <>
                        <p className='text-xs text-gray-600'>Name: {selectedMember.name}</p>
                        <p className='text-xs text-gray-600'>Relationship: {selectedMember.relationship}</p>
                        <p className='text-xs text-gray-600'>Account: #{selectedMember.accountNumber}</p>
                        <p className='text-xs text-gray-600'>Status: {selectedMember.status}</p>
                      </>
                    ) : (
                      <p className='text-xs text-gray-500 italic'>
                        {searchTerm ? 'No results found' : 'Search for a family member'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center space-x-2 text-gray-500'>
                <span className='text-xs'>Information will load after the call connects</span>
              </div>
            )}
          </div>



          {/* Medical Notes Section - Small Size */}
          <div className='bg-white w-[25vw] h-[40vh] rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow col-span-1'>
            <div className='flex items-center justify-between mb-1'>
              <h2 className='text-xs font-medium text-gray-800'>Medical Notes</h2>
              <button className='text-blue-500 hover:text-blue-700 text-xs'>+ Add Note</button>
            </div>
            <div className='space-y-2 max-h-40 overflow-y-auto'>
              <div className='border-l-2 border-blue-500 pl-2 py-1'>
                <p className='text-xs text-gray-800 font-medium'>03/10/2025 - Dr. Johnson</p>
                <p className='text-xs text-gray-600'>Patient reported persistent headaches. Prescribed ibuprofen 400mg.</p>
              </div>
              <div className='border-l-2 border-gray-300 pl-2 py-1'>
                <p className='text-xs text-gray-800 font-medium'>03/05/2025 - Dr. Smith</p>
                <p className='text-xs text-gray-600'>Annual checkup. All vitals normal. No concerns noted.</p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-2 mt-2'>
          {/* Video/Genesys Tool - Medium Size with Tabs */}
          {/* <div className='bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow mx-1 p-1'>
            <div className='border-b'>
              <div className='flex'>
                <button onClick={() => handleTabChange('video')} className='px-4 py-2 text-xs font-medium text-blue-600 border-b-2 border-blue-500'>
                  Video Consult
                </button>
                <button onClick={() => handleTabChange('genesys')} className='px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700'>
                  Genesys Tools
                </button>
              </div>
            </div>
            {activeTab === 'video' ? (

              <div className='p-4'>
                <AWSChime />
              </div>
            ) : (

              <div className='p-4'>
                <GenesysChat />
              </div>
            )}

          </div> */}



          {/* Triage Tool - Large Size (Right Side) */}
          {/* <div className='bg-white  rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow col-span-1 row-span-2 lg:col-start-3 lg:row-start-1'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-medium text-gray-800'>Triage Tool</h2>
            </div>
            <div className='space-y-4'>
              <ClearTriage />
              </div>
           
          </div> */}
        </div>
      </div>

      {/* Footer with popup buttons */}
      {/* <div className='col-span-full mt-4 border-t pt-3 flex justify-center space-x-6'>
        <button onClick={() => togglePopup('insurance')} className='px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors'>
          Insurance Info
        </button>
        <button className='px-3 py-1 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors'>
          Prescription History
        </button>
        <button className='px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors'>
          Lab Results
        </button>
        <button className='px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors'>
          Appointment History
        </button>
      </div> */}
    </div>
  );
};

export default AgentDesktop;