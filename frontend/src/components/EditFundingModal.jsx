import { useState, useEffect } from 'react';
import axios from 'axios';

function EditFundingModal({ showModal, setShowModal, fundingData, onFundingUpdated }) {
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [fundingDetails, setFundingDetails] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (fundingData && fundingData.id) {
      fetchFullFundingDetails(fundingData.id);
    }
  }, [fundingData]);

  const fetchFullFundingDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/fundings/${id}`);
      setFundingDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching funding details', error);
      setSubmitStatus({
        success: false,
        message: 'Error loading funding details. Please try again.'
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFundingDetails(prev => ({
      ...prev,
      [name]: value
    }));
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

        // Convert numeric string fields to numbers
        const dataToSubmit = {
          ...fundingDetails,
          '# Founders': fundingDetails['# Founders'] ? Number(fundingDetails['# Founders']) : undefined,
          Founded: fundingDetails.Founded ? Number(fundingDetails.Founded) : undefined,
          'Years Active': fundingDetails['Years Active'] ? Number(fundingDetails['Years Active']) : undefined,
          '# of Funding Rounds': fundingDetails['# of Funding Rounds'] ? Number(fundingDetails['# of Funding Rounds']) : undefined,
          'Valuation Rank': fundingDetails['Valuation Rank'] ? Number(fundingDetails['Valuation Rank']) : undefined,
          'Funding/Year Rank': fundingDetails['Funding/Year Rank'] ? Number(fundingDetails['Funding/Year Rank']) : undefined,
          'Total Funding Rank': fundingDetails['Total Funding Rank'] ? Number(fundingDetails['Total Funding Rank']) : undefined,
          'Latest Valuation Year': fundingDetails['Latest Valuation Year'] ? Number(fundingDetails['Latest Valuation Year']) : undefined,
          Zip: fundingDetails.Zip ? fundingDetails.Zip : undefined
        };

        // Send to API
        const response = await axios.put(`http://localhost:5000/api/fundings/${fundingDetails._id}`, dataToSubmit);

        setSubmitStatus({
          success: true,
          message: 'Funding details successfully updated!'
        });

        // Notify parent component to refresh data
        if (onFundingUpdated) onFundingUpdated();

        // Close modal after short delay to show success message
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus({ success: false, message: '' });
        }, 2000);

      } catch (error) {
        console.error('Error updating funding details:', error);
        setSubmitStatus({
          success: false,
          message: error.response?.data?.message || 'Error updating funding details. Please try again.'
        });
      }
    }
  };

  // Group related fields for better organization
  const fieldGroups = [
    {
      title: "Basic Information",
      fields: [
        { name: "Name", label: "Company Name", required: true },
        { name: "Technology", label: "Technology", required: true },
        { name: "Prop Type", label: "Property Type" },
        { name: "Domain", label: "Domain" },
        { name: "Founded", label: "Founded Year", type: "number" },
        { name: "# Founders", label: "Number of Founders", type: "number" },
        { name: "Years Active", label: "Years Active", type: "number" }
      ]
    },
    {
      title: "Location",
      fields: [
        { name: "HQ Address", label: "HQ Address" },
        { name: "City", label: "City" },
        { name: "State", label: "State" },
        { name: "Zip", label: "Zip Code" }
      ]
    },
    {
      title: "Financial Information",
      fields: [
        { name: "Total Funding", label: "Total Funding", required: true },
        { name: "Estimated ARR", label: "Estimated ARR" },
        { name: "Latest Valuation", label: "Latest Valuation" },
        { name: "Latest Valuation Year", label: "Latest Valuation Year", type: "number" },
        { name: "# of Funding Rounds", label: "Number of Funding Rounds", type: "number" }
      ]
    },
    {
      title: "Rankings",
      fields: [
        { name: "Valuation Rank", label: "Valuation Rank", type: "number" },
        { name: "Funding/Year Rank", label: "Funding/Year Rank", type: "number" },
        { name: "Total Funding Rank", label: "Total Funding Rank", type: "number" },
        { name: "ARR Rank", label: "ARR Rank" },
        { name: "CAFR Rank", label: "CAFR Rank" }
      ]
    },
    {
      title: "Other Metrics",
      fields: [
        { name: "Avg. Funding/Year", label: "Avg. Funding/Year", path: ["Avg", " Funding/Year"] },
        { name: "ARR/Funds Raised", label: "ARR/Funds Raised" },
        { name: "CFRGR (Compound Funding Round Growth Rate)", label: "CFRGR" },
        { name: "CAFR", label: "CAFR" }
      ]
    },
    {
      title: "Funding Rounds",
      fields: [
        { name: "Pre-Seed Date", label: "Pre-Seed Date" },
        { name: "Pre-Seed $", label: "Pre-Seed Amount" },
        { name: "Seed Date", label: "Seed Date" },
        { name: "Seed $", label: "Seed Amount" },
        { name: "Bridge Date", label: "Bridge Date" },
        { name: "Bridge $", label: "Bridge Amount" },
        { name: "A Round Date", label: "Series A Date" },
        { name: "A Round $", label: "Series A Amount" },
        { name: "B Round Date", label: "Series B Date" },
        { name: "B Round $", label: "Series B Amount" },
        { name: "C Round Date", label: "Series C Date" },
        { name: "C Round $", label: "Series C Amount" },
        { name: "D Round Date", label: "Series D Date" },
        { name: "D Round $", label: "Series D Amount" },
        { name: "E Round Date", label: "Series E Date" },
        { name: "E Round $", label: "Series E Amount" },
        { name: "F Round Date", label: "Series F Date" },
        { name: "F Round $", label: "Series F Amount" },
        { name: "G Round Date", label: "Series G Date" },
        { name: "G Round $", label: "Series G Amount" },
        { name: "H Round Date", label: "Series H Date" },
        { name: "H Round $", label: "Series H Amount" },
        { name: "Unknown Series Date", label: "Unknown Series Date" },
        { name: "Unknown Series $", label: "Unknown Series Amount" },
        { name: "Non-Dilutive Round Date", label: "Non-Dilutive Round Date" },
        { name: "Non-Dilutive Round $", label: "Non-Dilutive Round Amount" },
      ]
    },
    {
      title: "Exit Information",
      fields: [
        { name: "Exit Date", label: "Exit Date" },
        { name: "Exit $", label: "Exit Amount" },
        { name: "Acquirer", label: "Acquirer" }
      ]
    },
    {
      title: "External Links",
      fields: [
        { name: "AngelList", label: "AngelList" },
        { name: "Crunchbase", label: "Crunchbase" },
        { name: "Accelerator", label: "Accelerator" },
        { name: "Accelerator 2", label: "Accelerator 2" }
      ]
    }
  ];

  // Function to get nested field value
  const getFieldValue = (field, details) => {
    if (field.path) {
      let value = details;
      for (const key of field.path) {
        value = value?.[key];
      }
      return value || "";
    }
    return details[field.name] || "";
  };

  // Function to render a form field
  const renderField = (field) => {
    const fieldValue = getFieldValue(field, fundingDetails);
    const fieldError = formErrors[field.name];
    
    return (
      <div key={field.name} className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {field.label}{field.required && "*"}
        </label>
        <input
          type={field.type || "text"}
          name={field.name}
          value={fieldValue}
          onChange={handleInputChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldError ? 'border-red-500' : ''}`}
          placeholder={field.placeholder || ""}
        />
        {fieldError && <p className="text-red-500 text-xs italic">{fieldError}</p>}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20 ${showModal ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit All Funding Details</h2>
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {submitStatus.message && (
          <div className={`p-3 mb-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitStatus.message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <p>Loading funding details...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fieldGroups.map((group) => (
                <div key={group.title} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-1">{group.title}</h3>
                  <div className="space-y-2">
                    {group.fields.map(field => renderField(field))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
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
                Save All Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditFundingModal;
