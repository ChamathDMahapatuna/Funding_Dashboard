// src/pages/Dashboard.jsx
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

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be your API call in a real application
    // For now, we'll simulate loading sample data
    setTimeout(() => {
      // Sample data - In real app, this would come from your API
      const sampleData = [
        {
          Name: "Aurora Solar",
          Technology: "Solar",
          "Prop Type": "ALL",
          "Total Funding": "$523,500,000",
          "Estimated ARR": "$10,000,000",
          "Latest Valuation": "$4,000,000,000",
          "Latest Valuation Year": "2022",
          "# of Funding Rounds": "4",
          "Founded": "2013",
          "Years Active": "12",
          "City": "San Francisco",
          "State": "CA"
        },
        {
          Name: "EquipmentShare",
          Technology: "Equipment Rental",
          "Prop Type": "Construction",
          "Total Funding": "$2,011,800,000",
          "Estimated ARR": "$300,000,000",
          "Latest Valuation": "$3,890,000,000",
          "Latest Valuation Year": "2023",
          "# of Funding Rounds": "7",
          "Founded": "2014",
          "Years Active": "11",
          "City": "Columbia",
          "State": "MO"
        },
        // Add more data here...
      ];
      
      setCompanies(sampleData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Funding Distribution by Property Type
  const propTypeData = [
    { name: 'Residential', value: 42 },
    { name: 'Commercial', value: 28 },
    { name: 'All Types', value: 18 },
    { name: 'Construction', value: 8 },
    { name: 'Multifamily', value: 4 },
  ];

  // Funding by Year data
  const fundingByYearData = [
    { year: '2017', amount: 120 },
    { year: '2018', amount: 250 },
    { year: '2019', amount: 380 },
    { year: '2020', amount: 470 },
    { year: '2021', amount: 780 },
    { year: '2022', amount: 890 },
    { year: '2023', amount: 650 },
  ];

  // Valuation growth data
  const valuationTrendData = [
    { year: '2017', value: 1.2 },
    { year: '2018', value: 1.8 },
    { year: '2019', value: 2.4 },
    { year: '2020', value: 2.9 },
    { year: '2021', value: 3.6 },
    { year: '2022', value: 4.2 },
    { year: '2023', value: 3.8 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const stats = [
    { 
      title: 'Total Companies', 
      value: '18', 
      change: '+2.5%', 
      isPositive: true,
      icon: <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
    },
    { 
      title: 'Total Funding', 
      value: '$12.4B', 
      change: '+15.2%', 
      isPositive: true,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
    },
    { 
      title: 'Avg. Company Age', 
      value: '8.9 yrs', 
      change: '+0.7', 
      isPositive: true,
      icon: <ClockIcon className="h-8 w-8 text-purple-500" />
    },
    { 
      title: 'Avg. Funding Rounds', 
      value: '5.3', 
      change: '+0.8', 
      isPositive: true,
      icon: <ChartBarIcon className="h-8 w-8 text-orange-500" />
    },
  ];

  // Top funded companies
  const topFundedCompanies = [
    { name: 'EquipmentShare', amount: '$2,011,800,000', valuation: '$3,890,000,000', founded: '2014', rounds: '7' },
    { name: 'Enpal', amount: '$1,780,000,000', valuation: '$2,400,000,000', founded: '2017', rounds: '3' },
    { name: 'Pacaso', amount: '$1,467,000,000', valuation: '$1,500,000,000', founded: '2020', rounds: '4' },
    { name: 'Divvy Homes', amount: '$1,225,000,000', valuation: '$2,000,000,000', founded: '2017', rounds: '6' },
    { name: 'Loft', amount: '$888,000,000', valuation: '$2,900,000,000', founded: '2018', rounds: '5' },
  ];

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Export Data
          </button>
        </div>
      </div>

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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Funding by Property Type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {propTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Valuation Trends (in $B)</h2>
          <div className="h-64">
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Top 5 Funded Companies</h2>
          <div className="overflow-x-auto">
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
          </div>
        </div>
      </div>

      {/* Recent Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Company Data</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading company data...</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Dashboard;