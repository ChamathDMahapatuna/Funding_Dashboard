import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedSearchBar from '../components/AdvancedSearchBar';

function AdminPage() {
  const [fundings, setFundings] = useState([]);
  const [filteredFundings, setFilteredFundings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all fundings when component mounts
  useEffect(() => {
    const fetchFundings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/fundings');
        setFundings(response.data);
        setFilteredFundings(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching fundings:', err);
        setError('Failed to load fundings. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchFundings();
  }, []);

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredFundings(fundings);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const results = fundings.filter(funding => {
      // Search across multiple fields
      return (
        funding.Name?.toLowerCase().includes(searchTermLower) ||
        funding.Technology?.toLowerCase().includes(searchTermLower) ||
        funding['Prop Type']?.toLowerCase().includes(searchTermLower) ||
        funding.City?.toLowerCase().includes(searchTermLower) ||
        funding.State?.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredFundings(results);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <AdvancedSearchBar 
          onSearch={handleSearch} 
          placeholder="Search by company name, technology, location..."
          className="w-full md:w-2/3 lg:w-1/2"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Company</th>
                <th className="py-2 px-4 border-b text-left">Technology</th>
                <th className="py-2 px-4 border-b text-left">Location</th>
                <th className="py-2 px-4 border-b text-left">Total Funding</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFundings.length > 0 ? (
                filteredFundings.map((funding, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{funding.Name}</td>
                    <td className="py-2 px-4 border-b">{funding.Technology}</td>
                    <td className="py-2 px-4 border-b">
                      {funding.City && funding.State ? `${funding.City}, ${funding.State}` : funding.City || funding.State || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">{funding['Total Funding'] || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                      <button className="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No funding data matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
