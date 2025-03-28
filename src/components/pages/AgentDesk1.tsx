import React, { useState, useEffect } from 'react';
import { ImCircleDown, ImCircleUp } from "react-icons/im";
import { RiWifiOffLine } from "react-icons/ri";
import { MdOutlineVerifiedUser, MdOutlineSms, MdOutlineMail, MdEdit } from "react-icons/md";
// import { CiSearch } from "react-icons/ci";
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

  const renderNameField = () => (
    <div className='flex items-center space-x-2'>

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
          <span className='text-lg text-white font-semibold'>
            {isLoading ? 'Loading...' : callerData1?.Name || 'Unknown'}
          </span>
          <button
            onClick={handleEditClick}
            className='text-xs text-black hover:text-black'
          >
            <MdEdit />
          </button>
        </div>
      )}
    </div>
  );

  const toggleVideoWindow = () => {
    if (isMinimized) {
      setIsMinimized(false); // Reopen the minimized window
    } else {
      setIsVideoOpen(!isVideoOpen); // Toggle the video window
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
    setIsCareCoNotesCollapsed(!isCareCoNotesCollapsed);
  };
  const toggleCRMedicalNotes = () => {
    setIsContactRecNotesCollapsed(!isContactRecNotesCollapsed);
  };

  return (
    <div className="flex ml-2 bg-gray-100 flex-col h-full">


      <div className="flex flex-1">


        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Patient Infnormation */}
          <div className="m-0">
            <div className="flex ml-4 mb-4 h-auto shadow-sm bg-gray-400">

              <div className="w-2/5  bg-white">

                <div className="flex justify-between bg-gray-200 border-gray-400 border-b border-t">
                  <div className="text-[12px] font-semibold items-center justify-center py-1 px-1 text-blue-600">
                    <p>{callerData1?.TicketNumber || '---'}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText('TK-2024-001')}
                      className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                    >
                      <IoMdCopy className='w-4 h-4 text-gray-400 hover:text-blue-500' />
                    </button>
                  </div>
                  <div className="text-[12px] font-semibold py-1 px-1 text-gray-800">{callerData1?.TicketCreatedAt || '--'}</div>
                </div>


                <div className="flex bg-gradient-to-r justify-center from-sky-700 to-teal-600 px-2 py-5 border-gray-100 items-center mb-1">
                  <h4 className="bg-gray-200  w-12 h-12 rounded-full flex items-center justify-center">JD</h4>

                  <div className="ml-4 flex-grow">
                    <h2 className="text-lg text-white font-semibold">{renderNameField()}</h2>
                    <p className="text-[12px] text-gray-300">{callState.callerId}</p>
                  </div>
                  <button title='SMS' className="p-2 mx-1 border-1 border-teal-800 rounded-lg hover:bg-teal-200">
                    <MdOutlineSms className='w-5 h-5 text-teal-900' />
                  </button>
                  <button title='Email' className="p-2 mx-1 border-1 border-teal-800 rounded-lg hover:bg-teal-200">
                    <MdOutlineMail className='w-5 h-5 text-teal-900' />
                  </button>
                  <button title='TeleHealth' onClick={toggleVideoWindow} className={`p-2 mx-1 border-1 border-teal-800 rounded-lg ${isVideoOpen ? 'bg-teal-200' : ''} hover:bg-teal-200`}>
                    {isVideoOpen ? <FiVideo className='w-5 h-5 text-teal-900' /> : <FiVideoOff className='w-5 h-5 text-teal-900' />}
                  </button>
                  {/* <div className="flex space-x-2">
                    
                  </div> */}
                </div>


                <div className='p-2'>
                  <div className='flex justify-between'>
                    <h3 className="text-sm font-medium mb-2">Customer Information</h3>
                    <div className='flex flex-row justify-between items-center px-2'>

                      <div className="relative border-1 ml-3 w-50 justify-between items-center rounded-sm flex mb-1 ">
                        <input
                          type="text"
                          placeholder="Search family members..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className='w-full text-xs rounded-md px-8 py-1.5'
                        // className=" px-2 text-xs py-1"
                        />
                        {/* <input type="text" className=" px-2 text-xs py-1" placeholder="Patient Lookup..." /> */}
                        {/* <CiSearch className='' /> */}
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
                  <div className='flex justify-between'>
                    {selectedMember ? (
                      <div className="flex flex-col w-1/2">
                        <div className="flex p-1 flex-row text-[12px]">
                          <p className=" font-semibold">Patient Name :</p>
                          <p className='px-1 text-gray-700'>{selectedMember.name}</p>
                        </div>
                        <div className="flex p-1 flex-row text-[12px]">
                          <p className=" font-semibold">Relationship :</p>
                          <p className='px-1 text-gray-700'>{selectedMember.relationship}</p>
                        </div>
                        <div className=" flex p-1 flex-row text-[12px]">
                          <p className=" font-semibold">DOB :</p>
                          <p className='px-1 text-gray-700'>{selectedMember.DOB}</p>
                        </div>
                        <div className="flex p-1 flex-row text-[12px]">
                          <p className=" font-semibold">Age :</p>
                          <p className='px-1 text-gray-700'>{selectedMember.Age}</p>
                        </div>
                        <div className="flex p-1 flex-row text-[12px]">
                          <p className=" font-semibold">Address :</p>
                          <p className='px-1 text-gray-700'>{selectedMember.Address}</p>
                        </div>
                        <div className="flex p-1 flex-row text-[12px] items-center">
                          <p className="font-semibold">DOD ID :</p>
                          <p className="px-1 text-gray-700">
                            {isDODVisible ? (selectedMember.DOD_ID) : "***************"}
                          </p>
                          <button
                            onClick={toggleDODVisibility}
                            className="ml-2 text-gray-700 hover:text-gray-700"
                          >
                            {isDODVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </button>
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
                      {callState1.isCallActive ?
                        (
                          <MdOutlineVerifiedUser className='w-6 h-6 text-green-600' />)
                        : (
                          <></>
                        )}

                      <button disabled className=" text-gray-500 flex w-50 items-center justify-center gap-2  h-fit text-xs px-4 py-1 border-1 rounded"><RiWifiOffLine />  Offline Verification</button>
                    </div>
                  </div>
                </div>
              </div>


              <div className="w-3/5 bg-white ml-0.25 pl-2 border-gray-400 border-t">
                <div className="border-b border-gray-400 mb-2">
                  <nav className="flex space-x-8">
                    <button
                      className={`py-1 px-1 text-[12px] font-medium ${activeTab === 'DEERS' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      onClick={() => setActiveTab('DEERS')}
                    >
                      DEERS
                    </button>
                    <button
                      className={`py-1 px-1 text-[12px] font-medium ${activeTab === 'MedicalHistory' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      onClick={() => setActiveTab('MedicalHistory')}
                    >
                      Medical History
                    </button>
                  </nav>
                </div>

                {/* DEERS Tab Content */}
                {activeTab === 'DEERS' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div className="text-[12px]">
                        <p className="font-semibold">Primary</p>
                        <p className="text-gray-600">John Doe</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">DOB</p>
                        <p className="text-gray-600">12/05/1991</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Assignment</p>
                        <p className="text-gray-600">Fort Belvoir</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Category</p>
                        <p className="text-gray-600">33</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Restrictions</p>
                        <p className="text-gray-600">N/A</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">DOD ID</p>
                        <p className="text-gray-600">N/A</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Beneficiary First Name</p>
                        <p className="text-gray-600">John</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">PCM Clinic Name</p>
                        <p className="text-gray-600">Dumfries Health Center</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Dependents</p>
                        <p className="text-gray-600">
                          Mary Doe (Spouse) <br /> Liam Doe (Child)
                        </p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Beneficiary Last Name</p>
                        <p className="text-gray-600">Doe</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">PCM Name</p>
                        <p className="text-gray-600">Dr. Selwyn Adams, MD</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Branch Of Service</p>
                        <p className="text-gray-600">Marine Army</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Benefit Type</p>
                        <p className="text-gray-600">TRICARE Prime</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Middle Initial</p>
                        <p className="text-gray-600">A</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Military Duty Status</p>
                        <p className="text-gray-600">Active (On Duty)</p>
                      </div>
                      <div className="text-[12px]">
                        <p className="font-semibold">Enrollment Location</p>
                        <p className="text-gray-600">Virginia</p>
                      </div>
                    </div>
                    <div className="flex justify-end px-2 ">
                      <button className="text-black text-xs border-1 px-6 py-0.5 mb-1 rounded">Save to Ticket</button>
                    </div>
                  </div>
                )}

                {/* Medical History Tab Content */}
                {activeTab === 'MedicalHistory' && (
                  <div className="space-y-4 p-4">
                    <div className="text-[12px]">
                      <p className="font-semibold">Active Conditions</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>
                          Victim of intimate partner abuse (finding) - Diagnosed on 2022-02-18
                        </li>
                        <li>
                          Unhealthy alcohol drinking behavior (finding) - Diagnosed on 2019-02-15
                        </li>
                        <li>
                          Body mass index 30+ - obesity (finding) - Diagnosed on 2016-02-12
                        </li>
                        <li>
                          Social isolation (finding) - Diagnosed on 2007-02-02
                        </li>
                      </ul>
                    </div>
                    <div className="text-[12px]">
                      <p className="font-semibold">Other Conditions</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Facial laceration - Resolved (2020)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>


          {/* Middle Section */}
          <section className="flex h-auto  ml-4 mb-4">

            {/* Left Side - Case, Medical, CareC, Record section */}
            <div className='flex-col w-4/7'>
              {/* Case Information */}
              <div className=' bg-white rounded  shadow p-2 mb-2'>
                <div className="flex justify-between  items-center mb-1">
                  <h3 className="text-md font-bold ">Case Information</h3>
                  <div className="flex bg-gray-100 space-x-4">
                    <button className="py-1 px-2 text-xs font-medium text-gray-700 hover:text-gray-900 border-b-2 hover:border-b-2">Split</button>
                    <button className="py-1 px-2 text-xs font-medium text-gray-700 hover:text-gray-900">Clones</button>
                    <button className="py-1 px-2 text-xs font-medium text-gray-700 hover:text-gray-900">Follow Up</button>
                    <button className="py-1 px-2 text-xs font-medium text-gray-700 hover:text-gray-900">Escalate</button>
                    <button className="py-1 px-2 text-xs font-medium text-gray-700 hover:text-gray-900">Transfer</button>
                    <button className="py-1 px-2 text-xs font-medium text-gray-700 hover:text-gray-900">Close</button>
                  </div>
                </div>
                <div className="flex mb-3 justify-start items-center">
                  <label className="block text-sm font-semibold text-gray-800">Case Status:</label>
                  <select className="m-1 block w-auto pl-2 pr-7 py-1 text-[12px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-sm">
                    <option className='text-[12px]'>Active</option>
                    <option className='text-[12px]'>Closed</option>
                    <option className='text-[12px]'>Pending</option>
                  </select>
                </div>
                <hr className="mb-3 text-gray-200" />
                <div className="grid grid-cols-4 gap-4 mb-5 ml-3">
                  <div className="text-[12px]">
                    <p className=" font-semibold">Case Number</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>039A830D0291</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Case OpenAt</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>03-12-2025</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Best Callback Number</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>+1 773-832-9281</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Case Owner</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>Robert D.</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Care Coordinator</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>Sarah Martinez</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Channel</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>-</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Contact City</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>CONUS</p>
                  </div>
                  <div className="text-[12px]">
                    <p className=" font-semibold">Contact State</p>
                    <p className='text-gray-500 bg-gray-100 w-28 px-2 py-1 rounded-sm'>Virginia</p>
                  </div>
                </div>
                <hr className="my-5 text-gray-200" />
                <div className="mb-4 flex items-center">
                  <label className="block mx-2 text-sm font-semibold text-gray-700">Contact Reason:</label>
                  <select className=" block w-fit pl-3 pr-10 py-1 text-[12px] border-gray-300 focus:outline-none bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 sm:text-[12px] rounded-md">
                    <option className='text-[12px]'>Prescription update request</option>
                    <option className='text-[12px]'>Appointment scheduling</option>
                    <option className='text-[12px]'>General inquiry</option>
                  </select>
                </div>
                {/* <div className="mb-2 ml-4">
                  <label className="block text-[12px] font-medium text-gray-700">Reason for call:</label>
                  <textarea className="mt-1 p-1 block w-full border border-gray-200 rounded-md focus:ring-indigo-200 focus:border-indigo-200 sm:text-[12px]" rows={3}>
                    Primary health care requested prescription update. Unable to find pharmacy that carries medication.
                  </textarea>
                </div> */}
                <div className="mb-2 ml-4">
                  <label className="block text-[12px] font-medium text-gray-700">Contact Summary:</label>
                  <textarea className="mt-1 p-1 block w-full border border-gray-200 rounded-md focus:ring-indigo-200 focus:border-indigo-200 sm:text-[12px]" rows={5}></textarea>
                </div>
              </div>



              {/* Case Data Section */}
              <section className="bg-white rounded shadow p-4 mb-4">
                <h3 className="text-md font-bold mb-4">Case Data</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Categorization */}
                  <div className="text-[12px]">
                    <p className="font-semibold mb-1">Categorization</p>
                    <div className="flex flex-col">
                      <p className="text-gray-800 bg-gray-100 px-2 py-1 rounded-sm">Yes</p>
                      <select className="mt-1 block w-full pl-3 pr-10 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md">
                        <option className='text-xs'>Asymptomatic</option>
                        <option className='text-xs'>Symptomatic</option>
                      </select>
                    </div>
                  </div>

                  {/* Travelling */}
                  <div className="text-[12px]">
                    <p className="font-semibold mb-1">Travelling</p>
                    <div className="flex flex-col">
                      <p className="text-gray-800 bg-gray-100 px-2 py-1 rounded-sm">No</p>
                      <select className="mt-1 block w-full pl-3 pr-10 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md">
                        <option className='text-xs'>Option 1</option>
                        <option className='text-xs'>Option 2</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Duty */}
                  <div className="text-[12px]">
                    <p className="font-semibold mb-1">Active Duty</p>
                    <div className="flex flex-col">
                      <p className="text-gray-800 bg-gray-100 px-2 py-1 rounded-sm">Yes</p>
                      <select className="mt-1 block w-full pl-3 pr-10 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md">
                        <option className='text-xs'>Option 1</option>
                        <option className='text-xs'>Option 2</option>
                      </select>
                    </div>
                  </div>

                  {/* Pre-intent */}
                  <div className="text-[12px] mt-4">
                    <p className="font-semibold mb-1">Pre-intent</p>
                    <select className="block w-full pl-3 pr-10 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md">
                      <option className='text-xs'>Option 1</option>
                      <option className='text-xs'>Option 2</option>
                    </select>
                  </div>

                  {/* High Risk */}
                  <div className="text-[12px] mt-4">
                    <p className="font-semibold mb-1">High Risk</p>
                    <select className="block w-full pl-3 pr-10 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md">
                      <option className='text-xs'>Option 1</option>
                      <option className='text-xs'>Option 2</option>
                    </select>
                  </div>
                </div>
              </section>

            </div>


            {/* Nurse's Toolkit */}
            <div className="w-3/7 ml-2 mb-4 bg-white flex flex-col rounded shadow h-auto">
              <div className="flex-col p-2">
                <h3 className="text-md font-bold">Nurse's Toolkit</h3>
              </div>
              <div className="flex-grow">
                <iframe
                  src="https://app.cleartriage.com/app/login"
                  className="w-full h-full"
                  style={{
                    border: 'none',
                    borderRadius: '4px',
                  }}
                  title="Clear Triage"
                />
              </div>
            </div>
            {/* <div className="w-3/7 mx-2 mb-4 bg-gray-300">
              <div className="flex-col p-2">
                <h3 className="text-md font-bold">Nurse's Toolkit</h3>
              </div>
              <iframe
                src="https://app.cleartriage.com/app/login"
                className='w-full h-full'
                // style={{
                //   width: '100%',
                //    height: '',
                //   border: 'none',
                //   borderRadius: '4px',
                //   boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                // }}
                title="Clear Triage"
              />

            </div> */}

          </section>


          {/* Medical Notes Section */}
          <section className="bg-white rounded shadow p-2 ml-4 mb-4">


            <div className='flex '>
              <div className='flex-col mr-3 w-4/7'>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-md font-bold cursor-pointer" onClick={toggleMedicalNotes}>Medical Notes</h3>
                  <div className="flex space-x-4">
                    <button className="py-1 px-2 mx-3 text-xs border-1 rounded-sm border-gray-800 font-medium text-gray-500 hover:text-gray-700">Generate Medical Notes</button>
                  </div>
                </div>
                <div className='flex justify-start items-start'>
                  <div className="flex-col w-1/2 mr-6 mb-1 justify-start items-center">
                    <label className="block text-xs font-medium text-gray-700">Nurse Disposition:</label>
                    <select className="m-1 block w-auto pl-2 pr-7 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-sm">
                      <option className='text-[10px]'>Disposition 1</option>
                      <option className='text-[10px]'>Disposition 2</option>
                      <option className='text-[10px]'>Disposition 3</option>
                    </select>
                  </div>
                  <div className="flex-col w-1/2 mb-1 justify-start items-center">
                    <label className="block text-xs font-medium text-gray-700">System Disposition:</label>
                    <select className="m-1 block w-auto pl-2 pr-7 py-1 text-[10px] border-gray-300 bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-sm">
                      <option className='text-[10px]'>Sys Disposition 1</option>
                      <option className='text-[10px]'>Sys Disposition 2</option>
                      <option className='text-[10px]'>Sys Disposition 3</option>
                    </select>
                  </div>
                </div>
                <div className="mb-2 ml-4">
                  <label className="block text-[12px] font-medium text-gray-700">Justification</label>
                  <textarea className="mt-1 p-1 block w-full border border-gray-200 rounded-md focus:ring-indigo-200 focus:border-indigo-200 sm:text-[12px]" rows={3}></textarea>
                </div>
                <div className="mb-2 ml-4">
                  <label className="block text-[12px] font-medium text-gray-700">Notes</label>
                  <textarea className="mt-1 p-1 block w-full border border-gray-200 rounded-md focus:ring-indigo-200 focus:border-indigo-200 sm:text-[12px]" rows={3}></textarea>
                </div>
              </div>
              <div className='w-3/7 mt-7'>
                {/* box with medical selected items inside */}
                <div className="flex h-full ml-2 flex-col border-2 rounded-sm  border-gray-300 p-2">

                  <div className="flex p-0.5 flex-row text-[12px] items-center">
                    <p className="text-gray-500 flex-grow">Abdominal Pain - Upper</p>
                    <button className="text-red-500 hover:text-red-700">
                    </button>
                  </div>
                  <div className="flex p-0.5 flex-row text-[12px] items-center">
                    <p className="text-gray-500 flex-grow">Abdomen Bloating</p>
                    <button className="text-red-500 hover:text-red-700">
                    </button>
                  </div>
                  <div className="flex p-0.5 flex-row text-[12px] items-center">
                    <p className="text-gray-500 flex-grow">Diabetic - Male</p>
                    <button className="text-red-500 hover:text-red-700">
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </section>



          {/* Care Coordinator Notes*/}
          <section className="bg-white rounded shadow p-2 ml-4 mb-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-md font-bold cursor-pointer" onClick={toggleCCicalNotes}>Care-Coordinator Notes</h3>
              <div className="flex space-x-4">

                {/* button to collapse the section */}
                <button onClick={toggleCCicalNotes} className="">{!isCareCoNotesCollapsed ? <ImCircleDown /> : <ImCircleUp />}</button>
              </div>
            </div>
            {isCareCoNotesCollapsed && (
              <div className='block w-full'>
                <div className="mb-2">
                  <textarea placeholder='Type Care Coordinator Notes...' className="mt-1 p-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-[12px]" rows={3}></textarea>
                </div>
              </div>
            )}
          </section>


          {/* Contact records and Files */}
          <section className="bg-white rounded shadow p-2 ml-4 mb-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-md font-bold cursor-pointer" onClick={toggleCRMedicalNotes}>Contact Records & Files</h3>
              <div className="flex space-x-4">

                {/* button to collapse the section */}
                <button onClick={toggleCRMedicalNotes} className="">{!isContactRecNotesCollapsed ? <ImCircleDown /> : <ImCircleUp />}</button>
              </div>
            </div>
            {isContactRecNotesCollapsed && (
              <div className='block w-full'>
                <div className="mb-2">
                  <textarea placeholder='Type Contact Records...' className="mt-1 p-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-[12px]" rows={3}></textarea>
                </div>
              </div>
            )}
          </section>


        </main >


        {/* Video Call Section */}
        <div>
          {/* Fixed Icon to Open Video Call */}
          {/* <button
            onClick={toggleVideoWindow}
            className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
          >
            <AiOutlineVideoCamera className="w-6 h-6" />
          </button> */}

          {/* Floating Video Call Window */}
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
              className={`bg-white flex flex-col  shadow-2xl rounded-lg border-1 border-gray-600 ${isMinimized ? 'hidden' : 'block'
                }`} // Properly hide the window when minimized
              style={isMinimized ? { display: 'none' } : {}}
            >
              <div className="flex  justify-between items-center bg-teal-800 text-white p-2 rounded-t-lg">
                <h3 className="text-sm font-semibold">Telehealth</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={minimizeVideoWindow}
                    className="hover:bg-blue-700 p-1 rounded"
                  >
                    <AiOutlineMinus />
                  </button>
                  <button
                    onClick={closeVideoWindow}
                    className="hover:bg-blue-700 p-1 rounded"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
              <div className="flex-grow h-full">
                {/* Video Application Iframe */}
                <iframe
                  //ref={iframeRef}
                  allow="camera *; microphone *; autoplay *; hid *"
                  src="https://staging.d3a4qz8nwtp30p.amplifyapp.com/"
                  className="w-full h-full"
                  //style={{ border: 'none' }}
                  title="Video Call"
                />
              </div>
            </Rnd>
          )}

          {/* Minimized Dock */}
          {isMinimized && (
            <button
              onClick={toggleVideoWindow}
              className="fixed bottom-7 right-4 bg-teal-700 text-white p-2 rounded-full shadow-lg hover:bg-teal-900"
            >
              <IoIosVideocam className="w-6 h-6" />
            </button>
          )}
        </div>


      </div >


    </div >
  );
};

export default AgentDesk1;