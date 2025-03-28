import { useState } from 'react';

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
  rating: string;
  experience: string;
}

const MOCK_PROVIDERS: Provider[] = [
   
    {
        id: '1',
        name: ' Dumfries Health Center',
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
        rating: '4.8/5',
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
        rating: '4.6/5',
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
        rating: '4.7/5',
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
        rating: '4.6/5',
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
        rating: '4.8/5',
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
        phone: ' (833) 853-1392',
        education: 'Columbia University',
        languages: 'English, Spanish, Portuguese',
        insurance: ['United Healthcare', 'Aetna', 'Humana'],
        rating: '4.9/5',
        experience: '10 years'
    }
    
];

export function ProviderLocation() {
  const [zipCode, setZipCode] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralReason, setReferralReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const filteredProviders = MOCK_PROVIDERS.filter((provider) =>
    zipCode ? provider.zip.includes(zipCode) : true
  );

  return (
    <div className="p-6 ml-10 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Provider Locator</h2>
      </div>

      {/* ZIP Code Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by ZIP code
        </label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP code"
          className="w-64 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-lg shadow p-4 ${
                selectedProvider?.id === provider.id ? 'border-blue-500' : ''
              }`}
              onClick={() => setSelectedProvider(provider)}
            >
              <h3 className="text-lg font-bold text-gray-800">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.address}</p>
              <p className="text-sm text-gray-600">{provider.phone}</p>
              <button
                className="mt-2 text-blue-500 text-sm"
                onClick={() => setSelectedProvider(provider)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No providers found</div>
        )}
      </div>

      {/* Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Create Referral</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <input
                type="text"
                value={selectedProvider?.name || ''}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Referral
              </label>
              <textarea
                value={referralReason}
                onChange={(e) => setReferralReason(e.target.value)}
                placeholder="Enter reason for referral"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Enter any additional notes"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                onClick={() => setShowReferralModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => setShowReferralModal(false)}
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