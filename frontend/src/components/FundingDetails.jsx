import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import axios from 'axios';

function FundingDetails() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [fundingRoundData, setFundingRoundData] = useState([]);
  const [historicalValuations, setHistoricalValuations] = useState([]);
  const [fundingDistribution, setFundingDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRounds, setExpandedRounds] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Total Funding', direction: 'descending' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const API_URL = 'http://localhost:5000/api/fundings';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);
        const data = response.data;
        
        // Set the raw company data
        setCompanies(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort companies based on current sort configuration
  const sortedCompanies = [...companies].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Handle currency values
    if (typeof aValue === 'string' && aValue.startsWith('$')) {
      aValue = parseFloat(aValue.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue.replace(/[$,]/g, ''));
    }
    
    // Handle numeric comparison
    if (!isNaN(aValue) && !isNaN(bValue)) {
      return sortConfig.direction === 'ascending' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    // Handle string comparison
    return sortConfig.direction === 'ascending'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Filter companies based on search term
  const filteredCompanies = sortedCompanies.filter(company => 
    company.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company['Prop Type']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    });
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    
    // Process funding round data
    const roundTypes = [
      { round: 'Pre-Seed', date: 'Pre-Seed Date', amount: 'Pre-Seed $' },
      { round: 'Seed', date: 'Seed Date', amount: 'Seed $' },
      { round: 'Bridge', date: 'Bridge Date', amount: 'Bridge $' },
      { round: 'Series A', date: 'A Round Date', amount: 'A Round $' },
      { round: 'Series B', date: 'B Round Date', amount: 'B Round $' },
      { round: 'Series C', date: 'C Round Date', amount: 'C Round $' },
      { round: 'Series D', date: 'D Round Date', amount: 'D Round $' },
      { round: 'Series E', date: 'E Round Date', amount: 'E Round $' },
      { round: 'Series F', date: 'F Round Date', amount: 'F Round $' },
      { round: 'Series G', date: 'G Round Date', amount: 'G Round $' },
      { round: 'Series H', date: 'H Round Date', amount: 'H Round $' },
      { round: 'Unknown Series', date: 'Unknown Series Date', amount: 'Unknown Series $' },
      { round: 'Non-Dilutive', date: 'Non-Dilutive Round Date', amount: 'Non-Dilutive Round $' }
    ];
    
    // Filter to include only rounds that have data
    const fundingRounds = roundTypes
      .filter(rt => company[rt.date] && company[rt.amount])
      .map(rt => {
        const amount = company[rt.amount] 
          ? parseFloat(company[rt.amount].replace(/[$,]/g, '')) 
          : 0;
        
        return {
          round: rt.round,
          date: company[rt.date],
          amount: amount,
          formattedAmount: company[rt.amount]
        };
      })
      .sort((a, b) => {
        // Try to parse dates in different formats
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
    
    setFundingRoundData(fundingRounds);
    
    // Create chart data
    const roundChartData = fundingRounds.map(round => ({
      name: round.round,
      value: round.amount / 1000000 // Convert to millions
    }));
    
    setFundingDistribution(roundChartData);
    
    // Create valuation history if available
    if (company['Latest Valuation'] && company['Latest Valuation Year']) {
      // In a real app, you would have multiple valuation points
      // For now, we'll create a simple progression based on available data
      const latestValuation = parseFloat(company['Latest Valuation'].replace(/[$,]/g, ''));
      const latestYear = company['Latest Valuation Year'];
      
      // Create some fake historical data - in a real app, you'd use actual historical valuations
      const startYear = company.Founded || latestYear - 5;
      const years = latestYear - startYear + 1;
      
      // Create a simple growth curve
      const valuationHistory = [];
      for (let i = 0; i < years; i++) {
        const year = startYear + i;
        // Creating a simple exponential growth model
        const factor = Math.pow(1.5, i / (years - 1));
        const valuation = i === years - 1 
          ? latestValuation 
          : Math.round(latestValuation / (Math.pow(2, years - i - 1)));
        
        valuationHistory.push({
          year: year.toString(),
          valuation: valuation / 1000000000 // Convert to billions
        });
      }
      
      setHistoricalValuations(valuationHistory);
    } else {
      setHistoricalValuations([]);
    }
  };

  const toggleRoundExpansion = (round) => {
    setExpandedRounds(prev => ({
      ...prev,
      [round]: !prev[round]
    }));
  };

  // Helper function to format currency
  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'string' && value.startsWith('$')) return value;
    return `$${value.toLocaleString()}`;
  };

  // Define colors for charts
  const ROUND_COLORS = [
    '#4299E1', '#3182CE', '#2B6CB0', '#2C5282', '#2A4365', // Blues
    '#68D391', '#48BB78', '#38A169', '#2F855A', '#276749', // Greens
    '#F6AD55', '#ED8936', '#DD6B20', '#C05621', '#9C4221'  // Oranges
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Funding Details</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Search and Filters */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Search by company name or property type..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="ml-4 flex">
                <button 
                  className={`px-3 py-2 rounded-l ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
                <button 
                  className={`px-3 py-2 rounded-r ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-800">
                All Stages
              </button>
              <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800">
                Pre-Seed/Seed
              </button>
              <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800">
                Series A-C
              </button>
              <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800">
                Series D+
              </button>
              <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800">
                Valuation $1B+
              </button>
            </div>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between py-2 border-b">
                <span>Total Companies:</span>
                <span className="font-medium">{companies.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Average Funding:</span>
                <span className="font-medium">
                  {isLoading ? 'Loading...' : 
                    formatCurrency(companies.reduce((sum, company) => {
                      const funding = company['Total Funding'] ? 
                        parseFloat(company['Total Funding'].replace(/[$,]/g, '')) : 0;
                      return sum + funding;
                    }, 0) / (companies.length || 1))
                  }
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Median Rounds:</span>
                <span className="font-medium">
                  {isLoading ? 'Loading...' : 
                    Math.round(companies.reduce((sum, company) => {
                      return sum + (company['# of Funding Rounds'] || 0);
                    }, 0) / (companies.length || 1))
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Companies</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-500">Loading companies...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
              {viewMode === 'table' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('Name')}
                      >
                        Company
                        {sortConfig.key === 'Name' && (
                          sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                        )}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('Total Funding')}
                      >
                        Funding
                        {sortConfig.key === 'Total Funding' && (
                          sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCompanies.map((company, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-blue-50 cursor-pointer ${selectedCompany?.Name === company.Name ? 'bg-blue-50' : ''}`}
                        onClick={() => handleCompanySelect(company)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{company.Name}</div>
                          <div className="text-sm text-gray-500">{company['Prop Type']}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{company['Total Funding']}</div>
                          <div className="text-xs text-gray-500">{company['# of Funding Rounds']} rounds</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-1 gap-4 p-4">
                  {filteredCompanies.map((company, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md ${
                        selectedCompany?.Name === company.Name ? 'border-blue-500 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => handleCompanySelect(company)}
                    >
                      <div className="font-medium text-gray-900">{company.Name}</div>
                      <div className="text-sm text-gray-500 mb-2">{company['Prop Type']}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-semibold text-blue-600">{company['Total Funding']}</div>
                        <div className="text-xs text-gray-500">{company['# of Funding Rounds']} rounds</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Company Details */}
        <div className="lg:col-span-2">
          {selectedCompany ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">{selectedCompany.Name}</h2>
                <div className="mt-1 text-sm text-gray-600">
                  {selectedCompany['Prop Type']} • Founded {selectedCompany.Founded}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Key Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Key Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Total Funding</div>
                        <div className="text-lg font-medium">{selectedCompany['Total Funding']}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Latest Valuation</div>
                        <div className="text-lg font-medium">{selectedCompany['Latest Valuation'] || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Funding Rounds</div>
                        <div className="text-lg font-medium">{selectedCompany['# of Funding Rounds'] || '0'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Latest Round</div>
                        <div className="text-lg font-medium">{selectedCompany['Latest Round'] || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Funding Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Funding Distribution</h3>
                    {fundingDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={fundingDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {fundingDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={ROUND_COLORS[index % ROUND_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`$${value.toFixed(1)}M`, 'Amount']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[180px] flex items-center justify-center text-gray-500">
                        No funding distribution data available
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Valuation History */}
                <div className="mb-8">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Valuation History</h3>
                  {historicalValuations.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4" style={{ height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalValuations}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis 
                            tickFormatter={(value) => `$${value}B`} 
                            domain={[0, 'dataMax']}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${value.toFixed(2)}B`, 'Valuation']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="valuation" 
                            stroke="#3182CE" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center text-gray-500">
                      No valuation history available
                    </div>
                  )}
                </div>
                
                {/* Funding Rounds */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Funding Rounds</h3>
                  {fundingRoundData.length > 0 ? (
                    <div className="space-y-3">
                      {fundingRoundData.map((round, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                          <div 
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => toggleRoundExpansion(round.round)}
                          >
                            <div className="flex items-center">
                              <div 
                                className="h-10 w-10 rounded-full mr-3 flex items-center justify-center"
                                style={{ backgroundColor: ROUND_COLORS[index % ROUND_COLORS.length] }}
                              >
                                <CurrencyDollarIcon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">{round.round}</div>
                                <div className="text-sm text-gray-500">{round.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-4">
                                <div className="font-medium">{round.formattedAmount}</div>
                              </div>
                              {expandedRounds[round.round] ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                          
                          {expandedRounds[round.round] && (
                            <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                              <div className="bg-white rounded p-3 text-sm">
                                <div className="grid grid-cols-2 gap-y-2">
                                  <div className="text-gray-500">Lead Investor:</div>
                                  <div>{selectedCompany[`${round.round} Lead`] || 'Unknown'}</div>
                                  
                                  <div className="text-gray-500">Investors:</div>
                                  <div>{selectedCompany[`${round.round} Investors`] || 'Unknown'}</div>
                                  
                                  <div className="text-gray-500">Post-money Valuation:</div>
                                  <div>{selectedCompany[`${round.round} Valuation`] || 'Unknown'}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                      No funding round data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 h-full flex items-center justify-center">
              <div>
                <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Company Selected</h3>
                <p>Select a company from the list to view detailed funding information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FundingDetails;