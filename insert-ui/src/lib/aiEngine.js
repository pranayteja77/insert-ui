// src/lib/aiEngine.js
// Lightweight heuristic AI engine for analytics and insights
export function analyzeFinancialProfile({ income = [], expenses = [], loans = [], goals = [] } = {}) {
  // If no data at all, return minimal safe defaults
  if (income.length === 0 && expenses.length === 0 && loans.length === 0 && goals.length === 0) {
    return {
      healthScore: 0,
      cashFlowRating: 'No data',
      riskLevel: 'No data',
      savingsRate: 0,
      emiBurden: 0,
      insights: ['Add income and expenses to unlock AI insights'],
      recommendations: ['Start by adding your first expense or income source'],
      charts: {
        projectionData: [],
        cashFlowSplits: { income: 0, expenses: 0, emis: 0 },
        goalProgress: []
      }
    };
  }

  // Helper sums
  const sum = (arr, key) => (arr || []).reduce((s, it) => s + (Number(it[key]) || 0), 0);

  const incomeTotal = sum(income, 'monthlyIncome') || sum(income, 'amount') || 0;
  const expenseTotal = sum(expenses, 'amount') || 0;
  const emiTotal = sum(loans, 'emiAmount') || sum(loans, 'amountPaid') || 0;

  const savings = incomeTotal - expenseTotal - emiTotal;
  const savingsRate = incomeTotal > 0 ? (savings / incomeTotal) : 0;

  // Cash flow rating
  let cashFlowRating = 'Negative cash flow';
  if (savingsRate > 0.3) cashFlowRating = 'Excellent saver';
  else if (savingsRate >= 0.15) cashFlowRating = 'Healthy';
  else if (savingsRate >= 0) cashFlowRating = 'Weak savings';

  // EMI burden
  const emiBurden = incomeTotal > 0 ? (emiTotal / incomeTotal) : 0;
  let emiLabel = 'Healthy EMI utilization';
  if (emiBurden > 0.5) emiLabel = 'Critical EMI stress';
  else if (emiBurden >= 0.3) emiLabel = 'High EMI load';
  else if (emiBurden >= 0.15) emiLabel = 'Moderate';

  // Spending behavior using category distribution
  const catTotals = {};
  (expenses || []).forEach(e => {
    const c = (e.category || 'Other').toLowerCase();
    catTotals[c] = (catTotals[c] || 0) + (Number(e.amount) || 0);
  });
  const totalCat = Object.values(catTotals).reduce((s, n) => s + n, 0) || 1;
  const pct = key => Math.round(((catTotals[key] || 0) / totalCat) * 100);

  const insights = [];
  const recommendations = [];

  // Savings insight
  insights.push(`Savings: ₹${Math.round(savings)}`);
  if (savingsRate > 0.3) recommendations.push('You are saving very well. Consider investing surplus for higher returns.');
  else if (savingsRate > 0 && savingsRate <= 0.15) recommendations.push('Increase savings rate to at least 15% to build a buffer.');
  else if (savingsRate <= 0 && incomeTotal > 0) recommendations.push('Your expenses exceed income — reduce discretionary spending immediately.');

  // EMI insights
  if (emiTotal > 0) {
    insights.push(`EMI burden: ${(emiBurden * 100).toFixed(1)}%`);
    if (emiBurden > 0.5) recommendations.push('EMI burden critical — consider refinancing or prepaying to reduce stress.');
    else if (emiBurden >= 0.3) recommendations.push('High EMI load — avoid new debt and prioritize high-interest loans.');
  }

  // Spending behaviour
  if (pct('food') > 20 && expenseTotal > 0) {
    insights.push('High food spending');
    recommendations.push('Cut dining out or plan groceries to save on food.');
  }
  if (pct('shopping') > 15 && expenseTotal > 0) {
    insights.push('High discretionary spending');
    recommendations.push('Limit shopping budgets and set weekly limits.');
  }
  if (pct('transport') > 15 && expenseTotal > 0) {
    insights.push('High transport costs');
    recommendations.push('Consider cheaper commute options or carpooling.');
  }

  // Goals progress
  const goalCharts = (goals || []).map(g => {
    const saved = Number(g.savedAmount) || 0;
    const target = Number(g.targetAmount) || 1;
    const progress = Math.min(1, saved / target);
    return { id: g.id || g.name, name: g.name || 'Goal', progress, saved, target };
  });

  goalCharts.forEach(g => {
    if (g.progress >= 0.8) recommendations.push(`${g.name} is on track.`);
    else if (g.progress >= 0.4) recommendations.push(`${g.name} needs improvement to meet target.`);
    else if (g.progress > 0) recommendations.push(`${g.name} is at risk — increase monthly contribution.`);
  });

  // Compose health score (0-100) - NO hardcoded base!
  let healthScore = 0;
  if (incomeTotal > 0) {
    healthScore = Math.round(savingsRate * 100 * 0.4); // Max 40 from savings
    healthScore -= Math.round(emiBurden * 100 * 0.3); // Max -30 from EMI
    // Penalize high discretionary spending
    if (pct('shopping') > 15) healthScore -= 5;
    healthScore = Math.max(0, Math.min(100, healthScore));
  } else if (expenses.length > 0) {
    // If only expenses exist (no income), health score is low
    healthScore = 20;
  }

  // Charts: projection mock (only if we have data)
  const projectionData = incomeTotal > 0 || expenses.length > 0
    ? Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const projectedSavings = Math.round(savings * (1 + i * 0.02));
        return { month: `M${month}`, savings: projectedSavings };
      })
    : [];

  const cashFlowSplits = {
    income: incomeTotal,
    expenses: expenseTotal,
    emis: emiTotal
  };

  return {
    healthScore,
    cashFlowRating,
    riskLevel: emiLabel,
    savingsRate,
    emiBurden,
    insights,
    recommendations,
    charts: {
      projectionData,
      cashFlowSplits,
      goalProgress: goalCharts
    }
  };
}