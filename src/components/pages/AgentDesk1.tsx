import React, { useState, useEffect } from 'react';
import { ImCircleDown, ImCircleUp } from "react-icons/im";
import { RiWifiOffLine } from "react-icons/ri";
import { MdOutlineVerifiedUser, MdOutlineSms, MdOutlineMail, MdEdit } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai';
import { Rnd } from 'react-rnd';
import { FiVideo, FiVideoOff } from "react-icons/fi";
import { IoIosVideocam, IoMdCopy } from "react-icons/io";

import { useCallerData } from '../../hooks/useCallerData';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateCallerDataTable } from '../../store/slices/databaseSlice';
import useCallState from '../../hooks/useCallState';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  accountNumber: string;
  DOB: string;
  Age: string;
  Address: string;
  DOD_ID: string;
  status: string;
}

const AgentDesk1: React.FC = () => {
  const [isMedicalNotesCollapsed, setIsMedicalNotesCollapsed] = useState(true);
  const [isCareCoNotesCollapsed, setIsCareCoNotesCollapsed] = useState(false);
  const [isContactRecNotesCollapsed, setIsContactRecNotesCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'DEERS' | 'MedicalHistory'>('DEERS');
  const [isDODVisible, setIsDODVisible] = useState(false);

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const dispatch = useDispatch();
  const callState = useSelector((state: RootState) => state.call);
  const callerData1 = useSelector((state: RootState) => state.database);
  const [callerId, setCallerId] = useState<string | null>(null);
  const { callerData, isLoading } = useCallerData(callerId);
  const callState1 = useCallState();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // State for checkboxes
  const [isTranscriptChecked, setIsTranscriptChecked] = useState(false);
  const [isCaseDataChecked, setIsCaseDataChecked] = useState(false);
  const [isClearTriageChecked, setIsClearTriageChecked] = useState(false);
  const [isCareCoordinatorChecked, setIsCareCoordinatorChecked] = useState(false);

  useCallerData(callerId);

  useEffect(() => {
    let temp = callState.callerId?.slice(4) || null;
    console.log('tempppp:', temp);
    setCallerId(temp);

    if (temp) {
      // Call the API to fetch caller info when a call is answered
      const callApi = async () => {
        try {
          const response = await fetch('https://cyjrnbi0cg.execute-api.us-east-1.amazonaws.com/dev/onAction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ onAction: 'joinMeeting' }),
          });
          const data = await response.json();
          if (data.statusCode === 200) {
            setUniqueKey(data.body.uniqueKey);
            console.log('Unique Key:', data.body.uniqueKey);
          }
        } catch (error) {
          console.error('Error calling API:', error);
        }
      };

      callApi();
    }
  }, [callState.callerId]);

  const handleSave = async () => {
    try {
      // Optional: Call API to update the backend
      if (callerId) {
        // Example API call to update caller info
        // await api.updateCallerInfo(callerId, { Name: tempName });
      }

      // Update Redux store
      dispatch(updateCallerDataTable({
        ...callerData,
        Name: tempName,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleEditClick = () => {
    setTempName(callerData?.name || ''); // Set the temporary name to the current caller's name
    setIsEditing(true); // Enable editing mode
  };

  const renderNameField = () => (
    <div className='flex items-center space-x-2'>
      {isEditing ? (
        <div className='flex items-center space-x-2'>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className='text-sm border rounded px-3 py-1.5 w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            autoFocus
          />
          <button
            onClick={handleSave}
            className='text-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors px-3 py-1.5 rounded shadow-sm'
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className='text-sm text-white bg-gray-500 hover:bg-gray-600 transition-colors px-3 py-1.5 rounded shadow-sm'
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className='flex items-center space-x-2 w-full'>
          <span className='text-xl text-white font-semibold'>
            {isLoading ? 'Loading...' : callerData1?.Name || 'Unknown'}
          </span>
          <button
            onClick={handleEditClick}
            className='text-sm text-white hover:text-teal-200 transition-colors bg-teal-700 rounded-full p-1'
          >
            <MdEdit />
          </button>
        </div>
      )}
    </div>
  );

  const toggleVideoWindow = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsVideoOpen(!isVideoOpen);
    }
  };

  const minimizeVideoWindow = () => {
    setIsMinimized(true);
  };

  const closeVideoWindow = () => {
    setIsVideoOpen(false);
    setIsMinimized(false);
  };

  const toggleDODVisibility = () => {
    setIsDODVisible(!isDODVisible);
  };

  const toggleMedicalNotes = () => {
    setIsMedicalNotesCollapsed(!isMedicalNotesCollapsed);
  };

  const toggleCCicalNotes = () => {
    setIsCareCoNotesCollapsed(!isIsCareCoNotesCollapsed);
  };

  const toggleCRMedicalNotes = () => {
    setIsContactRecNotesCollapsed(!isContactRecNotesCollapsed);
  };

  function handleSearch(value: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex ml-2 bg-gray-50 flex-col h-full">
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Patient Information - REDUCED HEIGHT */}
          <div className="m-0">
            <div className="flex ml-4 mb-4 h-auto shadow-md rounded-lg overflow-hidden">
              <div className="w-2/5 bg-white">
                <div className="flex justify-between bg-gray-100 border-gray-300 border-b">
                  <div className="text-xs font-semibold items-center justify-center py-2 px-3 text-blue-700 flex">
                    <p className="mr-2">{callerData1?.TicketNumber || '---'}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText('TK-2024-001')}
                      className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                    >
                      <IoMdCopy className='w-4 h-4 text-gray-500 hover:text-blue-600' />
                    </button>
                  </div>
                  <div className="text-xs font-semibold py-2 px-3 text-gray-700">{callerData1?.TicketCreatedAt || '--'}</div>
                </div>

                <div className="flex bg-gradient-to-r justify-between from-sky-700 to-teal-600 px-4 py-4 items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-gray-700 font-semibold">JD</span>
                    </div>
                    <div className="ml-4 flex-grow">
                      {renderNameField()}
                      <p className="text-xs text-gray-200 mt-1">{callState.callerId}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button title='SMS' className="p-2 mx-1 bg-teal-800 hover:bg-teal-700 transition-colors rounded-lg text-white shadow">
                      <MdOutlineSms className='w-5 h-5' />
                    </button>
                    <button title='Email' className="p-2 mx-1 bg-teal-800 hover:bg-teal-700 transition-colors rounded-lg text-white shadow">
                      <MdOutlineMail className='w-5 h-5' />
                    </button>
                    <button title='TeleHealth' onClick={toggleVideoWindow} className={`p-2 mx-1 ${isVideoOpen ? 'bg-teal-700' : 'bg-teal-800 hover:bg-teal-700'} transition-colors rounded-lg text-white shadow`}>
                      {isVideoOpen ? <FiVideo className='w-5 h-5' /> : <FiVideoOff className='w-5 h-5' />}
                    </button>
                  </div>
                </div>

                <div className='p-3'>
                  <div className='flex justify-between mb-2'>
                    <h3 className="text-sm font-semibold text-gray-700 bg-gray-100 py-1 px-3 rounded-md shadow-sm">PATIENT INFORMATION</h3>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1 rounded shadow transition-colors">
                      Save to Ticket
                    </button>
                  </div>
                  <div className='flex justify-between items-center px-2 mb-2'>
                    <div className="relative border w-full justify-between items-center rounded flex">
                      <input
                        type="text"
                        placeholder="Patient lookup..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className='w-full text-xs rounded-md px-4 py-2 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50'
                      />
                      {searchResults.length > 0 && searchTerm && (
                        <div className='absolute z-10 w-full mt-1 top-full bg-white border border-gray-200 rounded-md shadow-lg'>
                          {searchResults.map(member => (
                            <button
                              key={member.id}
                              onClick={() => {
                                setSelectedMember(member);
                                setSearchTerm('');
                              }}
                              className='w-full text-left px-4 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
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
                  <div className='flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm'>
                    {selectedMember ? (
                      <div className="flex flex-col w-1/2 space-y-1">
                        <div className="flex flex-row text-xs">
                          <p className="font-semibold w-28">Patient Name:</p>
                          <p className='px-1 text-gray-700'>{selectedMember.name}</p>
                        </div>
                        <div className="flex flex-row text-xs">
                          <p className="font-semibold w-28">Relationship:</p>
                          <p className='px-1 text-gray-700'>{selectedMember.relationship}</p>
                        </div>
                        <div className="flex flex-row text-xs">
                          <p className="font-semibold w-28">DOB:</p>
                          <p className='px-1 text-gray-700'>{selectedMember.DOB}</p>
                        </div>
                        <div className="flex flex-row text-xs">
                          <p className="font-semibold w-28">Age:</p>
                          <p className='px-1 text-gray-700'>{selectedMember.Age}</p>
                        </div>
                        <div className="flex flex-row text-xs">
                          <p className="font-semibold w-28">Address:</p>
                          <p className='px-1 text-gray-700'>{selectedMember.Address}</p>
                        </div>
                        <div className="flex flex-row text-xs items-center">
                          <p className="font-semibold w-28">DOD ID:</p>
                          <p className="px-1 text-gray-700 flex items-center">
                            {isDODVisible ? (selectedMember.DOD_ID) : "***************"}
                            <button
                              onClick={toggleDODVisibility}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              {isDODVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className='text-xs h-fit items-center text-gray-500 italic'>
                        {callState1.isCallActive ? (
                          searchTerm ? 'No results found' : 'Search for a Patient Details'
                        ) : (
                          'No active call'
                        ) }
                      </p>
                    )}
                    <div className="flex flex-row justify-end items-start w-1/2 mx-2">
                      {callState1.isCallActive ? (
                        <div className="flex items-center text-green-600">
                          <MdOutlineVerifiedUser className='w-5 h-5 mr-2' />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      ) : (
                        <button disabled className="text-gray-500 flex items-center justify-center gap-2 h-fit text-xs px-4 py-2 border rounded-md bg-gray-50">
                          <RiWifiOffLine />
                          Offline Verification
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-3/5 bg-white ml-0.25 pl-2 border-gray-300 border-t">
                <div className="border-b border-gray-300">
                  <nav className="flex">
                    <button
                      className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'DEERS' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-600 hover:text-gray-800'}`}
                      onClick={() => setActiveTab('DEERS')}
                    >
                      DEERS
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'MedicalHistory' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-600 hover:text-gray-800'}`}
                      onClick={() => setActiveTab('MedicalHistory')}
                    >
                      Medical History
                    </button>
                  </nav>
                </div>

                {/* DEERS Tab Content - REDUCED HEIGHT */}
                {activeTab === 'DEERS' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-4 p-3">
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Primary</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">John Doe</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">DOB</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">12/05/1991</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Assignment</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Fort Belvoir</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Category</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">33</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Restrictions</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">N/A</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">DOD ID</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">N/A</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Beneficiary First Name</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">John</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">PCM Clinic Name</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Dumfries Health Center</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Dependents</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">
                          Mary Doe (Spouse) <br /> Liam Doe (Child)
                        </p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Beneficiary Last Name</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Doe</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">PCM Name</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Dr. Selwyn Adams, MD</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Branch Of Service</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Marine Army</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Benefit Type</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">TRICARE Prime</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Middle Initial</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">A</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Military Duty Status</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Active (On Duty)</p>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Enrollment Location</p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded">Virginia</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical History Tab Content - REDUCED HEIGHT */}
                {activeTab === 'MedicalHistory' && (
                  <div className="space-y-4 p-3">
                    <div className="bg-white rounded-md p-3 shadow-sm border border-gray-100">
                      <p className="font-semibold text-gray-700 mb-2 text-sm">Active Conditions</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-2 text-xs">
                        <li className="p-2 bg-gray-50 rounded">
                          Victim of intimate partner abuse (finding) - Diagnosed on 2022-02-18
                        </li>
                        <li className="p-2 bg-gray-50 rounded">
                          Unhealthy alcohol drinking behavior (finding) - Diagnosed on 2019-02-15
                        </li>
                        <li className="p-2 bg-gray-50 rounded">
                          Body mass index 30+ - obesity (finding) - Diagnosed on 2016-02-12
                        </li>
                        <li className="p-2 bg-gray-50 rounded">
                          Social isolation (finding) - Diagnosed on 2007-02-02
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <section className="flex h-auto ml-4 mb-4 space-x-4">
            {/* Left Side - Case, Medical, CareC, Record section */}
            <div className='flex-col w-4/7'>
              {/* Case Information */}
              <div className='bg-white rounded-lg shadow-md p-4 mb-4'>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm">CASE INFORMATION</h3>
                  <div className="flex bg-gray-50 rounded-md shadow-sm">
                    <button className="py-2 px-3 text-xs font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-100 rounded-l-md transition-colors">Split</button>
                    <button className="py-2 px-3 text-xs font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-100 transition-colors">Clones</button>
                    <button className="py-2 px-3 text-xs font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-100 transition-colors">Follow Up</button>
                    <button className="py-2 px-3 text-xs font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-100 transition-colors">Escalate</button>
                    <button className="py-2 px-3 text-xs font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-100 transition-colors">Transfer</button>
                    <button className="py-2 px-3 text-xs font-medium text-gray-700 hover:text-teal-700 hover:bg-gray-100 rounded-r-md transition-colors">Close</button>
                  </div>
                </div>
                <div className="flex mb-4 justify-start items-center">
                  <label className="block text-sm font-semibold text-gray-700">Case Status:</label>
                  <select className="m-1 block w-auto pl-3 pr-10 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-xs rounded">
                    <option className='text-xs'>Active</option>
                    <option className='text-xs'>Closed</option>
                    <option className='text-xs'>Pending</option>
                  </select>
                </div>
                <hr className="mb-4 border-gray-200" />
                <div className="grid grid-cols-4 gap-6 mb-6 ml-3">
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Case Number</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>039A830D0291</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Case Open At</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>03-12-2025</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Best Callback Number</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>+1 773-832-9281</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Case Owner</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>Robert D.</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Care Coordinator</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>Sarah Martinez</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Channel</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>-</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Contact City</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>CONUS</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Contact State</p>
                    <p className='text-gray-600 bg-gray-50 px-3 py-2 rounded'>Virginia</p>
                  </div>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="mb-4 flex items-center">
                  <label className="block mx-2 text-sm font-semibold text-gray-700">Contact Reason:</label>
                  <select className="block w-fit pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded">
                    <option className='text-xs'>Prescription update request</option>
                    <option className='text-xs'>Appointment scheduling</option>
                    <option className='text-xs'>General inquiry</option>
                  </select>
                </div>
                <div className="mb-4 ml-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Summary:</label>
                  <textarea
                    className="mt-1 p-3 block w-full border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    rows={5}
                    placeholder="Enter contact summary..."
                  ></textarea>
                </div>
              </div>

              {/* Case Data Section */}
              <section className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm mb-4">CASE DATA</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Categorization */}
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-2">Categorization</p>
                    <div className="flex flex-col space-y-2">
                      <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                        <option className='text-xs'>Asymptomatic</option>
                        <option className='text-xs'>Symptomatic</option>
                      </select>
                    </div>
                  </div>

                  {/* Travelling */}
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-2">Travelling</p>
                    <div className="flex flex-col space-y-2">
                      <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                        <option className='text-xs'>Yes</option>
                        <option className='text-xs'>No</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Duty */}
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700 mb-2">Active Duty</p>
                    <div className="flex flex-col space-y-2">
                      <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                        <option className='text-xs'>Yes</option>
                        <option className='text-xs'>No</option>
                      </select>
                    </div>
                  </div>

                  {/* Pre-intent */}
                  <div className="text-xs mt-4">
                    <p className="font-semibold text-gray-700 mb-2">Pre-intent</p>
                    <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                      <option className='text-xs'>Option 1</option>
                      <option className='text-xs'>Option 2</option>
                    </select>
                  </div>

                  {/* High Risk */}
                  <div className="text-xs mt-4">
                    <p className="font-semibold text-gray-700 mb-2">High Risk</p>
                    <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                      <option className='text-xs'>Critical</option>
                      <option className='text-xs'>Moderate</option>
                      <option className='text-xs'>Normal</option>
                    </select>
                  </div>
                </div>
              </section>

            </div>

            {/* Nurse's Toolkit */}
            <div className="w-3/7 mb-4 bg-white flex flex-col rounded-lg shadow-md h-auto">
              <div className="flex-col p-3 border-b border-gray-200 bg-gray-100">
                <h3 className="text-lg font-bold text-gray-700">NURSE'S TOOLKIT</h3>
              </div>
              <div className="flex-grow p-1">
                <iframe
                  src="https://app.cleartriage.com/app/login"
                  className="w-full h-full rounded-b-lg"
                  style={{
                    border: 'none',
                  }}
                  title="Clear Triage"
                />
              </div>
            </div>

          </section>

          {/* Medical Notes Section */}
          <section className="bg-white rounded-lg shadow-md p-4 ml-4 mb-6">
            <div className='flex'>
              <div className='flex-col mr-4 w-4/7'>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm cursor-pointer flex items-center" onClick={toggleMedicalNotes}>
                    MEDICAL NOTES
                    {isMedicalNotesCollapsed ? <ImCircleDown className="ml-2" /> : <ImCircleUp className="ml-2" />}
                  </h3>
                  <button className="py-2 px-4 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded shadow transition-colors">
                    Generate Medical Notes
                  </button>
                </div>
                <div className='flex justify-start items-start mb-4'>
                  <div className="flex-col w-1/2 mr-6 justify-start items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nurse Disposition:</label>
                    <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                      <option className='text-xs'>Disposition 1</option>
                      <option className='text-xs'>Disposition 2</option>
                      <option className='text-xs'>Disposition 3</option>
                    </select>
                  </div>
                  <div className="flex-col w-1/2 justify-start items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1">System Disposition:</label>
                    <select className="block w-full px-3 py-2 text-xs border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                      <option className='text-xs'>Sys Disposition 1</option>
                      <option className='text-xs'>Sys Disposition 2</option>
                      <option className='text-xs'>Sys Disposition 3</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                  <textarea
                    placeholder="Enter justification here..."
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    rows={3}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Enter medical notes here..."
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    rows={3}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Checkboxes:</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isTranscriptChecked}
                        onChange={() => setIsTranscriptChecked(!isTranscriptChecked)}
                        className="form-checkbox text-teal-600"
                      />
                      <span className="text-sm">Transcript</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isCaseDataChecked}
                        onChange={() => setIsCaseDataChecked(!isCaseDataChecked)}
                        className="form-checkbox text-teal-600"
                      />
                      <span className="text-sm">Case Data</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isClearTriageChecked}
                        onChange={() => setIsClearTriageChecked(!isClearTriageChecked)}
                        className="form-checkbox text-teal-600"
                      />
                      <span className="text-sm">ClearTriage</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isCareCoordinatorChecked}
                        onChange={() => setIsCareCoordinatorChecked(!isCareCoordinatorChecked)}
                        className="form-checkbox text-teal-600"
                      />
                      <span className="text-sm">Care Coordinator Notes</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className='w-3/7 mt-7'>
                <div className="flex h-full flex-col border-2 rounded-lg border-gray-200 p-4 bg-gray-50 shadow-inner">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Conditions</h4>
                  <div className="space-y-2">
                    <div className="flex p-2 flex-row text-xs items-center justify-between bg-white rounded shadow-sm">
                      <p className="text-gray-700">Abdominal Pain - Upper</p>
                      <button className="text-red-500 hover:text-red-700">
                        <AiOutlineClose className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex p-2 flex-row text-xs items-center justify-between bg-white rounded shadow-sm">
                      <p className="text-gray-700">Abdomen Bloating</p>
                      <button className="text-red-500 hover:text-red-700">
                        <AiOutlineClose className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex p-2 flex-row text-xs items-center justify-between bg-white rounded shadow-sm">
                      <p className="text-gray-700">Diabetic - Male</p>
                      <button className="text-red-500 hover:text-red-700">
                        <AiOutlineClose className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Care Coordinator Notes*/}
          <section className="bg-white rounded-lg shadow-md p-4 ml-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm cursor-pointer flex items-center" onClick={toggleCCicalNotes}>
                CARE-COORDINATOR NOTES
                {!isCareCoNotesCollapsed ? <ImCircleDown className="ml-2" /> : <ImCircleUp className="ml-2" />}
              </h3>
            </div>
            {isCareCoNotesCollapsed && (
              <div className='block w-full'>
                <div className="mb-2">
                  <textarea
                    placeholder='Type Care Coordinator Notes...'
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            )}
          </section>

          {/* Contact records and Files */}
          <section className="bg-white rounded-lg shadow-md p-4 ml-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm cursor-pointer flex items-center" onClick={toggleCRMedicalNotes}>
                CONTACT RECORDS & FILES
                {!isContactRecNotesCollapsed ? <ImCircleDown className="ml-2" /> : <ImCircleUp className="ml-2" />}
              </h3>
            </div>
            {isContactRecNotesCollapsed && (
              <div className='block w-full'>
                <div className="mb-2">
                  <textarea
                    placeholder='Type Contact Records...'
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Video Call Section */}
        <div>
          {isVideoOpen && (
            <Rnd
              default={{
                x: -450,
                y: 50,
                width: 450,
                height: 400,
              }}
              minWidth={300}
              minHeight={300}
              bounds="window"
              className={`bg-white flex flex-col shadow-xl rounded-lg border border-gray-300 overflow-hidden ${isMinimized ? 'hidden' : 'block'}`}
              style={isMinimized ? { display: 'none' } : {}}
            >
              <div className="flex justify-between items-center bg-gradient-to-r from-sky-700 to-teal-600 text-white p-3 rounded-t-lg">
                <h3 className="text-sm font-semibold">Telehealth</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={minimizeVideoWindow}
                    className="hover:bg-teal-700 p-1 rounded transition-colors"
                  >
                    <AiOutlineMinus />
                  </button>
                  <button
                    onClick={closeVideoWindow}
                    className="hover:bg-teal-700 p-1 rounded transition-colors"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
              <div className="flex-grow h-full">
                <iframe
                  allow="camera *; microphone *; autoplay *; hid *"
                  src="https://staging.d3a4qz8nwtp30p.amplifyapp.com/"
                  className="w-full h-full"
                  title="Video Call"
                />
              </div>
            </Rnd>
          )}

          {/* Minimized Dock */}
          {isMinimized && (
            <button
              onClick={toggleVideoWindow}
              className="fixed bottom-10 right-6 bg-gradient-to-r from-sky-700 to-teal-600 text-white p-3 rounded-full shadow-lg hover:from-sky-800 hover:to-teal-700 transition-colors"
            >
              <IoIosVideocam className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDesk1;

function setUniqueKey(uniqueKey: any) {
  throw new Error('Function not implemented.');
}
