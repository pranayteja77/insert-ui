// src/pages/AiInsights.jsx
import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext'; // ✅ Use real context
import { analyzeFinancialProfile } from '../lib/aiEngine';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff7f7f','#a28ff5'];

export default function AiInsights() {
  const { expenses } = useExpenses();
  
  // Use empty arrays for unimplemented features
  const income = [];
  const loans = [];
  const goals = [];

  const report = useMemo(() => 
    analyzeFinancialProfile({ income, expenses, loans, goals }), 
    [expenses]
  );

  // Only show radar if there's real data
  const hasData = expenses.length > 0;

  const radar = hasData ? [
    { subject: 'Savings', A: Math.round((report.savingsRate || 0) * 100) },
    { subject: 'Spending', A: Math.min(100, Math.round((report.insights.filter(i => i.includes('High')).length || 0) * 33)) },
    { subject: 'EMI', A: Math.round((report.emiBurden || 0) * 100) },
    { subject: 'Goals', A: goals.length ? Math.round((goals.reduce((s, g) => s + g.progress, 0) / goals.length) * 100) : 0 },
    { subject: 'Stability', A: Math.round(report.healthScore) }
  ] : [];

  const cashData = hasData ? [
    { name: 'Income', value: report.charts.cashFlowSplits.income || 0 },
    { name: 'Expenses', value: report.charts.cashFlowSplits.expenses || 0 },
    { name: 'EMIs', value: report.charts.cashFlowSplits.emis || 0 }
  ].filter(item => item.value > 0) : [];

  return (
    <main className="pt-28 max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">AI Insights</h2>

      {!hasData ? (
        <div className="card p-12 text-center">
          <p className="text-lg">No financial data yet.</p>
          <p className="small-muted mt-2">Add expenses to unlock AI insights.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <div className="text-sm small-muted">Financial Health Score</div>
              <div className="text-3xl font-bold mt-2">{report.healthScore}</div>
            </div>
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <div className="text-sm small-muted">Cash Flow Rating</div>
              <div className="text-2xl font-bold mt-2">{report.cashFlowRating}</div>
            </div>
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <div className="text-sm small-muted">EMI Stress</div>
              <div className="text-2xl font-bold mt-2">{report.riskLevel}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-3">Top Recommendations</h3>
              {report.recommendations.length > 0 ? (
                <ul className="list-disc ml-5 space-y-2">
                  {report.recommendations.slice(0, 6).map((r, i) => (
                    <li key={i} className="small-muted">{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="small-muted">No recommendations yet.</p>
              )}
            </div>

            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-3">Behavioral Radar</h3>
              {radar.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius={90} data={radar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="You" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="small-muted text-center mt-8">Insufficient data for radar chart.</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-3">Cash Flow Allocation</h3>
              {cashData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={cashData} dataKey="value" nameKey="name" outerRadius={80}>
                      {cashData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="small-muted text-center mt-8">No cash flow data available.</p>
              )}
            </div>

            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10">
              <h3 className="font-semibold mb-3">AI Insights</h3>
              {report.insights.length > 0 ? (
                <ul className="list-disc ml-5 space-y-2">
                  {report.insights.map((it, i) => (
                    <li key={i} className="small-muted">{it}</li>
                  ))}
                </ul>
              ) : (
                <p className="small-muted">No insights generated yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}