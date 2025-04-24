import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
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
  LineChart, 
  Line 
} from 'recharts';
import axios from 'axios'; // Make sure to install axios: npm install axios
import * as XLSX from 'xlsx'; // Import xlsx package - install with: npm install xlsx

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [fundingByYearData, setFundingByYearData] = useState([]);
  const [propTypeData, setPropTypeData] = useState([]);
  const [valuationTrendData, setValuationTrendData] = useState([]);
  const [topFundedCompanies, setTopFundedCompanies] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/fundings'; // Adjust based on your API setup

  // Add navigate hook for redirection
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);
        const data = response.data;
        console.log("Fetched data:", response.data); // Debugging
        
        // Set the raw company data
        setCompanies(data);
        
        // Process data for other visualizations
        processData(data);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (data) => {
    if (!data.length) return;

    // Calculate summary statistics
    const totalCompanies = data.length;
    
    // Calculate total funding (removing $ and commas and converting to number)
    const totalFunding = data.reduce((sum, company) => {
      const funding = company['Total Funding'] ? 
        parseFloat(company['Total Funding'].replace(/[$,]/g, '')) : 0;
      return sum + funding;
    }, 0);
    
    // Format total funding in billions
    const formattedTotalFunding = `$${(totalFunding / 1000000000).toFixed(1)}B`;
    
    // Calculate average company age
    const currentYear = new Date().getFullYear();
    const avgAge = data.reduce((sum, company) => {
      const founded = company.Founded ? parseInt(company.Founded) : currentYear;
      return sum + (currentYear - founded);
    }, 0) / totalCompanies;
    
    // Calculate average funding rounds
    const avgRounds = data.reduce((sum, company) => {
      const rounds = company['# of Funding Rounds'] ? 
        parseInt(company['# of Funding Rounds']) : 0;
      return sum + rounds;
    }, 0) / totalCompanies;

    // Set stats
    setStats([
      { 
        title: 'Total Companies', 
        value: totalCompanies.toString(), 
        change: '+2.5%', // You might calculate this based on historical data
        isPositive: true,
        icon: <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
      },
      { 
        title: 'Total Funding', 
        value: formattedTotalFunding, 
        change: '+15.2%', // You might calculate this based on historical data
        isPositive: true,
        icon: <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
      },
      { 
        title: 'Avg. Company Age', 
        value: `${avgAge.toFixed(1)} yrs`, 
        change: '+0.7', // You might calculate this based on historical data
        isPositive: true,
        icon: <ClockIcon className="h-8 w-8 text-purple-500" />
      },
      { 
        title: 'Avg. Funding Rounds', 
        value: avgRounds.toFixed(1), 
        change: '+0.8', // You might calculate this based on historical data
        isPositive: true,
        icon: <ChartBarIcon className="h-8 w-8 text-orange-500" />
      },
    ]);

    // Process property type data
    const propTypes = {};
    data.forEach(company => {
      const type = company['Prop Type'] || 'Unknown';
      propTypes[type] = (propTypes[type] || 0) + 1;
    });

      // Convert to array and sort by frequency
    let propTypeArray = Object.entries(propTypes).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalCompanies) * 100)
    }));
    // Sort by count (descending)
    
    propTypeArray.sort((a, b) => b.count - a.count);

    propTypeArray.sort((a, b) => b.count - a.count);

    // Take top 10 categories, then group the rest as "Other"
    if (propTypeArray.length > 10) {
      const topCategories = propTypeArray.slice(0, 10);
      const otherCategories = propTypeArray.slice(10);
      
      const otherCount = otherCategories.reduce((sum, item) => sum + item.count, 0);
      const otherPercentage = Math.round((otherCount / totalCompanies) * 100);
      
      propTypeArray = [
        ...topCategories,
        { name: 'Other', count: otherCount, percentage: otherPercentage }
      ];
    }
  
    setPropTypeData(propTypeArray);

    // Process funding by year data
    const fundingByYear = {};
    data.forEach(company => {
      // Check for each round type and add to the appropriate year
      const roundTypes = [
        'Pre-Seed Date', 'Seed Date', 'Bridge Date', 'A Round Date', 
        'B Round Date', 'C Round Date', 'D Round Date', 'E Round Date',
        'F Round Date', 'G Round Date', 'H Round Date', 'Unknown Series Date'
      ];
      
      const amountTypes = [
        'Pre-Seed $', 'Seed $', 'Bridge $', 'A Round $', 
        'B Round $', 'C Round $', 'D Round $', 'E Round $',
        'F Round $', 'G Round $', 'H Round $', 'Unknown Series $'
      ];
      
      roundTypes.forEach((dateField, index) => {
        if (company[dateField]) {
          const year = company[dateField].split('/')[2] || company[dateField].split('-')[0];
          if (year && !isNaN(parseInt(year))) {
            const amountField = amountTypes[index];
            const amount = company[amountField] ? 
              parseFloat(company[amountField].replace(/[$,]/g, '')) : 0;
            
            fundingByYear[year] = (fundingByYear[year] || 0) + amount;
          }
        }
      });
    });

    const processedFundingByYear = Object.entries(fundingByYear)
      .map(([year, amount]) => ({
        year,
        amount: Math.round(amount / 1000000) // Convert to millions
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    setFundingByYearData(processedFundingByYear);

    // Process valuation trend data
    const valuationsByYear = {};
    let companyCountByYear = {};
    
    data.forEach(company => {
      if (company['Latest Valuation'] && company['Latest Valuation Year']) {
        const year = company['Latest Valuation Year'].toString();
        const valuation = parseFloat(company['Latest Valuation'].replace(/[$,]/g, ''));
        
        if (!isNaN(valuation)) {
          valuationsByYear[year] = (valuationsByYear[year] || 0) + valuation;
          companyCountByYear[year] = (companyCountByYear[year] || 0) + 1;
        }
      }
    });

    const processedValuationData = Object.entries(valuationsByYear)
      .map(([year, totalValuation]) => ({
        year,
        value: (totalValuation / companyCountByYear[year] / 1000000000).toFixed(1) // Average in billions
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    setValuationTrendData(processedValuationData);

    // Process top funded companies
    const sortedByFunding = [...data].sort((a, b) => {
      const fundingA = a['Total Funding'] ? 
        parseFloat(a['Total Funding'].replace(/[$,]/g, '')) : 0;
      const fundingB = b['Total Funding'] ? 
        parseFloat(b['Total Funding'].replace(/[$,]/g, '')) : 0;
      return fundingB - fundingA;
    });

    const processedTopFundedCompanies = sortedByFunding.slice(0, 5).map(company => ({
      name: company.Name,
      amount: company['Total Funding'] || 'N/A',
      valuation: company['Latest Valuation'] || 'N/A',
      founded: company.Founded?.toString() || 'N/A',
      rounds: company['# of Funding Rounds']?.toString() || 'N/A'
    }));
    
    setTopFundedCompanies(processedTopFundedCompanies);
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    
    // Export Summary Stats
    const statsData = stats.map(stat => ({
      Metric: stat.title,
      Value: stat.value,
      Change: stat.change
    }));
    const statsSheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Summary Stats");
    
    // Export Companies Data
    const companiesSheet = XLSX.utils.json_to_sheet(companies);
    XLSX.utils.book_append_sheet(workbook, companiesSheet, "Companies");
    
    // Export Funding by Year Data
    const fundingByYearSheet = XLSX.utils.json_to_sheet(fundingByYearData);
    XLSX.utils.book_append_sheet(workbook, fundingByYearSheet, "Funding By Year");
    
    // Export Property Type Data
    const propTypeSheet = XLSX.utils.json_to_sheet(propTypeData);
    XLSX.utils.book_append_sheet(workbook, propTypeSheet, "Property Types");
    
    // Export Valuation Trend Data
    const valuationTrendSheet = XLSX.utils.json_to_sheet(valuationTrendData);
    XLSX.utils.book_append_sheet(workbook, valuationTrendSheet, "Valuation Trends");
    
    // Export Top Funded Companies
    const topFundedSheet = XLSX.utils.json_to_sheet(topFundedCompanies);
    XLSX.utils.book_append_sheet(workbook, topFundedSheet, "Top Funded Companies");
    
    // Generate file name with current date
    const date = new Date();
    const fileName = `PropTech_Funding_Dashboard_${date.toISOString().split('T')[0]}.xlsx`;
    
    // Write and download file
    XLSX.writeFile(workbook, fileName);
  };

  // Function to handle navigation to Company Profile
  const navigateToCompanyProfile = () => {
    navigate('/companies-profile'); // Use the correct route that points to CompanyProfile
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">PropTech Funding Dashboard</h1>
        <div className="flex items-center space-x-3">
          <select className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Time</option>
            <option>Last 5 Years</option>
            <option>Last Year</option>
            <option>YTD</option>
          </select>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={exportToExcel}
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div className="bg-white rounded-lg shadow p-5" key={index}>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className={`flex items-center text-sm mt-1 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Funding by Year</h2>
          <div className="h-64">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
              </div>
            ) : fundingByYearData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fundingByYearData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}M`, 'Amount']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No funding data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Funding by Property Type</h2>
        <div className="h-64">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          ) : propTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={propTypeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax']} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={90}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name, props) => [`${props.payload.percentage}% (${value} companies)`, 'Count']}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  label={{ 
                    position: 'right', 
                    formatter: (item) => `${item.percentage}%`,
                    fontSize: 12
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No property type data available
            </div>
          )}
        </div>
      </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Valuation Trends (in $B)</h2>
          <div className="h-64">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
              </div>
            ) : valuationTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={valuationTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}B`, 'Average Valuation']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No valuation trend data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Top 5 Funded Companies</h2>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
              </div>
            ) : topFundedCompanies.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Funding</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valuation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founded</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rounds</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topFundedCompanies.map((company, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{company.amount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{company.valuation}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{company.founded}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{company.rounds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center items-center h-32 text-gray-500">
                No company data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Company Data</h2>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={navigateToCompanyProfile}
          >
            View All
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading company data...</p>
          </div>
        ) : companies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Funding</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valuation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founded</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rounds</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company, index) => (
                  <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{company.Name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company["Prop Type"]}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company["Total Funding"]}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company["Latest Valuation"]}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.Founded}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company["# of Funding Rounds"]}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.City}, {company.State}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No company data available
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;