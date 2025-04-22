import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import AddFundingModal from './AddFundingModal';
import EditFundingModal from './EditFundingModal';

function AdminAdvancedSearch() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [rowData, setRowData] = useState({});
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/advanced-search');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(allResults);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = allResults.filter(item =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.propType.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        (item.funding && item.funding.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (item.valuation && item.valuation.toLowerCase().includes(lowerCaseSearchTerm))
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, allResults]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/fundings');
      const transformedData = response.data.map((item) => {
        const displayData = {
          id: item._id,
          name: item.Name || 'N/A',
          propType: item['Prop Type'] || 'N/A',
          funding: item['Total Funding'] || 'N/A',
          valuation: item['Latest Valuation'] || 'N/A',
          founded: item.Founded?.toString() || 'N/A',
          rounds: item['# of Funding Rounds']?.toString() || 'N/A',
          location: `${item.City || ''}, ${item.State || ''}`.trim() || 'N/A',
          estimatedARR: item['Estimated ARR'] || 'N/A',
          originalData: item
        };
        return displayData;
      });
      setAllResults(transformedData);
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

  const handleViewEditDetails = (funding) => {
    setSelectedFunding(funding);
    setShowEditModal(true);
  };

  const handleRowSelect = (row) => {
    if (selectedRow && selectedRow.id === row.id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(row);
    }
  };

  const handleQuickEditSelected = () => {
    if (selectedRow) {
      handleEdit(selectedRow);
    }
  };

  const handleFullDetailsSelected = () => {
    if (selectedRow) {
      handleViewEditDetails(selectedRow);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRow) {
      deleteRow(selectedRow.id);
    }
  };

  const handleChange = (e, field) => {
    setRowData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const saveRow = async (id) => {
    try {
      const updatedFields = {
        Name: rowData.name,
        'Prop Type': rowData.propType,
        'Total Funding': rowData.funding,
        'Latest Valuation': rowData.valuation,
        Founded: rowData.founded !== 'N/A' ? Number(rowData.founded) : undefined,
        '# of Funding Rounds': rowData.rounds !== 'N/A' ? Number(rowData.rounds) : undefined
      };

      if (rowData.location && rowData.location !== 'N/A') {
        const [city, state] = rowData.location.split(',').map(item => item.trim());
        if (city) updatedFields.City = city;
        if (state) updatedFields.State = state;
      }

      await axios.put(`http://localhost:5000/api/fundings/${id}`, updatedFields);
      setSearchResults(prev => prev.map(item =>
        item.id === id ? { ...item, ...rowData } : item
      ));
      setEditingRow(null);
    } catch (err) {
      console.error('Error updating data:', err);
      setError('Error updating entry.');
    }
  };

  const deleteRow = async (id) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/fundings/${id}`);
        setSearchResults(prev => prev.filter(item => item.id !== id));
        setEditingRow(null);
      } catch (err) {
        console.error('Error deleting record:', err);
        setError('Error deleting record. Please try again.');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Advanced Search</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <span className="mr-2">+</span> Add Funding Details
          </button>
          <button
            onClick={handleQuickEditSelected}
            disabled={!selectedRow}
            className={`py-2 px-4 rounded font-bold flex items-center ${
              selectedRow 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            Quick Edit
          </button>
          <button
            onClick={handleFullDetailsSelected}
            disabled={!selectedRow}
            className={`py-2 px-4 rounded font-bold flex items-center ${
              selectedRow 
                ? "bg-purple-500 hover:bg-purple-600 text-white" 
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            Full Details
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={!selectedRow}
            className={`py-2 px-4 rounded font-bold flex items-center ${
              selectedRow 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by company name, property type, location, funding, or valuation..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 border-t border-r border-b border-gray-300"
            >
              ✕
            </button>
          )}
          <div className="bg-blue-500 text-white px-4 py-2 rounded-r flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {selectedRow ? (
            <span className="text-blue-600 font-medium">
              Selected: {selectedRow.name} - Click on another row to change selection or click again to deselect
            </span>
          ) : (
            <span>
              {searchTerm 
                ? `Found ${searchResults.length} results for "${searchTerm}"` 
                : `Showing all ${searchResults.length} companies`} - Click on a row to select it
            </span>
          )}
        </div>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Company Name</th>
                <th className="px-4 py-2 text-left">Property Type</th>
                <th className="px-4 py-2 text-left">Total Funding</th>
                <th className="px-4 py-2 text-left">Valuation</th>
                <th className="px-4 py-2 text-left">Founded</th>
                <th className="px-4 py-2 text-left">Estimated ARR</th>
                <th className="px-4 py-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.length > 0 ? (
                searchResults.map(row => (
                  <tr 
                    key={row.id} 
                    onClick={() => !editingRow && handleRowSelect(row)}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedRow && selectedRow.id === row.id ? 'bg-blue-100' : ''
                    } ${editingRow === row.id ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="px-4 py-2">
                      {editingRow === row.id ? (
                        <input
                          value={rowData.name}
                          onChange={(e) => handleChange(e, 'name')}
                          className="border rounded px-2 py-1 w-full"
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
                          className="border rounded px-2 py-1 w-full"
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
                          className="border rounded px-2 py-1 w-full"
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
                          className="border rounded px-2 py-1 w-full"
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
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        row.founded
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingRow === row.id ? (
                        <input
                          value={rowData.estimatedARR}
                          onChange={(e) => handleChange(e, 'estimatedARR')}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        row.estimatedARR
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingRow === row.id ? (
                        <input
                          value={rowData.location}
                          onChange={(e) => handleChange(e, 'location')}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        row.location
                      )}
                    </td>
                    {editingRow === row.id && (
                      <td className="px-4 py-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => saveRow(row.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            title="Save changes"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRow(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                            title="Cancel changes"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No matching companies found. Try adjusting your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <AddFundingModal 
        showModal={showAddModal} 
        setShowModal={setShowAddModal} 
        onFundingAdded={fetchData} 
      />
      
      {selectedFunding && (
        <EditFundingModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          fundingData={selectedFunding}
          onFundingUpdated={fetchData}
        />
      )}
    </div>
  );
}

export default AdminAdvancedSearch;
