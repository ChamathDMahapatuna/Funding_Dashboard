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
    company: true,
    funding: true,
    location: false,
    propType: false,
    valuation: false,
    founded: false,
    totalFunding: false,
    yearRange: false,
    fundingRounds: false,
    valuationRank: false,
    numberOfFounders: false,
  });

  const [checkboxStates, setCheckboxStates] = useState({
    technology: false,
    name: false,
    residential: false,
    commercial: false,
    construction: false,
    valuationRange: false,
    totalFunding: false,
    yearRange: false,
    fundingRounds: false,
    valuationRank: false,
    numberOfFounders: false,
  });

  const [rangeValues, setRangeValues] = useState({
    valuationRange: [0, 100],
    totalFunding: [0, 100],
    yearRange: [2000, 2023],
    fundingRounds: [1, 10],
    valuationRank: [1, 100],
    numberOfFounders: [1, 10],
  });

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
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-lg font-medium text-gray-800 mb-4">Filters</div>
            
            {/* Company Info Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('company')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Company Info</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.company ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.company && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="technology" type="checkbox" className="h-4 w-4 text-blue-600" />
                    <label htmlFor="technology" className="ml-2 text-sm text-gray-700">Technology</label>
                  </div>
                  <div className="flex items-center">
                    <input id="name" type="checkbox" className="h-4 w-4 text-blue-600" />
                    <label htmlFor="name" className="ml-2 text-sm text-gray-700">Company Name</label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Funding Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('funding')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Funding</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.funding ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.funding && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="range" type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    <label htmlFor="range" className="ml-2 text-sm text-gray-700">Funding Range</label>
                  </div>
                  <div className="flex items-center">
                    <input id="rounds" type="checkbox" className="h-4 w-4 text-blue-600" />
                    <label htmlFor="rounds" className="ml-2 text-sm text-gray-700">Funding Rounds</label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Location Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('location')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Location</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.location ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.location && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="state" type="checkbox" className="h-4 w-4 text-blue-600" />
                    <label htmlFor="state" className="ml-2 text-sm text-gray-700">State</label>
                  </div>
                  <div className="flex items-center">
                    <input id="city" type="checkbox" className="h-4 w-4 text-blue-600" />
                    <label htmlFor="city" className="ml-2 text-sm text-gray-700">City</label>
                  </div>
                </div>
              )}
            </div>

            {/* Property Type Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('propType')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Property Type</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.propType ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.propType && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="residential" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.residential} onChange={() => handleCheckboxChange('residential')} />
                    <label htmlFor="residential" className="ml-2 text-sm text-gray-700">Residential</label>
                  </div>
                  <div className="flex items-center">
                    <input id="commercial" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.commercial} onChange={() => handleCheckboxChange('commercial')} />
                    <label htmlFor="commercial" className="ml-2 text-sm text-gray-700">Commercial</label>
                  </div>
                </div>
              )}
            </div>

            {/* Valuation Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('valuation')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Valuation</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.valuation ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.valuation && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="valuationRange" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.valuationRange} onChange={() => handleCheckboxChange('valuationRange')} />
                    <label htmlFor="valuationRange" className="ml-2 text-sm text-gray-700">Valuation Range</label>
                  </div>
                  {checkboxStates.valuationRange && (
                    <div className="mt-2">
                      <input type="range" min="0" max="100" value={rangeValues.valuationRange[0]} onChange={(e) => handleRangeChange('valuationRange', [e.target.value, rangeValues.valuationRange[1]])} />
                      <input type="range" min="0" max="100" value={rangeValues.valuationRange[1]} onChange={(e) => handleRangeChange('valuationRange', [rangeValues.valuationRange[0], e.target.value])} />
                      <div>Range: {rangeValues.valuationRange[0]} - {rangeValues.valuationRange[1]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Total Funding Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('totalFunding')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Total Funding</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.totalFunding ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.totalFunding && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="totalFunding" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.totalFunding} onChange={() => handleCheckboxChange('totalFunding')} />
                    <label htmlFor="totalFunding" className="ml-2 text-sm text-gray-700">Total Funding</label>
                  </div>
                  {checkboxStates.totalFunding && (
                    <div className="mt-2">
                      <input type="range" min="0" max="100" value={rangeValues.totalFunding[0]} onChange={(e) => handleRangeChange('totalFunding', [e.target.value, rangeValues.totalFunding[1]])} />
                      <input type="range" min="0" max="100" value={rangeValues.totalFunding[1]} onChange={(e) => handleRangeChange('totalFunding', [rangeValues.totalFunding[0], e.target.value])} />
                      <div>Range: {rangeValues.totalFunding[0]} - {rangeValues.totalFunding[1]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Year Range Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('yearRange')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Year Range</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.yearRange ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.yearRange && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="yearRange" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.yearRange} onChange={() => handleCheckboxChange('yearRange')} />
                    <label htmlFor="yearRange" className="ml-2 text-sm text-gray-700">Year Range</label>
                  </div>
                  {checkboxStates.yearRange && (
                    <div className="mt-2">
                      <input type="range" min="2000" max="2023" value={rangeValues.yearRange[0]} onChange={(e) => handleRangeChange('yearRange', [e.target.value, rangeValues.yearRange[1]])} />
                      <input type="range" min="2000" max="2023" value={rangeValues.yearRange[1]} onChange={(e) => handleRangeChange('yearRange', [rangeValues.yearRange[0], e.target.value])} />
                      <div>Range: {rangeValues.yearRange[0]} - {rangeValues.yearRange[1]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Number of Funding Rounds Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('fundingRounds')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Number of Funding Rounds</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.fundingRounds ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.fundingRounds && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="fundingRounds" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.fundingRounds} onChange={() => handleCheckboxChange('fundingRounds')} />
                    <label htmlFor="fundingRounds" className="ml-2 text-sm text-gray-700">Funding Rounds</label>
                  </div>
                  {checkboxStates.fundingRounds && (
                    <div className="mt-2">
                      <input type="range" min="1" max="10" value={rangeValues.fundingRounds[0]} onChange={(e) => handleRangeChange('fundingRounds', [e.target.value, rangeValues.fundingRounds[1]])} />
                      <input type="range" min="1" max="10" value={rangeValues.fundingRounds[1]} onChange={(e) => handleRangeChange('fundingRounds', [rangeValues.fundingRounds[0], e.target.value])} />
                      <div>Range: {rangeValues.fundingRounds[0]} - {rangeValues.fundingRounds[1]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Valuation Rank Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('valuationRank')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Valuation Rank</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.valuationRank ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.valuationRank && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="valuationRank" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.valuationRank} onChange={() => handleCheckboxChange('valuationRank')} />
                    <label htmlFor="valuationRank" className="ml-2 text-sm text-gray-700">Valuation Rank</label>
                  </div>
                  {checkboxStates.valuationRank && (
                    <div className="mt-2">
                      <input type="range" min="1" max="100" value={rangeValues.valuationRank[0]} onChange={(e) => handleRangeChange('valuationRank', [e.target.value, rangeValues.valuationRank[1]])} />
                      <input type="range" min="1" max="100" value={rangeValues.valuationRank[1]} onChange={(e) => handleRangeChange('valuationRank', [rangeValues.valuationRank[0], e.target.value])} />
                      <div>Range: {rangeValues.valuationRank[0]} - {rangeValues.valuationRank[1]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Number of Founders Filter */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory('numberOfFounders')}
                className="flex items-center justify-between w-full mb-2 text-sm font-medium text-gray-700"
              >
                <span>Number of Founders</span>
                <ChevronDownIcon className={`h-4 w-4 transform ${expandedCategories.numberOfFounders ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategories.numberOfFounders && (
                <div className="ml-2 space-y-2">
                  <div className="flex items-center">
                    <input id="numberOfFounders" type="checkbox" className="h-4 w-4 text-blue-600" checked={checkboxStates.numberOfFounders} onChange={() => handleCheckboxChange('numberOfFounders')} />
                    <label htmlFor="numberOfFounders" className="ml-2 text-sm text-gray-700">Founders</label>
                  </div>
                  {checkboxStates.numberOfFounders && (
                    <div className="mt-2">
                      <input type="range" min="1" max="10" value={rangeValues.numberOfFounders[0]} onChange={(e) => handleRangeChange('numberOfFounders', [e.target.value, rangeValues.numberOfFounders[1]])} />
                      <input type="range" min="1" max="10" value={rangeValues.numberOfFounders[1]} onChange={(e) => handleRangeChange('numberOfFounders', [rangeValues.numberOfFounders[0], e.target.value])} />
                      <div>Range: {rangeValues.numberOfFounders[0]} - {rangeValues.numberOfFounders[1]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={applyFilters}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
        
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
              <div className="overflow-x-scroll">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Funding
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valuation
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Founded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rounds
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">{company.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.propType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.funding}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.valuation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.founded}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.rounds}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.location}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
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