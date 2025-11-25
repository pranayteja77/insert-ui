// src/pages/Loans.jsx
import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

export default function Loans() {
  const { loans, addLoan, deleteLoan } = useExpenses();
  
  const [form, setForm] = useState({
    loanType: 'Personal Loan',
    lender: 'SBI', // Changed from 'provider' to match your DB column
    providerOther: '',
    accountNumber: '',
    totalAmount: '',
    amountPaid: '',
    interestRate: '',
    emiAmount: '',
    emiDueDay: '1',
    startDate: '',
    endDate: '',
    paymentMode: 'Auto-Debit (ECS)',
    status: 'Active',
    agreementUrl: '',
    scheduleUrl: '',
    bankStatementUrl: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // File will be uploaded on submit
  };

// src/pages/Loans.jsx
// Replace your uploadFile function with this:

const uploadFile = async (file, endpoint) => {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // ✅ Use the correct endpoint with authorization header
    const response = await fetch(`http://localhost:4000/api/upload/${endpoint}`, {
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
    console.error(`${endpoint} upload error:`, error);
    alert(`Failed to upload ${endpoint}: ${error.message}`);
    return null;
  }
};

  const submitLoan = async () => {
    if (!form.accountNumber) return alert('Please enter account number');
    if (!form.totalAmount || Number(form.totalAmount) <= 0) return alert('Please enter valid loan amount');
    if (!form.lender) return alert('Please select a provider');
    if (form.lender === 'Other' && !form.providerOther) return alert('Please enter provider name');

    try {
      const agreementFile = document.querySelector('#agreement-input')?.files?.[0];
      const scheduleFile = document.querySelector('#schedule-input')?.files?.[0];
      const bankStatementFile = document.querySelector('#bank-statement-input')?.files?.[0];
      
      let uploadedAgreement = form.agreementUrl;
      let uploadedSchedule = form.scheduleUrl;
      let uploadedBankStatement = form.bankStatementUrl;
      
      if (agreementFile) uploadedAgreement = await uploadFile(agreementFile, 'agreement');
      if (scheduleFile) uploadedSchedule = await uploadFile(scheduleFile, 'schedule');
      if (bankStatementFile) uploadedBankStatement = await uploadFile(bankStatementFile, 'bank-statement');
      
      if (uploadedAgreement === null || uploadedSchedule === null || uploadedBankStatement === null) return;

      const payload = {
        ...form,
        totalAmount: Number(form.totalAmount),
        amountPaid: form.amountPaid ? Number(form.amountPaid) : 0,
        remaining: Math.max(0, Number(form.totalAmount) - (Number(form.amountPaid) || 0)),
        interestRate: form.interestRate ? Number(form.interestRate) : 0,
        emiAmount: form.emiAmount ? Number(form.emiAmount) : 0,
        emiDueDay: Number(form.emiDueDay),
        agreementUrl: uploadedAgreement,
        scheduleUrl: uploadedSchedule,
        bankStatementUrl: uploadedBankStatement
      };

      await addLoan(payload);
      
      // Reset form
      setForm({
        loanType: 'Personal Loan',
        lender: 'SBI',
        providerOther: '',
        accountNumber: '',
        totalAmount: '',
        amountPaid: '',
        interestRate: '',
        emiAmount: '',
        emiDueDay: '1',
        startDate: '',
        endDate: '',
        paymentMode: 'Auto-Debit (ECS)',
        status: 'Active',
        agreementUrl: '',
        scheduleUrl: '',
        bankStatementUrl: ''
      });
      
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
      alert('Loan added successfully!');
    } catch (error) {
      console.error('Loan submission error:', error);
      alert('Failed to save loan. Please try again.');
    }
  };

  const removeLoan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this loan record?')) return;
    deleteLoan(id);
  };

  const loanTypeOptions = [
    'Personal Loan','Home Loan','Car Loan','Two-Wheeler Loan','Education Loan','Business Loan','Credit Card EMI','Consumer Durable Loan','Gold Loan','Other Loan'
  ];

  // Updated providers list to match your DB
  const providers = ['SBI','HDFC','ICICI','Axis','Kotak','Bajaj Finance','LIC','Tata Capital','IDFC First','Union Bank','Others'];

  return (
    <main className="pt-28 max-w-5xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Loans & EMIs</h2>

      {/* Add Loan Form */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Add New Loan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Loan Type</label>
            <select 
              name="loanType"
              value={form.loanType}
              onChange={handleInputChange}
              className="input w-full"
            >
              {loanTypeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Provider (Lender)</label>
            <select 
              name="lender"
              value={form.lender}
              onChange={handleInputChange}
              className="input w-full"
            >
              {providers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {form.lender === 'Other' && (
            <div>
              <label className="block text-sm small-muted mb-1">Provider Name</label>
              <input
                type="text"
                name="providerOther"
                value={form.providerOther}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Enter provider name"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Total Loan Amount (₹)</label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Amount Paid (₹)</label>
            <input
              type="number"
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter paid amount"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={form.interestRate}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter interest rate"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">EMI Amount (₹)</label>
            <input
              type="number"
              name="emiAmount"
              value={form.emiAmount}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter EMI amount"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">EMI Due Day</label>
            <select
              name="emiDueDay"
              value={form.emiDueDay}
              onChange={handleInputChange}
              className="input w-full"
            >
              {Array.from({length:31},(_,i)=>i+1).map(d => (
                <option key={d} value={String(d)}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleInputChange}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleInputChange}
              className="input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Payment Mode</label>
            <select
              name="paymentMode"
              value={form.paymentMode}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>Auto-Debit (ECS)</option>
              <option>UPI</option>
              <option>Net Banking</option>
              <option>Debit Card</option>
              <option>Credit Card</option>
              <option>Cash Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option>Active</option>
              <option>Closed</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm small-muted mb-1">Upload Agreement</label>
            <input
              type="file"
              id="agreement-input"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Upload Schedule</label>
            <input
              type="file"
              id="schedule-input"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm small-muted mb-1">Upload Bank Statement</label>
            <input
              type="file"
              id="bank-statement-input"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="input w-full"
            />
          </div>
        </div>

        <button className="btn" onClick={submitLoan}>Add Loan</button>
      </div>

      {/* Existing Loans */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Loans / EMI tracker</div>
        </div>

        {loans.length === 0 ? (
          <div className="small-muted">No loans added.</div>
        ) : (
          <div className="space-y-4">
            {loans.map(l => (
              <div key={l.id} className="p-4 rounded bg-white/6">
                {/* Use database column names (snake_case) */}
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="font-semibold">{l.loan_type}</div>
                  <div>
                    {l.lender}
                    {l.lender === 'Other' && l.provider_other && (
                      <div className="text-sm mt-1">{l.provider_other}</div>
                    )}
                  </div>
                  <div>Account: {l.account_number}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div>Total: ₹{l.total_amount?.toLocaleString()}</div>
                  <div>Paid: ₹{l.amount_paid?.toLocaleString()}</div>
                  <div>Remaining: ₹{l.remaining?.toLocaleString()}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div>Interest: {l.interest_rate}%</div>
                  <div>EMI: ₹{l.emi_amount?.toLocaleString()}</div>
                  <div>Due Day: {l.emi_due_day}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div>Start: {l.start_date ? new Date(l.start_date).toLocaleDateString() : 'N/A'}</div>
                  <div>End: {l.end_date ? new Date(l.end_date).toLocaleDateString() : 'N/A'}</div>
                  <div>Payment: {l.payment_mode}</div>
                </div>

                <div className="mt-3">
                  Status: <span className={`px-2 py-1 rounded ${
                    l.status === 'Active' ? 'bg-green-600' : 
                    l.status === 'Overdue' ? 'bg-red-600' : 'bg-gray-600'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {l.agreement_url && (
                    <a 
                      href={`http://localhost:4000${l.agreement_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline"
                    >
                      View Agreement
                    </a>
                  )}
                  {l.schedule_url && (
                    <a 
                      href={`http://localhost:4000${l.schedule_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline"
                    >
                      View Schedule
                    </a>
                  )}
                  {l.bank_statement_url && (
                    <a 
                      href={`http://localhost:4000${l.bank_statement_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline"
                    >
                      View Bank Statement
                    </a>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button 
                    className="px-3 py-1 rounded bg-red-600 text-white"
                    onClick={() => removeLoan(l.id)}
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