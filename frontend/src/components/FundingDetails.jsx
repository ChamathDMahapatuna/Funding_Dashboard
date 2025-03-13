import { useState, useEffect } from 'react';
import { ArrowLeftIcon, CalendarIcon, BuildingOfficeIcon, CurrencyDollarIcon, UserGroupIcon, MapPinIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function FundingDetails() {
  const { id } = useParams();
  const [fundingData, setFundingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchFundingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/fundings/${id}`);
        console.log('Funding details:',id); 
        print(console.log("Received ID:", req.params.id));
        setFundingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching funding details:', err);
        setError('Failed to fetch funding details. Please try again later.');
        setLoading(false);
      }
    };

    fetchFundingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading funding details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!fundingData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No funding data found for this ID.</span>
      </div>
    );
  }

  // Helper function to format funding amounts
  const formatFunding = (amount) => {
    return amount ? amount : 'N/A';
  };

  // Calculate total known funding amount
  const calculateTotalFunding = () => {
    const fundingRounds = [
      fundingData['Pre-Seed $'],
      fundingData['Seed $'],
      fundingData['Bridge $'],
      fundingData['A Round $'],
      fundingData['B Round $'],
      fundingData['C Round $'],
      fundingData['D Round $'],
      fundingData['E Round $'],
      fundingData['F Round $'],
      fundingData['G Round $'],
      fundingData['H Round $'],
      fundingData['Unknown Series $'],
      fundingData['Non-Dilutive Round $']
    ];

    return fundingData['Total Funding'] || 'N/A';
  };

  // Get all funding rounds in chronological order
  const getFundingRoundsChronological = () => {
    const rounds = [
      { name: 'Pre-Seed', date: fundingData['Pre-Seed Date'], amount: fundingData['Pre-Seed $'] },
      { name: 'Seed', date: fundingData['Seed Date'], amount: fundingData['Seed $'] },
      { name: 'Bridge', date: fundingData['Bridge Date'], amount: fundingData['Bridge $'] },
      { name: 'Series A', date: fundingData['A Round Date'], amount: fundingData['A Round $'] },
      { name: 'Series B', date: fundingData['B Round Date'], amount: fundingData['B Round $'] },
      { name: 'Series C', date: fundingData['C Round Date'], amount: fundingData['C Round $'] },
      { name: 'Series D', date: fundingData['D Round Date'], amount: fundingData['D Round $'] },
      { name: 'Series E', date: fundingData['E Round Date'], amount: fundingData['E Round $'] },
      { name: 'Series F', date: fundingData['F Round Date'], amount: fundingData['F Round $'] },
      { name: 'Series G', date: fundingData['G Round Date'], amount: fundingData['G Round $'] },
      { name: 'Series H', date: fundingData['H Round Date'], amount: fundingData['H Round $'] },
      { name: 'Unknown Series', date: fundingData['Unknown Series Date'], amount: fundingData['Unknown Series $'] },
      { name: 'Non-Dilutive', date: fundingData['Non-Dilutive Round Date'], amount: fundingData['Non-Dilutive Round $'] },
      { name: 'Exit', date: fundingData['Exit Date'], amount: fundingData['Exit $'] }
    ]
    .filter(round => round.date && round.amount)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

    return rounds;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/advanced-search" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Search Results
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fundingData.Name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{fundingData.Technology}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Total Funding</p>
            <p className="text-xl font-bold text-gray-900">{formatFunding(fundingData['Total Funding'])}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`${
              activeTab === 'funding'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
          >
            Funding History
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`${
              activeTab === 'metrics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
          >
            Metrics & Valuation
          </button>
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Company Information</h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData.Name}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Technology/Industry</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData.Technology || 'N/A'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['Prop Type'] || 'N/A'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Founded</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData.Founded || 'N/A'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Years Active</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['Years Active'] || 'N/A'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Number of Founders</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['# Founders'] || 'N/A'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {fundingData.Domain ? (
                        <a href={`https://${fundingData.Domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {fundingData.Domain}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Location</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <address className="not-italic text-sm text-gray-500">
                    {fundingData['HQ Address'] ? `${fundingData['HQ Address']}, ` : ''}
                    {fundingData.City ? `${fundingData.City}, ` : ''}
                    {fundingData.State ? `${fundingData.State} ` : ''}
                    {fundingData.Zip ? fundingData.Zip : ''}
                    {!fundingData['HQ Address'] && !fundingData.City && !fundingData.State && !fundingData.Zip && 'N/A'}
                  </address>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Accelerators</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {fundingData.Accelerator && (
                    <li className="py-2">{fundingData.Accelerator}</li>
                  )}
                  {fundingData['Accelerator 2'] && (
                    <li className="py-2">{fundingData['Accelerator 2']}</li>
                  )}
                  {!fundingData.Accelerator && !fundingData['Accelerator 2'] && (
                    <li className="py-2 text-gray-500">None</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Links</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <ul className="space-y-3">
                  {fundingData.AngelList && (
                    <li>
                      <a href={fundingData.AngelList} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                        <span className="mr-2">AngelList Profile</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  )}
                  {fundingData.Crunchbase && (
                    <li>
                      <a href={fundingData.Crunchbase} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                        <span className="mr-2">Crunchbase Profile</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  )}
                  {!fundingData.AngelList && !fundingData.Crunchbase && (
                    <li className="text-gray-500">No external links available</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funding History Tab Content */}
      {activeTab === 'funding' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Funding Rounds</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Total Funding: {formatFunding(fundingData['Total Funding'])} across {fundingData['# of Funding Rounds'] || '0'} rounds
            </p>
          </div>
          <div className="border-t border-gray-200">
            {getFundingRoundsChronological().length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Round
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFundingRoundsChronological().map((round, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {round.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(round.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {round.amount}
                        </td>
                      </tr>
                    ))}
                    {fundingData['Exit Date'] && fundingData['Exit $'] && (
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                          Exit{fundingData.Acquirer ? ` (${fundingData.Acquirer})` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                          {new Date(fundingData['Exit Date']).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 font-medium">
                          {fundingData['Exit $']}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-4 text-sm text-gray-500">
                No funding rounds information available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metrics & Valuation Tab Content */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Valuation & Metrics</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Latest Valuation</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['Latest Valuation'] || 'N/A'}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Valuation Year</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['Latest Valuation Year'] || 'N/A'}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Estimated ARR</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['Estimated ARR'] || 'N/A'}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ARR/Funds Raised</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['ARR/Funds Raised'] || 'N/A'}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Avg Funding/Year</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData.Avg?.[' Funding/Year'] || 'N/A'}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">CAFR</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData.CAFR || 'N/A'}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">CFRGR</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fundingData['CFRGR (Compound Funding Round Growth Rate)'] || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Rankings</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Valuation Rank</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {fundingData['Valuation Rank'] ? `#${fundingData['Valuation Rank']}` : 'N/A'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Funding/Year Rank</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {fundingData['Funding/Year Rank'] ? `#${fundingData['Funding/Year Rank']}` : 'N/A'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Funding Rank</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {fundingData['Total Funding Rank'] ? `#${fundingData['Total Funding Rank']}` : 'N/A'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ARR Rank</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {fundingData['ARR Rank'] ? `#${fundingData['ARR Rank']}` : 'N/A'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">CAFR Rank</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {fundingData['CAFR Rank'] ? `#${fundingData['CAFR Rank']}` : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FundingDetails;