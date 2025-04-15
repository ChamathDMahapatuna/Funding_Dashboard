import { useState } from 'react';
import { fundingAPI } from '../services/api';

function AddFundingDetails() {
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

        // Use the API service
        const response = await fundingAPI.create(dataToSubmit);

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

  return (
    <>
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Funding Details
        </button>
      </div>

      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20 ${showModal ? '' : 'hidden'}`}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add Funding Details</h2>

          {submitStatus.message && (
            <div className={`p-3 mb-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitStatus.message}
            </div>
          )}

          {/* Form fields for funding details */}
          {/* ...existing form fields code... */}

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
    </>
  );
}

export default AddFundingDetails;
