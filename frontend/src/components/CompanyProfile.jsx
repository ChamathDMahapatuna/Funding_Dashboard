import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  FunnelIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChartPieIcon,
  CubeIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import axios from 'axios';

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Total Funding Rank', direction: 'ascending' });
  const [activeFilters, setActiveFilters] = useState({
    fundingStage: 'All',
    propType: 'All',
    foundedYear: 'All',
    location: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [propTypeDistribution, setPropTypeDistribution] = useState([]);
  const [fundingStageDistribution, setFundingStageDistribution] = useState([]);
  const [locationDistribution, setLocationDistribution] = useState([]);
  const [yearDistribution, setYearDistribution] = useState([]);

  const API_URL = 'http://localhost:5000/api/fundings';

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      applyFiltersAndSort();
      generateChartData();
    }
  }, [companies, searchTerm, activeFilters, sortConfig]);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let results = [...companies];

    // Apply search term
    if (searchTerm) {
      results = results.filter(company => 
        company.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company['Prop Type']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply property type filter
    if (activeFilters.propType !== 'All') {
      results = results.filter(company => 
        company['Prop Type'] === activeFilters.propType
      );
    }

    // Apply location filter
    if (activeFilters.location !== 'All') {
      results = results.filter(company => 
        company.State === activeFilters.location || company.City === activeFilters.location
      );
    }

    // Apply founded year filter
    if (activeFilters.foundedYear !== 'All') {
      const year = parseInt(activeFilters.foundedYear);
      results = results.filter(company => company.Founded === year);
    }

    // Apply funding stage filter
    if (activeFilters.fundingStage !== 'All') {
      switch(activeFilters.fundingStage) {
        case 'Pre-Seed/Seed':
          results = results.filter(company => 
            company['Pre-Seed $'] || company['Seed $']
          );
          break;
        case 'Series A':
          results = results.filter(company => company['A Round $']);
          break;
        case 'Series B':
          results = results.filter(company => company['B Round $']);
          break;
        case 'Series C+':
          results = results.filter(company => 
            company['C Round $'] || company['D Round $'] || 
            company['E Round $'] || company['F Round $'] ||
            company['G Round $'] || company['H Round $']
          );
          break;
        case 'Unicorns':
          results = results.filter(company => {
            if (!company['Latest Valuation']) return false;
            const valuation = parseFloat(company['Latest Valuation'].replace(/[$,]/g, ''));
            return valuation >= 1000000000; // $1B+
          });
          break;
        default:
          break;
      }
    }

    // Apply sorting
    results.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle currency values
      if (typeof aValue === 'string' && aValue?.startsWith('$')) {
        aValue = parseFloat(aValue.replace(/[$,]/g, ''));
        bValue = parseFloat(bValue?.replace(/[$,]/g, '') || 0);
      }
      
      // Handle numeric comparison
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sortConfig.direction === 'ascending' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle null or undefined values
      if (aValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;
      
      return 0;
    });

    setFilteredCompanies(results);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilters({
      fundingStage: 'All',
      propType: 'All',
      foundedYear: 'All',
      location: 'All'
    });
  };

  const generateChartData = () => {
    // Generate prop type distribution
    const propTypes = {};
    companies.forEach(company => {
      const type = company['Prop Type'] || 'Unknown';
      propTypes[type] = (propTypes[type] || 0) + 1;
    });
    
    const propTypeData = Object.entries(propTypes)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 property types
    
    setPropTypeDistribution(propTypeData);

    // Generate funding stage distribution
    const fundingStages = {
      'Pre-Seed/Seed': 0,
      'Series A': 0,
      'Series B': 0,
      'Series C+': 0,
      'Unknown': 0
    };

    companies.forEach(company => {
      if (company['Pre-Seed $'] || company['Seed $']) {
        fundingStages['Pre-Seed/Seed']++;
      }
      
      if (company['A Round $']) {
        fundingStages['Series A']++;
      }
      
      if (company['B Round $']) {
        fundingStages['Series B']++;
      }
      
      if (company['C Round $'] || company['D Round $'] || 
          company['E Round $'] || company['F Round $'] ||
          company['G Round $'] || company['H Round $']) {
        fundingStages['Series C+']++;
      }
      
      if (!company['Pre-Seed $'] && !company['Seed $'] && 
          !company['A Round $'] && !company['B Round $'] && 
          !company['C Round $'] && !company['D Round $'] && 
          !company['E Round $'] && !company['F Round $'] &&
          !company['G Round $'] && !company['H Round $']) {
        fundingStages['Unknown']++;
      }
    });

    const fundingStageData = Object.entries(fundingStages)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
    
    setFundingStageDistribution(fundingStageData);

    // Generate location distribution
    const locations = {};
    companies.forEach(company => {
      const location = company.State || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;
    });
    
    const locationData = Object.entries(locations)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 locations
    
    setLocationDistribution(locationData);

    // Generate year distribution
    const years = {};
    companies.forEach(company => {
      if (company.Founded) {
        const year = company.Founded.toString();
        years[year] = (years[year] || 0) + 1;
      }
    });
    
    const yearData = Object.entries(years)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name - b.name)
      .slice(-10); // Last 10 years
    
    setYearDistribution(yearData);
  };

  const getFilterOptions = (field) => {
    const options = new Set();
    
    companies.forEach(company => {
      if (company[field]) {
        options.add(company[field]);
      }
    });
    
    return ['All', ...Array.from(options).sort()];
  };

  const propertyTypes = getFilterOptions('Prop Type');
  const states = getFilterOptions('State');
  const foundedYears = ['All', ...[...new Set(companies.map(c => c.Founded).filter(Boolean))].sort()];

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'string' && value.startsWith('$')) return value;
    return `$${value.toLocaleString()}`;
  };

  const CHART_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
    '#F97316', '#8B5CF6', '#84CC16', '#06B6D4'
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
          <p className="text-gray-500">Overview of {filteredCompanies.length} companies</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
          >
            <ChartPieIcon className="h-4 w-4" />
            Funding Details
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p className="flex items-center gap-2">
            <XMarkIcon className="h-5 w-5" />
            {error}
          </p>
        </div>
      )}

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Filters</h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset all filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Stage
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={activeFilters.fundingStage}
                onChange={(e) => setActiveFilters({...activeFilters, fundingStage: e.target.value})}
              >
                <option value="All">All Stages</option>
                <option value="Pre-Seed/Seed">Pre-Seed/Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C+">Series C+</option>
                <option value="Unicorns">Unicorns ($1B+)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={activeFilters.propType}
                onChange={(e) => setActiveFilters({...activeFilters, propType: e.target.value})}
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={activeFilters.location}
                onChange={(e) => setActiveFilters({...activeFilters, location: e.target.value})}
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founded Year
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={activeFilters.foundedYear}
                onChange={(e) => setActiveFilters({...activeFilters, foundedYear: e.target.value})}
              >
                {foundedYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by company name or property type..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={fetchCompanies}
            className="ml-3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics dashboard */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Analytics Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Type Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <CubeIcon className="h-5 w-5 text-blue-500" />
              Property Type Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {propTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Funding Stage Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-500" />
              Funding Stage Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundingStageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {fundingStageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Location Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-blue-500" />
              Top Locations
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Founded Year Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-blue-500" />
              Companies by Founded Year
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Companies table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Companies List</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="flex items-center gap-3">
              <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />
              <p className="text-gray-500">Loading companies...</p>
            </div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No companies found matching your filters.</p>
            <button 
              onClick={resetFilters}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Name')}
                  >
                    <div className="flex items-center gap-2">
                      Company Name
                      {sortConfig.key === 'Name' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Prop Type')}
                  >
                    <div className="flex items-center gap-2">
                      Property Type
                      {sortConfig.key === 'Prop Type' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('State')}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      {sortConfig.key === 'State' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Founded')}
                  >
                    <div className="flex items-center gap-2">
                      Founded
                      {sortConfig.key === 'Founded' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Total Funding')}
                  >
                    <div className="flex items-center gap-2">
                      Total Funding
                      {sortConfig.key === 'Total Funding' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Latest Valuation')}
                  >
                    <div className="flex items-center gap-2">
                      Latest Valuation
                      {sortConfig.key === 'Latest Valuation' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Total Funding Rank')}
                  >
                    <div className="flex items-center gap-2">
                      Rank
                      {sortConfig.key === 'Total Funding Rank' && (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.Name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.Name}</div>
                          <div className="text-sm text-gray-500">{company.Website || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company['Prop Type'] || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.City ? `${company.City}, ${company.State}` : company.State || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.Founded || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company['Total Funding'] ? formatCurrency(company['Total Funding']) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company['Latest Valuation'] ? formatCurrency(company['Latest Valuation']) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {company['Total Funding Rank'] || 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination - Future implementation */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={true}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={true}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 Funding Analysis Dashboard. All rights reserved.</p>
      </div>
    </div>
  );
}

export default CompaniesPage;