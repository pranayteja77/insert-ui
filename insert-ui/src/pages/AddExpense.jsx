// src/pages/AddExpense.jsx
import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

export default function AddExpense() {
  const { addExpense, loading } = useExpenses();
  const [form, setForm] = useState({ 
    title: '', 
    amount: '', 
    category: 'Food', 
    created: new Date().toISOString(), 
    otherDetail: '' 
  });

  const categoryOptions = [
    'Food','Groceries','Travel','Transport','Shopping','Bills',
    'Rent','Utilities','Entertainment','Health','Education',
    'Subscription','Insurance','Other'
  ];

  const submit = async () => {
    if (!form.title || !form.amount) {
      return alert('Please provide title and amount');
    }

    const payload = { 
      ...form, 
      amount: Number(form.amount),
      // Remove otherDetail since backend doesn't expect it
    };

    const result = await addExpense(payload);
    if (result) {
      setForm({ 
        title: '', 
        amount: '', 
        category: 'Food', 
        created: new Date().toISOString(), 
        otherDetail: '' 
      });
      alert('Expense added successfully!');
    }
  };

  return (
    <div className='pt-24 max-w-4xl mx-auto p-6'>
      <div className='card p-6'>
        <h2 className='text-xl font-bold mb-4'>Add Expense</h2>

        <div className='grid gap-3'>
          <input 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            className='input w-full' 
            placeholder='Title' 
          />
          <input 
            value={form.amount} 
            onChange={e => setForm({...form, amount: e.target.value})} 
            className='input w-full' 
            placeholder='Amount' 
            type='number' 
          />

          <label className='text-sm small-muted'>Category</label>
          <select 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})} 
            className='input w-full'
          >
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {form.category === 'Other' && (
            <div>
              <label className='text-sm small-muted'>Please describe</label>
              <input 
                value={form.otherDetail} 
                onChange={e => setForm({...form, otherDetail: e.target.value})} 
                className='input w-full' 
                placeholder='What is this expense?' 
              />
            </div>
          )}

          <div className='flex gap-3 mt-4'>
            <button 
              className='btn' 
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}