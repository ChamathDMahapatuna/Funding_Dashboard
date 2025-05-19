// src/pages/AdvancedSearch.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  ArrowDownTrayIcon, 
  PlusIcon, 
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

function AdvancedSearch() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is admin, redirect to admin advanced search
    if (user && user.role === 'admin') {
      navigate('/admin/advanced-search');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('companies');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedCategories, setExpandedCategories] = useState({
    propType: false,
    valuation: false,
    totalFunding: false,
    yearRange: false,
  });

  const [checkboxStates, setCheckboxStates] = useState({
    all: false,
    residential: false,
    commercial: false,
    other: false,
    valuationRange: false,
    totalFunding: false,
    yearRange: false,
  });

  const [rangeValues, setRangeValues] = useState({
    valuationRange: [0, 100],
    totalFunding: [0, 100],
    yearRange: [2000, 2023],
  });

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailsButton, setShowDetailsButton] = useState(null);

  const handleCheckboxChange = (checkboxId) => {
    setCheckboxStates(prev => ({
      ...prev,
      [checkboxId]: !prev[checkboxId]
    }));
  };

  const handleRangeChange = (rangeId, values) => {
    setRangeValues(prev => ({
      ...prev,
      [rangeId]: values
    }));
  };

  const handleRowClick = (companyId) => {
    setShowDetailsButton(companyId);
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowDetailsButton(null);
  };

  const closeDetails = () => {
    setSelectedCompany(null);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/fundings');
        // Transform the data to match the expected format in your table
        const transformedData = response.data.map((item, index) => ({
          id: item._id || index,
          name: item.Name || 'N/A',
          propType: item['Prop Type'] || 'N/A',
          funding: item['Total Funding'] || 'N/A',
          valuation: item['Latest Valuation'] || 'N/A',
          founded: item.Founded?.toString() || 'N/A',
          rounds: item['# of Funding Rounds']?.toString() || 'N/A',
          location: `${item.City || ''}, ${item.State || ''}`.trim() || 'N/A',
          Technology: item.Technology || 'N/A',
          Domain: item.Domain || 'N/A',
          'HQ Address': item['HQ Address'] || 'N/A',
          AngelList: item.AngelList || 'N/A',
          Crunchbase: item.Crunchbase || 'N/A',
        }));
        setSearchResults(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const removeFilter = (filterId) => {
    setSelectedFilters(selectedFilters.filter(filter => filter.id !== filterId));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Apply search filter
  const filteredResults = searchResults.filter(item => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    if (activeTab === 'companies') {
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.propType.toLowerCase().includes(searchLower)
      );
    } else if (activeTab === 'location') {
      return item.location.toLowerCase().includes(searchLower);
    }
    return false;
  });

  // Handle filter application
  const applyFilters = () => {

    const newFilters = [];
    let filterId = 1;

    // Add Property Type filters
    if (checkboxStates.residential) {
      newFilters.push({
        id: filterId++,
        category: 'Property Type',
        value: 'Residential'
      });
    }
    if (checkboxStates.commercial) {
      newFilters.push({
        id: filterId++,
        category: 'Property Type',
        value: 'Commercial'
      });
    }
    if (checkboxStates.other) {
      newFilters.push({
        id: filterId++,
        category: 'Property Type',
        value: 'Other'
      });
    }
    setSelectedFilters(newFilters);
    // You can implement more complex filtering logic here based on selectedFilters
    console.log('Applying filters:', selectedFilters);
    console.log('Applying puka:', newFilters);
    
    // Example of how you might filter the data
    // This would be replaced with actual API calls with filter parameters
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would add query parameters to your API call
        // based on the selected filters
        const response = await axios.get('http://localhost:5000/api/fundings');
        // Then filter the results client-side based on selectedFilters
        const filteredData = response.data.filter(item => {
          // Example filter logic - adjust based on your actual filters
          let matchesFilters = true;
          
          selectedFilters.forEach(filter => {
            if (filter.category === 'Property Type' && filter.value === 'Residential') {
              matchesFilters = matchesFilters && item['Prop Type'] === 'Residential';
            }
            // Add more filter conditions as needed
          });
          
          return matchesFilters;
        }).map((item, index) => ({
          id: item._id || index,
          name: item.Name || 'N/A',
          propType: item['Prop Type'] || 'N/A',
          funding: item['Total Funding'] || 'N/A',
          valuation: item['Latest Valuation'] || 'N/A',
          founded: item.Founded?.toString() || 'N/A',
          rounds: item['# of Funding Rounds']?.toString() || 'N/A',
          location: `${item.City || ''}, ${item.State || ''}`.trim() || 'N/A'
        }));
        
        setSearchResults(filteredData);
        setLoading(false);
      } catch (err) {
        console.error('Error applying filters:', err);
        setError('Failed to apply filters. Please try again.');
        setLoading(false);
      }
    };
    
    // Call the function to apply filters
    fetchFilteredData();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters([]);
    // Re-fetch all data without filters
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/fundings');
        const transformedData = response.data.map((item, index) => ({
          id: item._id || index,
          name: item.Name || 'N/A',
          propType: item['Prop Type'] || 'N/A',
          funding: item['Total Funding'] || 'N/A',
          valuation: item['Latest Valuation'] || 'N/A',
          founded: item.Founded?.toString() || 'N/A',
          rounds: item['# of Funding Rounds']?.toString() || 'N/A',
          location: `${item.City || ''}, ${item.State || ''}`.trim() || 'N/A'
        }));
        setSearchResults(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAllData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Advanced Search</h1>
        <div className="flex space-x-3">
          <button 
            onClick={clearFilters}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'companies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'location' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('location')}
          >
            Location
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`Search by ${activeTab === 'companies' ? 'name or property type' : 'location'}`}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Property Type Filter */}
            <div className="relative">
              <button
                onClick={() => toggleCategory('propType')}
                className="text-sm font-medium text-gray-700 flex items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Property Type
                <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${expandedCategories.propType ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.propType && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <input id="all" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.all} onChange={() => handleCheckboxChange('all')} />
                      <label htmlFor="all" className="ml-2 text-sm text-gray-700">All</label>
                    </div>
                    <div className="flex items-center">
                      <input id="residential" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.residential} onChange={() => handleCheckboxChange('residential')} />
                      <label htmlFor="residential" className="ml-2 text-sm text-gray-700">Residential</label>
                    </div>
                    <div className="flex items-center">
                      <input id="commercial" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.commercial} onChange={() => handleCheckboxChange('commercial')} />
                      <label htmlFor="commercial" className="ml-2 text-sm text-gray-700">Commercial</label>
                    </div>
                    <div className="flex items-center">
                      <input id="other" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.other} onChange={() => handleCheckboxChange('other')} />
                      <label htmlFor="other" className="ml-2 text-sm text-gray-700">Other</label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Valuation Filter */}
            <div className="relative">
              <button
                onClick={() => toggleCategory('valuation')}
                className="text-sm font-medium text-gray-700 flex items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Valuation
                <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${expandedCategories.valuation ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.valuation && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <input id="valuationRange" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.valuationRange} onChange={() => handleCheckboxChange('valuationRange')} />
                      <label htmlFor="valuationRange" className="ml-2 text-sm text-gray-700">Valuation Range</label>
                    </div>
                    {checkboxStates.valuationRange && (
                      <div className="mt-2">
                        <input type="range" min="0" max="100" value={rangeValues.valuationRange[0]} onChange={(e) => handleRangeChange('valuationRange', [e.target.value, rangeValues.valuationRange[1]])} />
                        <input type="range" min="0" max="100" value={rangeValues.valuationRange[1]} onChange={(e) => handleRangeChange('valuationRange', [rangeValues.valuationRange[0], e.target.value])} />
                        <div className="text-sm text-gray-700">Range: {rangeValues.valuationRange[0]} - {rangeValues.valuationRange[1]}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Total Funding Filter */}
            <div className="relative">
              <button
                onClick={() => toggleCategory('totalFunding')}
                className="text-sm font-medium text-gray-700 flex items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Total Funding
                <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${expandedCategories.totalFunding ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.totalFunding && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <input id="totalFunding" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.totalFunding} onChange={() => handleCheckboxChange('totalFunding')} />
                      <label htmlFor="totalFunding" className="ml-2 text-sm text-gray-700">Total Funding</label>
                    </div>
                    {checkboxStates.totalFunding && (
                      <div className="mt-2">
                        <input type="range" min="0" max="100" value={rangeValues.totalFunding[0]} onChange={(e) => handleRangeChange('totalFunding', [e.target.value, rangeValues.totalFunding[1]])} />
                        <input type="range" min="0" max="100" value={rangeValues.totalFunding[1]} onChange={(e) => handleRangeChange('totalFunding', [rangeValues.totalFunding[0], e.target.value])} />
                        <div className="text-sm text-gray-700">Range: {rangeValues.totalFunding[0]} - {rangeValues.totalFunding[1]}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Year Range Filter */}
            <div className="relative">
              <button
                onClick={() => toggleCategory('yearRange')}
                className="text-sm font-medium text-gray-700 flex items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Year Range
                <ChevronDownIcon className={`h-4 w-4 ml-1 transform ${expandedCategories.yearRange ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.yearRange && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <input id="yearRange" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.yearRange} onChange={() => handleCheckboxChange('yearRange')} />
                      <label htmlFor="yearRange" className="ml-2 text-sm text-gray-700">Year Range</label>
                    </div>
                    {checkboxStates.yearRange && (
                      <div className="mt-2">
                        <input type="range" min="2000" max="2023" value={rangeValues.yearRange[0]} onChange={(e) => handleRangeChange('yearRange', [e.target.value, rangeValues.yearRange[1]])} />
                        <input type="range" min="2000" max="2023" value={rangeValues.yearRange[1]} onChange={(e) => handleRangeChange('yearRange', [rangeValues.yearRange[0], e.target.value])} />
                        <div className="text-sm text-gray-700">Range: {rangeValues.yearRange[0]} - {rangeValues.yearRange[1]}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <span className="font-medium mr-1">{filter.category}:</span>
                  <span>{filter.value}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button className="text-blue-600 text-sm hover:text-blue-800 flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" /> Add Filter
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-6">
        {/* Results */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="text-sm text-gray-600">
                {loading ? (
                  <span>Loading...</span>
                ) : error ? (
                  <span className="text-red-500">{error}</span>
                ) : (
                  <span>Showing <span className="font-medium">{filteredResults.length}</span> results</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">Sort by:</span>
                <select className="border-gray-300 rounded-md text-sm">
                  <option>Valuation (High to Low)</option>
                  <option>Valuation (Low to High)</option>
                  <option>Funding (High to Low)</option>
                  <option>Funding (Low to High)</option>
                  <option>Founded (Newest)</option>
                  <option>Founded (Oldest)</option>
                </select>
                <button className="ml-4 text-blue-600 hover:text-blue-800 flex items-center text-sm">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export
                </button>
              </div>
            </div>
            
            {/* Results Table */}
            <div className="overflow-x-auto">
              <div className="relative">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                        Property Type
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                        Total Funding
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((company) => (
                      <tr
                        key={company.id}
                        className="hover:bg-gray-50 cursor-pointer relative"
                        onClick={() => handleRowClick(company.id)}
                      >
                        <td className="px-4 py-3 whitespace-normal">
                          <div className="text-sm font-medium text-gray-800">{company.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-normal">
                          <div className="text-sm text-gray-600">{company.propType}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-normal">
                          <div className="text-sm text-gray-600">{company.funding}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-normal">
                          <div className="text-sm text-gray-600">{company.location}</div>
                        </td>
                        {showDetailsButton === company.id && (
                          <td className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(company);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                            >
                              View Details
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Company Details Modal */}
            {selectedCompany && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedCompany.name} - Details
                  </h2>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div><strong>Property Type:</strong> {selectedCompany.propType}</div>
                    <div><strong>Total Funding:</strong> {selectedCompany.funding}</div>
                    <div><strong>Valuation:</strong> {selectedCompany.valuation}</div>
                    <div><strong>Founded:</strong> {selectedCompany.founded}</div>
                    <div><strong>Funding Rounds:</strong> {selectedCompany.rounds}</div>
                    <div><strong>Location:</strong> {selectedCompany.location}</div>
                    <div><strong>Technology:</strong> {selectedCompany.Technology || 'N/A'}</div>
                    <div><strong>Domain:</strong> {selectedCompany.Domain || 'N/A'}</div>
                    <div><strong>HQ Address:</strong> {selectedCompany['HQ Address'] || 'N/A'}</div>
                    <div><strong>AngelList:</strong> {selectedCompany.AngelList || 'N/A'}</div>
                    <div><strong>Crunchbase:</strong> {selectedCompany.Crunchbase || 'N/A'}</div>
                    {/* Add more fields as needed */}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={closeDetails}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && !error && filteredResults.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(filteredResults.length, 10)}</span> of <span className="font-medium">{filteredResults.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        &laquo;
                      </button>
                      <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearch;