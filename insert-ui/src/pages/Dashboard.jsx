// src/pages/Dashboard.jsx
import { useExpenses } from '../context/ExpenseContext';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { analyzeFinancialProfile } from '../lib/aiEngine';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const { expenses, goals } = useExpenses();
  const total = expenses.reduce((a, b) => a + Number(b.amount), 0);

  const { income, loans } = useExpenses(); // 👈 Use income and loans from context
  const aiReport = analyzeFinancialProfile({ income, expenses, loans, goals });

  const { user } = useAuth();

  return (
    <main className='pt-28 max-w-6xl mx-auto p-6 text-white'>
      <section className="grid md:grid-cols-3 gap-6 items-stretch mb-8">
        <div className="col-span-2 card flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold gradient-title">
              Welcome back{user && user.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
            </h2>
            <p className="small-muted mt-2">Here's your financial snapshot</p>
          </div>
          <div className="mt-6 flex gap-4 items-center">
            <div>
              <div className="text-xs small-muted">Total Balance</div>
              <div className="text-3xl font-bold mt-1">₹{total}</div>
            </div>


          <div className="ml-auto w-36 h-36 bg-white/6 rounded-lg flex items-center justify-center">
            <Link to="/profile" className="block rounded-full overflow-hidden" aria-label="Open profile">
              {user && user.profile_picture_url ? (
                <img 
                  src={user.profile_picture_url} 
                  alt={user.full_name || 'avatar'} 
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-white/20" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold">
                  {(user && user.full_name) ? user.full_name.split(' ').map(s => s[0]).slice(0, 2).join('') : 'U'}
                </div>
              )}
            </Link>
          </div>
          </div>
          
          <div className="mt-6">
            <div className="flex flex-wrap gap-3">
              <Link to="/add" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">➕ Add Expense</Link>
              <Link to="/analytics" className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white">📈 Analytics</Link>
              <Link to="/goals" className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white">🎯 Goals</Link>
              <Link to="/income" className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white">💼 Income</Link>
              <Link to="/loans" className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white">🏦 Loans</Link>
              <Link to="/profile" className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white">👤 Profile</Link>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="header-title">AI Summary Preview</h3>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm small-muted">Health Score</div>
                <div className="text-2xl font-bold">{aiReport.healthScore}</div>
              </div>
              <div style={{width:100, height:80}}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      data={[
                        {name:'s', value: aiReport.savingsRate*100 || 0}, 
                        {name:'r', value: 100 - (aiReport.savingsRate*100 || 0)}
                      ]} 
                      dataKey="value" 
                      innerRadius={18} 
                      outerRadius={30} 
                      startAngle={90} 
                      endAngle={-270}
                    >
                      <Cell fill="#82ca9d" />
                      <Cell fill="#2b2b3a" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 small-muted text-sm">Top recommendations</div>
            {aiReport.recommendations.length > 0 ? (
              <ol className="mt-2 list-decimal ml-5 text-sm">
                {aiReport.recommendations.slice(0,3).map((r,i)=> <li key={i} className="text-slate-200">{r}</li>)}
              </ol>
            ) : (
              <p className="small-muted mt-2">No recommendations yet. Add your first expense to unlock AI insights.</p>
            )}

            <div className="mt-4">
              <div className="text-xs small-muted">Recent savings trend</div>
              {aiReport.charts.projectionData.length > 0 ? (
                <div style={{width:'100%', height:80}} className="mt-2">
                  <ResponsiveContainer>
                    <LineChart data={aiReport.charts.projectionData.slice(0,6)}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="savings" stroke="#82ca9d" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="small-muted mt-2">Insufficient data for trend analysis.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Expenses + Goals */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="header-title">Recent Expenses</h3>
          {expenses.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {expenses.map(e => (
                <li key={e.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm small-muted">{e.category} • {new Date(e.created).toLocaleDateString()}</div>
                  </div>
                  <div className="text-lg font-bold">₹{e.amount}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 small-muted">
              No expenses yet. <Link to="/add" className="text-indigo-300">Add your first expense</Link>
            </p>
          )}
        </div>

        <div className="card p-5">
          <h3 className="header-title">Active Goals</h3>
          {goals.length > 0 ? (
            <ul className="mt-3 space-y-4">
              {goals.map(gg => (
                <li key={gg.id} className="p-3 rounded-md bg-white/6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{gg.title}</div>
                      <div className="text-xs small-muted">
                        Target ₹{gg.limit} • Progress {gg.progress}%
                      </div>
                    </div>
                    <div className="font-bold">{gg.progress}%</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 small-muted">
              No active goals yet. <Link to="/goals" className="text-indigo-300">Create one</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}