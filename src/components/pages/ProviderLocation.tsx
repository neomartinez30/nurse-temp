import { useState } from 'react';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { AiOutlineCalendar, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai';
import { BsHospital, BsPersonBadge, BsTranslate } from 'react-icons/bs';
import { MdOutlineVerifiedUser, MdOutlineStickyNote2 } from 'react-icons/md';
import { FaRegHospital, FaMapMarkerAlt } from 'react-icons/fa';
import { ImCircleDown, ImCircleUp } from "react-icons/im";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  address: string;
  zip: string;
  availableTimes: string[];
  phone: string;
  education: string;
  languages: string;
  insurance: string[];
  experience: string;
}

const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Dumfries Health Center',
    specialty: 'Cardiology',
    address: '3700 Fettler Park Dr, Dumfries, VA 22025',
    zip: '91764',
    availableTimes: [
      'Tomorrow 2:00 PM',
      'Tomorrow 3:30 PM',
      'Friday 9:00 AM',
      'Friday 11:30 AM',
      'Monday 10:00 AM'
    ],
    phone: '(703) 441-7500',
    education: 'Harvard Medical School',
    languages: 'English, Spanish',
    insurance: ['Blue Cross', 'Aetna', 'United Healthcare'],
    experience: '15 years'
  },
  {
    id: '2',
    name: 'William Beaumont Army Medical Center',
    specialty: 'Orthopedics',
    address: '18511 Highlander Medics St, Fort Bliss, TX 79906',
    zip: '41578',
    availableTimes: [
      'Monday 9:00 AM',
      'Monday 2:30 PM',
      'Wednesday 10:00 AM',
      'Wednesday 1:30 PM',
      'Friday 11:00 AM'
    ],
    phone: '(915) 742-7777',
    education: 'Yale School of Medicine',
    languages: 'English',
    insurance: ['Blue Cross', 'Medicare', 'Cigna'],
    experience: '20 years'
  },
  {
    id: '3',
    name: 'NBHC NTC San Diego',
    specialty: 'Pediatrics',
    address: '2051 Cushing Rd. San Diego, CA 92106',
    zip: '20003',
    availableTimes: [
      'Friday 10:00 AM',
      'Friday 2:30 PM',
      'Monday 9:00 AM',
      'Monday 3:30 PM',
      'Tuesday 11:00 AM'
    ],
    phone: '(619) 532-8225',
    education: 'Stanford Medical School',
    languages: 'English, French',
    insurance: ['Aetna', 'United Healthcare', 'Humana'],
    experience: '8 years'
  },
  {
    id: '4',
    name: 'Womack Family Medicine Residency Clinic',
    specialty: 'Orthopedics',
    address: 'First Floor, Clinic Mall 2817 Rock Merritt Ave. Fort Bragg, NC 28310',
    zip: '41578',
    availableTimes: [
      'Monday 9:00 AM',
      'Monday 2:30 PM',
      'Wednesday 10:00 AM',
      'Wednesday 1:30 PM',
      'Friday 11:00 AM'
    ],
    phone: '910-907-8500',
    education: 'Yale School of Medicine',
    languages: 'English',
    insurance: ['Blue Cross', 'Medicare', 'Cigna'],
    experience: '20 years'
  },
  {
    id: '5',
    name: 'Wright-Patterson Medical Center',
    specialty: 'Dermatology',
    address: '4881 Sugar Maple Dr, Wright-Patterson AFB, OH 45433',
    zip: '20006',
    availableTimes: [
      'Thursday 3:00 PM',
      'Thursday 4:30 PM',
      'Friday 9:00 AM',
      'Friday 2:30 PM',
      'Monday 11:00 AM'
    ],
    phone: '(937) 522-2778',
    education: 'UCLA Medical School',
    languages: 'English, Korean',
    insurance: ['Blue Cross', 'Cigna', 'Kaiser'],
    experience: '14 years'
  },
  {
    id: '6',
    name: 'Andrew Rader Army Health Clinic',
    specialty: 'Internal Medicine',
    address: '401 Carpenter Rd, Arlington, VA 22204',
    zip: '20005',
    availableTimes: [
      'Wednesday 1:00 PM',
      'Wednesday 3:30 PM',
      'Thursday 9:00 AM',
      'Thursday 2:30 PM',
      'Friday 10:00 AM'
    ],
    phone: '(833) 853-1392',
    education: 'Columbia University',
    languages: 'English, Spanish, Portuguese',
    insurance: ['United Healthcare', 'Aetna', 'Humana'],
    experience: '10 years'
  }
];

export function ProviderLocation() {
  const [zipCode, setZipCode] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralReason, setReferralReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const filteredProviders = MOCK_PROVIDERS.filter((provider) => {
    const matchesZip = zipCode ? provider.zip.includes(zipCode) : true;
    const matchesSpecialty = specialty 
      ? provider.specialty.toLowerCase().includes(specialty.toLowerCase()) 
      : true;
    return matchesZip && matchesSpecialty;
  });

  const handleBookAppointment = () => {
    if (!selectedAppointment || !selectedProvider) return;
    
    // In a real app, you'd make an API call here to book the appointment
    alert(`Appointment booked for ${selectedAppointment} at ${selectedProvider.name}`);
    setSelectedAppointment(null);
  };

  const createReferral = () => {
    if (!selectedProvider || !referralReason.trim()) return;
    
    // In a real app, you'd make an API call here to create the referral
    alert(`Referral created for ${selectedProvider.name}`);
    setShowReferralModal(false);
    setReferralReason('');
    setAdditionalNotes('');
  };

  return (
    <div className="flex ml-2 bg-gray-50 flex-col h-full">
      <div className="flex flex-1">
        <main className="flex-1 p-4">
          {/* Header Section */}
          <div className="flex ml-4 mb-4 h-auto shadow-md rounded-lg overflow-hidden">
            <div className="w-full bg-white">
              <div className="flex bg-gradient-to-r from-sky-700 to-teal-600 px-4 py-4 items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                    <FaRegHospital className="text-gray-700 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-xl text-white font-semibold">Provider Locator</h1>
                    <p className="text-xs text-gray-200 mt-1">Find and book appointments with military healthcare providers</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white text-sm rounded shadow transition-colors flex items-center"
                    onClick={() => setIsMapCollapsed(!isMapCollapsed)}
                  >
                    <AiOutlineEnvironment className="mr-2" />
                    {isMapCollapsed ? 'Show Map' : 'Hide Map'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-4 ml-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 
                className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm cursor-pointer flex items-center"
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
              >
                SEARCH FILTERS
                {isFiltersCollapsed ? <ImCircleDown className="ml-2" /> : <ImCircleUp className="ml-2" />}
              </h3>
              <button 
                className="py-2 px-4 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded shadow transition-colors"
                onClick={() => {
                  setZipCode('');
                  setSpecialty('');
                }}
              >
                Reset Filters
              </button>
            </div>
            
            {!isFiltersCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">ZIP Code</p>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter ZIP code"
                    className="block w-full px-3 py-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm"
                  />
                </div>
                
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Specialty</p>
                  <select 
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="block w-full px-3 py-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm"
                  >
                    <option value="">All Specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                  </select>
                </div>
                
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Appointment Type</p>
                  <select className="block w-full px-3 py-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                    <option value="">All Types</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Telehealth">Telehealth</option>
                  </select>
                </div>
                
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Insurance</p>
                  <select className="block w-full px-3 py-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                    <option value="">All Insurance</option>
                    <option value="TRICARE Prime">TRICARE Prime</option>
                    <option value="TRICARE Select">TRICARE Select</option>
                    <option value="TRICARE For Life">TRICARE For Life</option>
                  </select>
                </div>
                
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Distance</p>
                  <select className="block w-full px-3 py-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                  </select>
                </div>
                
                <div className="text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Availability</p>
                  <select className="block w-full px-3 py-2 border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded shadow-sm">
                    <option value="">Any Time</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This Week">This Week</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Section (Conditionally Displayed) */}
          {!isMapCollapsed && (
            <div className="bg-white rounded-lg shadow-md p-4 ml-4 mb-4 h-96">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaMapMarkerAlt className="mx-auto text-4xl mb-2 text-teal-600" />
                  <p>Interactive map would be displayed here.</p>
                  <p className="text-xs mt-1">This is a placeholder for a Google Maps or similar integration.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Section */}
          <div className="flex ml-4 mb-4">
            <div className="w-full md:w-2/3 pr-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm mb-4">
                  SEARCH RESULTS ({filteredProviders.length})
                </h3>
                
                {filteredProviders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProviders.map((provider) => (
                      <div 
                        key={provider.id}
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                          selectedProvider?.id === provider.id 
                            ? 'border-teal-500 bg-teal-50' 
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedProvider(provider)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{provider.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <BsPersonBadge className="mr-2 text-teal-600" />
                              {provider.specialty}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <AiOutlineEnvironment className="mr-2 text-teal-600" />
                              {provider.address}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <AiOutlinePhone className="mr-2 text-teal-600" />
                              {provider.phone}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mt-1">{provider.experience} experience</p>
                            <button
                              className="mt-4 text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center justify-end"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProvider(provider);
                              }}
                            >
                              View Details <IoMdArrowRoundForward className="ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BsHospital className="mx-auto text-4xl mb-3 text-gray-400" />
                    <p>No providers found matching your criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your filters or search in a different area.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Provider Detail Section */}
            <div className="hidden md:block md:w-1/3">
              {selectedProvider ? (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-bold text-gray-700 bg-gray-100 py-1 px-4 rounded-md shadow-sm mb-4">
                    PROVIDER DETAILS
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="bg-teal-100 rounded-full p-3 mr-4">
                      <BsHospital className="text-teal-700 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{selectedProvider.name}</h4>
                      <p className="text-sm text-gray-600">{selectedProvider.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <AiOutlineEnvironment className="text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{selectedProvider.address}</p>
                    </div>
                    <div className="flex items-center">
                      <AiOutlinePhone className="text-teal-600 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{selectedProvider.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <BsTranslate className="text-teal-600 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Languages: {selectedProvider.languages}</p>
                    </div>
                    <div className="flex items-center">
                      <MdOutlineVerifiedUser className="text-teal-600 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        Insurance: {selectedProvider.insurance.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <AiOutlineCalendar className="mr-2 text-teal-600" /> Available Appointments
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedProvider.availableTimes.map((time, index) => (
                        <button
                          key={index}
                          className={`text-left px-3 py-2 text-xs rounded transition-colors ${
                            selectedAppointment === time
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedAppointment(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded shadow text-sm transition-colors"
                      onClick={handleBookAppointment}
                      disabled={!selectedAppointment}
                    >
                      Book Appointment
                    </button>
                    <button
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded shadow text-sm transition-colors"
                      onClick={() => setShowReferralModal(true)}
                    >
                      Create Referral
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <BsHospital className="mx-auto text-4xl mb-3 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Provider Selected</h3>
                  <p className="text-sm text-gray-500">
                    Select a provider from the list to view their details and available appointments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
              <MdOutlineStickyNote2 className="mr-2 text-teal-600" />
              Create Referral
            </h3>
            
            {selectedProvider && (
              <div className="mb-4 bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">Provider: {selectedProvider.name}</p>
                <p className="text-sm text-gray-600">Specialty: {selectedProvider.specialty}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Referral*
              </label>
              <textarea
                value={referralReason}
                onChange={(e) => setReferralReason(e.target.value)}
                placeholder="Enter medical reason for this referral"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Enter any additional notes or instructions"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                onClick={() => setShowReferralModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm"
                onClick={createReferral}
                disabled={!referralReason.trim()}
              >
                Create Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}