import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import AddFundingModal from './AddFundingModal';
// ... import any required icons ...

function AdminAdvancedSearch() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [rowData, setRowData] = useState({});
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Check if user exists and is an admin
    if (user?.role !== 'admin') {
      // User is logged in but not an admin
      navigate('/advanced-search');
      return;
    }
    
    // Fetch data from API 
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/fundings');
      // ...existing transformation logic...
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
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setRowData({ ...row });
  };

  const handleChange = (e, field) => {
    setRowData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const saveRow = async (id) => {
    try {
      // send a PUT request to update the funding entry
      await axios.put(`http://localhost:5000/api/fundings/${id}`, rowData);
      // update local state
      setSearchResults(prev => prev.map(item => item.id === id ? rowData : item));
      setEditingRow(null);
    } catch (err) {
      console.error('Error updating data:', err);
      setError('Error updating entry.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Advanced Search</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <span className="mr-2">+</span> Add Funding Details
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Company Name</th>
                <th className="px-4 py-2">Property Type</th>
                <th className="px-4 py-2">Total Funding</th>
                <th className="px-4 py-2">Valuation</th>
                <th className="px-4 py-2">Founded</th>
                <th className="px-4 py-2">Rounds</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.propType}
                        onChange={(e) => handleChange(e, 'propType')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.propType
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.funding}
                        onChange={(e) => handleChange(e, 'funding')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.funding
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.valuation}
                        onChange={(e) => handleChange(e, 'valuation')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.valuation
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.founded}
                        onChange={(e) => handleChange(e, 'founded')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.founded
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.rounds}
                        onChange={(e) => handleChange(e, 'rounds')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.rounds
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <input
                        value={rowData.location}
                        onChange={(e) => handleChange(e, 'location')}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      row.location
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === row.id ? (
                      <>
                        <button
                          onClick={() => saveRow(row.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRow(null)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(row)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Use the separate modal component */}
      <AddFundingModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        onFundingAdded={fetchData} 
      />
    </div>
  );
}

export default AdminAdvancedSearch;
