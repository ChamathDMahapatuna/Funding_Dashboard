import { useState } from 'react';
import axios from 'axios';

function AddFundingModal({ showModal, setShowModal, onFundingAdded }) {
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [fundingDetails, setFundingDetails] = useState({
    Name: '',
    Technology: '',
    'Prop Type': '',
    AngelList: '',
    Crunchbase: '',
    Domain: '',
    'HQ Address': '',
    City: '',
    State: '',
    Zip: '',
    '# Founders': '',
    Founded: '',
    'Years Active': '',
    '# of Funding Rounds': '',
    'Valuation Rank': '',
    'Funding/Year Rank': '',
    'Total Funding Rank': '',
    'ARR Rank': '',
    'CAFR Rank': '',
    Avg: {
      ' Funding/Year': ''
    },
    'ARR/Funds Raised': '',
    'Total Funding': '',
    'Estimated ARR': '',
    'CFRGR (Compound Funding Round Growth Rate)': '',
    CAFR: '',
    'Latest Valuation': '',
    'Latest Valuation Year': '',
    Accelerator: '',
    'Accelerator 2': '',
    'Pre-Seed Date': '',
    'Pre-Seed $': '',
    'Seed Date': '',
    'Seed $': '',
    'Bridge Date': '',
    'Bridge $': '',
    'A Round Date': '',
    'A Round $': '',
    'B Round Date': '',
    'B Round $': '',
    'C Round Date': '',
    'C Round $': '',
    'D Round Date': '',
    'D Round $': '',
    'E Round Date': '',
    'E Round $': '',
    'F Round Date': '',
    'F Round $': '',
    'G Round Date': '',
    'G Round $': '',
    'H Round Date': '',
    'H Round $': '',
    'Unknown Series Date': '',
    'Unknown Series $': '',
    'Non-Dilutive Round Date': '',
    'Non-Dilutive Round $': '',
    'Exit Date': '',
    'Exit $': '',
    Acquirer: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeSection, setActiveSection] = useState('company');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === ' Funding/Year') {
      setFundingDetails({
        ...fundingDetails,
        Avg: { ...fundingDetails.Avg, ' Funding/Year': value }
      });
    } else {
      setFundingDetails({
        ...fundingDetails,
        [name]: value
      });
    }
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
          'Years Active': fundingDetails['Years Active'] ? Number(fundingDetails['Years Active']) : undefined,
          '# of Funding Rounds': fundingDetails['# of Funding Rounds'] ? Number(fundingDetails['# of Funding Rounds']) : undefined,
          'Valuation Rank': fundingDetails['Valuation Rank'] ? Number(fundingDetails['Valuation Rank']) : undefined,
          'Funding/Year Rank': fundingDetails['Funding/Year Rank'] ? Number(fundingDetails['Funding/Year Rank']) : undefined,
          'Total Funding Rank': fundingDetails['Total Funding Rank'] ? Number(fundingDetails['Total Funding Rank']) : undefined,
          'Latest Valuation Year': fundingDetails['Latest Valuation Year'] ? Number(fundingDetails['Latest Valuation Year']) : undefined,
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
          AngelList: '',
          Crunchbase: '',
          Domain: '',
          'HQ Address': '',
          City: '',
          State: '',
          Zip: '',
          '# Founders': '',
          Founded: '',
          'Years Active': '',
          '# of Funding Rounds': '',
          'Valuation Rank': '',
          'Funding/Year Rank': '',
          'Total Funding Rank': '',
          'ARR Rank': '',
          'CAFR Rank': '',
          Avg: {
            ' Funding/Year': ''
          },
          'ARR/Funds Raised': '',
          'Total Funding': '',
          'Estimated ARR': '',
          'CFRGR (Compound Funding Round Growth Rate)': '',
          CAFR: '',
          'Latest Valuation': '',
          'Latest Valuation Year': '',
          Accelerator: '',
          'Accelerator 2': '',
          'Pre-Seed Date': '',
          'Pre-Seed $': '',
          'Seed Date': '',
          'Seed $': '',
          'Bridge Date': '',
          'Bridge $': '',
          'A Round Date': '',
          'A Round $': '',
          'B Round Date': '',
          'B Round $': '',
          'C Round Date': '',
          'C Round $': '',
          'D Round Date': '',
          'D Round $': '',
          'E Round Date': '',
          'E Round $': '',
          'F Round Date': '',
          'F Round $': '',
          'G Round Date': '',
          'G Round $': '',
          'H Round Date': '',
          'H Round $': '',
          'Unknown Series Date': '',
          'Unknown Series $': '',
          'Non-Dilutive Round Date': '',
          'Non-Dilutive Round $': '',
          'Exit Date': '',
          'Exit $': '',
          Acquirer: ''
        });

        setSubmitStatus({
          success: true,
          message: 'Funding details successfully added!'
        });

        // Notify parent component
        if (onFundingAdded) onFundingAdded();

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

  const renderFormSection = () => {
    switch(activeSection) {
      case 'company':
        return (
          <>
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  AngelList Profile
                </label>
                <input
                  type="text"
                  name="AngelList"
                  value={fundingDetails.AngelList}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Crunchbase Profile
                </label>
                <input
                  type="text"
                  name="Crunchbase"
                  value={fundingDetails.Crunchbase}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
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

            <div className="grid grid-cols-3 gap-4 mb-4">
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
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Zip
                </label>
                <input
                  type="text"
                  name="Zip"
                  value={fundingDetails.Zip}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  # Founders
                </label>
                <input
                  type="number"
                  name="# Founders"
                  value={fundingDetails['# Founders']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
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
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Years Active
              </label>
              <input
                type="number"
                name="Years Active"
                value={fundingDetails['Years Active']}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        );
      case 'funding':
        return (
          <>
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
                # of Funding Rounds
              </label>
              <input
                type="number"
                name="# of Funding Rounds"
                value={fundingDetails['# of Funding Rounds']}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Latest Valuation Year
              </label>
              <input
                type="number"
                name="Latest Valuation Year"
                value={fundingDetails['Latest Valuation Year']}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ARR/Funds Raised
                </label>
                <input
                  type="text"
                  name="ARR/Funds Raised"
                  value={fundingDetails['ARR/Funds Raised']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Average Funding/Year
                </label>
                <input
                  type="text"
                  name=" Funding/Year"
                  value={fundingDetails.Avg[' Funding/Year']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CFRGR (Compound Funding Round Growth Rate)
              </label>
              <input
                type="text"
                name="CFRGR (Compound Funding Round Growth Rate)"
                value={fundingDetails['CFRGR (Compound Funding Round Growth Rate)']}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CAFR
              </label>
              <input
                type="text"
                name="CAFR"
                value={fundingDetails.CAFR}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Valuation Rank
                </label>
                <input
                  type="number"
                  name="Valuation Rank"
                  value={fundingDetails['Valuation Rank']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Funding/Year Rank
                </label>
                <input
                  type="number"
                  name="Funding/Year Rank"
                  value={fundingDetails['Funding/Year Rank']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Total Funding Rank
                </label>
                <input
                  type="number"
                  name="Total Funding Rank"
                  value={fundingDetails['Total Funding Rank']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ARR Rank
                </label>
                <input
                  type="text"
                  name="ARR Rank"
                  value={fundingDetails['ARR Rank']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  CAFR Rank
                </label>
                <input
                  type="text"
                  name="CAFR Rank"
                  value={fundingDetails['CAFR Rank']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </>
        );
      case 'accelerator':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accelerator
              </label>
              <input
                type="text"
                name="Accelerator"
                value={fundingDetails.Accelerator}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accelerator 2
              </label>
              <input
                type="text"
                name="Accelerator 2"
                value={fundingDetails['Accelerator 2']}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        );
      case 'rounds':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Funding Rounds</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pre-Seed Date
                </label>
                <input
                  type="text"
                  name="Pre-Seed Date"
                  value={fundingDetails['Pre-Seed Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pre-Seed $
                </label>
                <input
                  type="text"
                  name="Pre-Seed $"
                  value={fundingDetails['Pre-Seed $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Seed Date
                </label>
                <input
                  type="text"
                  name="Seed Date"
                  value={fundingDetails['Seed Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Seed $
                </label>
                <input
                  type="text"
                  name="Seed $"
                  value={fundingDetails['Seed $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Bridge Date
                </label>
                <input
                  type="text"
                  name="Bridge Date"
                  value={fundingDetails['Bridge Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Bridge $
                </label>
                <input
                  type="text"
                  name="Bridge $"
                  value={fundingDetails['Bridge $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  A Round Date
                </label>
                <input
                  type="text"
                  name="A Round Date"
                  value={fundingDetails['A Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  A Round $
                </label>
                <input
                  type="text"
                  name="A Round $"
                  value={fundingDetails['A Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  B Round Date
                </label>
                <input
                  type="text"
                  name="B Round Date"
                  value={fundingDetails['B Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  B Round $
                </label>
                <input
                  type="text"
                  name="B Round $"
                  value={fundingDetails['B Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  C Round Date
                </label>
                <input
                  type="text"
                  name="C Round Date"
                  value={fundingDetails['C Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  C Round $
                </label>
                <input
                  type="text"
                  name="C Round $"
                  value={fundingDetails['C Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </>
        );
      case 'laterRounds':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Later Rounds</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  D Round Date
                </label>
                <input
                  type="text"
                  name="D Round Date"
                  value={fundingDetails['D Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  D Round $
                </label>
                <input
                  type="text"
                  name="D Round $"
                  value={fundingDetails['D Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  E Round Date
                </label>
                <input
                  type="text"
                  name="E Round Date"
                  value={fundingDetails['E Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  E Round $
                </label>
                <input
                  type="text"
                  name="E Round $"
                  value={fundingDetails['E Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  F Round Date
                </label>
                <input
                  type="text"
                  name="F Round Date"
                  value={fundingDetails['F Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  F Round $
                </label>
                <input
                  type="text"
                  name="F Round $"
                  value={fundingDetails['F Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  G Round Date
                </label>
                <input
                  type="text"
                  name="G Round Date"
                  value={fundingDetails['G Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  G Round $
                </label>
                <input
                  type="text"
                  name="G Round $"
                  value={fundingDetails['G Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  H Round Date
                </label>
                <input
                  type="text"
                  name="H Round Date"
                  value={fundingDetails['H Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  H Round $
                </label>
                <input
                  type="text"
                  name="H Round $"
                  value={fundingDetails['H Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </>
        );
      case 'other':
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Other Funding</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Unknown Series Date
                </label>
                <input
                  type="text"
                  name="Unknown Series Date"
                  value={fundingDetails['Unknown Series Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Unknown Series $
                </label>
                <input
                  type="text"
                  name="Unknown Series $"
                  value={fundingDetails['Unknown Series $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Non-Dilutive Round Date
                </label>
                <input
                  type="text"
                  name="Non-Dilutive Round Date"
                  value={fundingDetails['Non-Dilutive Round Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Non-Dilutive Round $
                </label>
                <input
                  type="text"
                  name="Non-Dilutive Round $"
                  value={fundingDetails['Non-Dilutive Round $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Exit Date
                </label>
                <input
                  type="text"
                  name="Exit Date"
                  value={fundingDetails['Exit Date']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Exit $
                </label>
                <input
                  type="text"
                  name="Exit $"
                  value={fundingDetails['Exit $']}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Acquirer
              </label>
              <input
                type="text"
                name="Acquirer"
                value={fundingDetails.Acquirer}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20 ${showModal ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Funding Details</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitStatus.message && (
          <div className={`p-3 mb-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitStatus.message}
          </div>
        )}

        <div className="mb-4">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveSection('company')}
              className={`px-4 py-2 ${activeSection === 'company' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Company Info
            </button>
            <button 
              onClick={() => setActiveSection('funding')}
              className={`px-4 py-2 ${activeSection === 'funding' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Funding Details
            </button>
            <button 
              onClick={() => setActiveSection('accelerator')}
              className={`px-4 py-2 ${activeSection === 'accelerator' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Accelerator
            </button>
            <button 
              onClick={() => setActiveSection('rounds')}
              className={`px-4 py-2 ${activeSection === 'rounds' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Early Rounds
            </button>
            <button 
              onClick={() => setActiveSection('laterRounds')}
              className={`px-4 py-2 ${activeSection === 'laterRounds' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Later Rounds
            </button>
            <button 
              onClick={() => setActiveSection('other')}
              className={`px-4 py-2 ${activeSection === 'other' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Other
            </button>
          </div>
        </div>

        <div className="overflow-y-auto pr-2 max-h-[50vh]">
          {renderFormSection()}
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFundingModal;
