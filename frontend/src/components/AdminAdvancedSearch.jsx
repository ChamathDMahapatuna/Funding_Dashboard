import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
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
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [fundingDetails, setFundingDetails] = useState({
    Name: '',
    Technology: '',
    'Prop Type': '',
    Domain: '',
    'HQ Address': '',
    City: '',
    State: '',
    Zip: '',
    '# Founders': '',
    Founded: '',
    'Total Funding': '',
    'Estimated ARR': '',
    'Latest Valuation': ''
  });
  const [formErrors, setFormErrors] = useState({});
  
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

  // New functions for Add Funding Details modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFundingDetails({
      ...fundingDetails,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!fundingDetails.Name?.trim()) errors.Name = 'Company name is required';
    if (!fundingDetails.Technology?.trim()) errors.Technology = 'Technology is required';
    if (!fundingDetails['Total Funding']?.trim()) errors['Total Funding'] = 'Total funding is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveFunding = async () => {
    if (validateForm()) {
      try {
        setSubmitStatus({ success: false, message: '' });

        const dataToSubmit = {
          ...fundingDetails,
          '# Founders': fundingDetails['# Founders'] ? Number(fundingDetails['# Founders']) : undefined,
          Founded: fundingDetails.Founded ? Number(fundingDetails.Founded) : undefined,
          Zip: fundingDetails.Zip ? fundingDetails.Zip : undefined
        };

        // Send to API
        const response = await axios.post('http://localhost:5000/api/fundings', dataToSubmit);

        console.log('Funding details saved:', response.data);

        // Reset form and show success message
        setFundingDetails({
          Name: '',
          Technology: '',
          'Prop Type': '',
          Domain: '',
          'HQ Address': '',
          City: '',
          State: '',
          Zip: '',
          '# Founders': '',
          Founded: '',
          'Total Funding': '',
          'Estimated ARR': '',
          'Latest Valuation': ''
        });

        setSubmitStatus({
          success: true,
          message: 'Funding details successfully added!'
        });

        // Refresh the table data
        fetchData();

        // Close modal after short delay to show success message
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus({ success: false, message: '' });
        }, 2000);

      } catch (error) {
        console.error('Error saving funding details:', error);
        setSubmitStatus({
          success: false,
          message: error.response?.data?.message || 'Error saving funding details. Please try again.'
        });
      }
    }
  };

  // Add Funding Details Modal Component
  const FundingModal = () => (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20 ${showModal ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Funding Details</h2>

        {submitStatus.message && (
          <div className={`p-3 mb-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitStatus.message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Company Name*
          </label>
          <input
            type="text"
            name="Name"
            value={fundingDetails.Name}
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.Name ? 'border-red-500' : ''}`}
          />
          {formErrors.Name && <p className="text-red-500 text-xs italic">{formErrors.Name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Technology*
          </label>
          <input
            type="text"
            name="Technology"
            value={fundingDetails.Technology}
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.Technology ? 'border-red-500' : ''}`}
          />
          {formErrors.Technology && <p className="text-red-500 text-xs italic">{formErrors.Technology}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Property Type
          </label>
          <input
            type="text"
            name="Prop Type"
            value={fundingDetails['Prop Type']}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              name="City"
              value={fundingDetails.City}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              State
            </label>
            <input
              type="text"
              name="State"
              value={fundingDetails.State}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Founded Year
          </label>
          <input
            type="number"
            name="Founded"
            value={fundingDetails.Founded}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Total Funding*
          </label>
          <input
            type="text"
            name="Total Funding"
            value={fundingDetails['Total Funding']}
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors['Total Funding'] ? 'border-red-500' : ''}`}
            placeholder="e.g. $10M"
          />
          {formErrors['Total Funding'] && <p className="text-red-500 text-xs italic">{formErrors['Total Funding']}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Latest Valuation
          </label>
          <input
            type="text"
            name="Latest Valuation"
            value={fundingDetails['Latest Valuation']}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g. $100M"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveFunding}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

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
      
      <FundingModal />
    </div>
  );
}

export default AdminAdvancedSearch;
