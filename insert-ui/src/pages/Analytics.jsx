// src/pages/Analytics.jsx
import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext'; // ✅ Use real expense context
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { analyzeFinancialProfile } from '../lib/aiEngine';

export default function Analytics() {
  // ✅ Get real expenses from context (no more useAppData for now)
  const { expenses } = useExpenses();
  
  // For now, use empty arrays for income/loans/goals (since not implemented)
  const income = [];
  const loans = [];
  const goals = [];

  const ai = useMemo(() => analyzeFinancialProfile({ income, expenses, loans, goals }), [expenses]);

  // ✅ Only compute category data if expenses exist
  const byCategory = expenses.reduce((acc, e) => {
    const cat = e.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(e.amount || 0);
    return acc;
  }, {});

  const categoryData = Object.keys(byCategory).map(k => ({
    category: k,
    amount: byCategory[k]
  }));

  // ✅ Generate daily data from real expenses (group by day of week)
  const getDailyData = () => {
    if (expenses.length === 0) return [];
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMap = {};
    days.forEach(day => dayMap[day] = 0);
    
    expenses.forEach(exp => {
      const date = new Date(exp.created);
      const dayName = days[date.getDay()];
      dayMap[dayName] += Number(exp.amount);
    });
    
    return days.map(day => ({ day, amount: Math.round(dayMap[day]) }));
  };

  const dailyData = getDailyData();
  const COLORS = ["#9b5cff", "#ff4fd8", "#ff934f", "#00d4ff", "#baff4b"];

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="pt-24 max-w-6xl mx-auto p-6 animate-fadeIn text-white">
      <h1 className="text-3xl font-bold mb-6 gradient-title">📈 Analytics</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-5">
          <div className="header-title">Total Income</div>
          <div className="text-2xl font-bold mt-2">₹0</div> {/* Replace with real income later */}
        </div>
        <div className="card p-5">
          <div className="header-title">Total Expenses</div>
          <div className="text-2xl font-bold mt-2">₹{Math.round(totalExpenses)}</div>
        </div>
        <div className="card p-5">
          <div className="header-title">Health Score</div>
          <div className="text-2xl font-bold mt-2">{ai.healthScore}</div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg">No expense data yet.</p>
          <p className="small-muted mt-2">Add your first expense to see analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="header-title">Category Spend (bar)</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" stroke="#ddd"/>
                    <YAxis stroke="#ddd" />
                    <Tooltip />
                    <Bar dataKey="amount" radius={[8,8,0,0]}>
                      {categoryData.map((c, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="header-title">Weekly Trend</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={dailyData}>
                    <CartesianGrid stroke="#333" />
                    <XAxis dataKey="day" stroke="#ddd"/>
                    <YAxis stroke="#ddd" />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#ff77cc" strokeWidth={3}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card p-5 mt-6">
            <h3 className="header-title">Distribution (pie)</h3>
            <div style={{ width:'100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryData} dataKey="amount" nameKey="category" outerRadius={100} label>
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}