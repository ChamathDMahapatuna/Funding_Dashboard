import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        navigate('/admin/advanced-search');
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFundingDetails({
      ...fundingDetails,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!fundingDetails.Name.trim()) errors.Name = 'Company name is required';
    if (!fundingDetails.Technology.trim()) errors.Technology = 'Technology is required';
    if (!fundingDetails['Total Funding'].trim()) errors['Total Funding'] = 'Total funding is required';

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

        const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/fundings`, dataToSubmit);

        console.log('Funding details saved:', response.data);

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

  const AddFundingButton = () => (
    <div className="fixed top-4 right-4 z-10">
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Funding Details
      </button>
    </div>
  );

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

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Domain
          </label>
          <input
            type="text"
            name="Domain"
            value={fundingDetails.Domain}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            HQ Address
          </label>
          <input
            type="text"
            name="HQ Address"
            value={fundingDetails['HQ Address']}
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              name="Zip"
              value={fundingDetails.Zip}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              # of Founders
            </label>
            <input
              type="number"
              name="# Founders"
              value={fundingDetails['# Founders']}
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
            Estimated ARR
          </label>
          <input
            type="text"
            name="Estimated ARR"
            value={fundingDetails['Estimated ARR']}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g. $5M"
          />
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </div>
      </form>

      {localStorage.getItem('isAuthenticated') === 'true' && <AddFundingButton />}

      <FundingModal />
    </div>
  );
}

export default AdminLogin;
