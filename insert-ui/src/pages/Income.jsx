// src/pages/Income.jsx
import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const companyOptions = [
  'IT & Technology','TCS','Infosys','Wipro','HCL Technologies','Tech Mahindra','Cognizant','Accenture','Capgemini','IBM','Deloitte','EY','KPMG','PwC','Oracle','Microsoft','Google','Amazon','Meta','Zoho','LTIMindtree','Mphasis','Persistent','SAP','Virtusa','Mindtree','Hexaware',
  'Banks / Finance','SBI','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Yes Bank','IDFC First Bank','Bank of Baroda','RBI','LIC','Bajaj Finance','HDFC Life','Zerodha',
  'Product Companies','Reliance','Tata Motors','Tata Steel','Asian Paints','Maruti Suzuki','Mahindra','Adani Group','JSW','Hindustan Unilever','ITC',
  'Startups / Unicorns','Swiggy','Zomato','Paytm','Razorpay','PhonePe','Ola','OYO','Freshworks','Byju\'s','Meesho','Others','Government','PSU','Railway','Healthcare','Education Institute','Other'
];

export default function Income(){
  const { income, addIncome, deleteIncome } = useExpenses();
  const [form, setForm] = useState({
    type: 'Monthly Salary',
    company: '',
    company_other: '', // Changed to match DB column
    monthly_income: '', // Changed to match DB column
    frequency: 'Monthly',
    salary_credit_date: '', // Changed to match DB column
    mode_of_credit: 'Bank Transfer', // Changed to match DB column
    bank_receiving: 'SBI', // Changed to match DB column
    employment_type: 'Full-time', // Changed to match DB column
    industry: 'IT',
    bonus: '',
    incentives: '',
    additional_monthly: '', // Changed to match DB column
    payslip_url: '' // Changed to match DB column
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // File will be uploaded on submit
  };

// src/pages/Income.jsx  
// Replace your uploadPayslip function with this:

const uploadPayslip = async (file) => {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // ✅ Use the correct endpoint with authorization header
    const response = await fetch('http://localhost:4000/api/upload/payslip', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('insert_token')}`
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }
    
    const result = await response.json();
    return result.url; // ✅ Cloudinary URL
  } catch (error) {
    console.error('Payslip upload error:', error);
    alert(`Failed to upload payslip: ${error.message}`);
    return null;
  }
};
// In Income.jsx, update the submit function to handle empty values
const submit = async () => {
  if (!form.monthly_income) return alert('Please provide monthly income amount');
  if (!form.type) return alert('Please select income type');
  if (!form.company) return alert('Please select company/employer');

  try {
    let payslipUrl = form.payslip_url;
    const payslipInput = document.querySelector('#payslip-input');
    if (payslipInput?.files?.[0]) {
      payslipUrl = await uploadPayslip(payslipInput.files[0]);
      if (payslipUrl === null) return;
    }

    // Convert empty strings to 0
    const monthlyIncome = form.monthly_income ? Number(form.monthly_income) : 0;
    const bonus = form.bonus ? Number(form.bonus) : 0;
    const incentives = form.incentives ? Number(form.incentives) : 0;
    const additionalMonthly = form.additional_monthly ? Number(form.additional_monthly) : 0;

    const payload = {
      ...form,
      monthly_income: monthlyIncome,
      bonus: bonus,
      incentives: incentives,
      additional_monthly: additionalMonthly,
      payslip_url: payslipUrl
    };

    await addIncome(payload);
    
    // Reset form
    setForm({
      type: 'Monthly Salary',
      company: '',
      company_other: '',
      monthly_income: '',
      frequency: 'Monthly',
      salary_credit_date: '',
      mode_of_credit: 'Bank Transfer',
      bank_receiving: 'SBI',
      employment_type: 'Full-time',
      industry: 'IT',
      bonus: '',
      incentives: '',
      additional_monthly: '',
      payslip_url: ''
    });
    
    if (payslipInput) payslipInput.value = '';
    alert('Income added successfully!');
  } catch (error) {
    console.error('Income submission error:', error);
    alert('Failed to save income. Please try again.');
  }
};

  const removeIncome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;
    deleteIncome(id);
  };

  return (
    <main className="pt-28 max-w-5xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Income & Sources</h2>

      {/* Add Income Form */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Add New Income</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Income Type</label>
            <select 
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>Monthly Salary</option>
              <option>Freelancing</option>
              <option>Business Income</option>
              <option>Rental Income</option>
              <option>Dividends / Investments</option>
              <option>Commission</option>
              <option>Pension</option>
              <option>Consulting Income</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Company / Employer</label>
            <select 
              name="company"
              value={form.company}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option value="">Select Company / Employer</option>
              {companyOptions.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {form.company === 'Other' && (
            <div>
              <label className="block text-sm small-muted mb-1">Company Name</label>
              <input
                type="text"
                name="company_other"
                value={form.company_other}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Enter company name"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Monthly Income (₹)</label>
            <input
              type="number"
              name="monthly_income"
              value={form.monthly_income}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Frequency</label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Salary Credit Date</label>
            <input
              type="date"
              name="salary_credit_date"
              value={form.salary_credit_date}
              onChange={handleInputChange}
              className="input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Mode of Credit</label>
            <select
              name="mode_of_credit"
              value={form.mode_of_credit}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Cheque</option>
              <option>UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Bank Receiving</label>
            <select
              name="bank_receiving"
              value={form.bank_receiving}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>SBI</option>
              <option>HDFC</option>
              <option>ICICI</option>
              <option>Axis</option>
              <option>Kotak</option>
              <option>Canara</option>
              <option>Union Bank</option>
              <option>PNB</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Employment Type</label>
            <select
              name="employment_type"
              value={form.employment_type}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Self-employed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Industry</label>
            <select
              name="industry"
              value={form.industry}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>IT</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Retail</option>
              <option>Government</option>
              <option>Manufacturing</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Bonus Amount (₹)</label>
            <input
              type="number"
              name="bonus"
              value={form.bonus}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Incentives (₹)</label>
            <input
              type="number"
              name="incentives"
              value={form.incentives}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm small-muted mb-1">Additional Monthly Income (₹)</label>
          <input
            type="number"
            name="additional_monthly"
            value={form.additional_monthly}
            onChange={handleInputChange}
            className="input w-full"
            placeholder="Optional"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm small-muted mb-1">Upload Payslip</label>
          <input
            type="file"
            id="payslip-input"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="input w-full"
          />
        </div>

        <button className="btn" onClick={submit}>Add Income</button>
      </div>

      {/* Existing Income Records */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Income Records</div>
        </div>

        {income.length === 0 ? (
          <div className="small-muted">No income records yet.</div>
        ) : (
          <div className="space-y-4">
            {income.map(item => (
              <div key={item.id} className="p-4 rounded bg-white/6">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="font-semibold">{item.type}</div>
                  <div>
                    {item.company}
                    {item.company === 'Other' && item.company_other && (
                      <div className="text-sm mt-1">{item.company_other}</div>
                    )}
                  </div>
                  <div>₹{item.monthly_income?.toLocaleString()}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div>Frequency: {item.frequency}</div>
                  <div>Bank: {item.bank_receiving}</div>
                  <div>Employment: {item.employment_type}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div>Industry: {item.industry}</div>
                  {item.bonus > 0 && <div>Bonus: ₹{item.bonus?.toLocaleString()}</div>}
                  {item.incentives > 0 && <div>Incentives: ₹{item.incentives?.toLocaleString()}</div>}
                </div>

                {item.additional_monthly > 0 && (
                  <div className="mt-3">
                    Additional: ₹{item.additional_monthly?.toLocaleString()}
                  </div>
                )}

                {item.payslip_url && (
                  <div className="mt-3">
                    <a 
                      href={`http://localhost:4000${item.payslip_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline"
                    >
                      View Payslip
                    </a>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button 
                    className="px-3 py-1 rounded bg-red-600 text-white"
                    onClick={() => removeIncome(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}