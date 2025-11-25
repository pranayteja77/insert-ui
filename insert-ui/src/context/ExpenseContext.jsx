// src/context/ExpenseContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiCall } from './AuthContext';

const ExpenseContext = createContext();
export const useExpenses = () => useContext(ExpenseContext);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loans, setLoans] = useState([]);
  const [goals, setGoals] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFinancialData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [expensesRes, incomeRes, loansRes, goalsRes] = await Promise.all([
        apiCall('/api/financial/expenses'),
        apiCall('/api/financial/income'),
        apiCall('/api/financial/loans'),
        apiCall('/api/financial/goals')
      ]);

      if (expensesRes.ok && incomeRes.ok && loansRes.ok && goalsRes.ok) {
        setExpenses(await expensesRes.json());
        setIncome(await incomeRes.json());
        setLoans(await loansRes.json());
        setGoals(await goalsRes.json());
      }
    } catch (error) {
      console.error('Failed to load financial data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, [user]);

  // Save rules to localStorage (optional)
  useEffect(() => {
    localStorage.setItem('insert_rules', JSON.stringify(rules));
  }, [rules]);

  // Add expense to backend
  const addExpense = async (exp) => {
    if (!user) return;

    try {
      const response = await apiCall('/api/financial/expenses', {
        method: 'POST',
        body: JSON.stringify(exp),
      });

      if (response.ok) {
        const newExpense = await response.json();
        setExpenses(prev => [newExpense, ...prev]);
        return newExpense;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Failed to add expense', error);
      alert('Failed to save expense. Please try again.');
      throw error;
    }
  };

  // Add income to backend
  const addIncome = async (inc) => {
    if (!user) return;

    try {
      const response = await apiCall('/api/financial/income', {
        method: 'POST',
        body: JSON.stringify(inc),
      });

      if (response.ok) {
        const newIncome = await response.json();
        setIncome(prev => [newIncome, ...prev]);
        return newIncome;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save income');
      }
    } catch (error) {
      console.error('Failed to add income', error);
      alert('Failed to save income. Please try again.');
      throw error;
    }
  };

  // Add loan to backend
  const addLoan = async (loan) => {
    if (!user) return;

    try {
      const response = await apiCall('/api/financial/loans', {
        method: 'POST',
        body: JSON.stringify(loan),
      });

      if (response.ok) {
        const newLoan = await response.json();
        setLoans(prev => [newLoan, ...prev]);
        return newLoan;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save loan');
      }
    } catch (error) {
      console.error('Failed to add loan', error);
      alert('Failed to save loan. Please try again.');
      throw error;
    }
  };

  // Add goal to backend
  const addGoal = async (goal) => {
    if (!user) return;

    try {
      const response = await apiCall('/api/financial/goals', {
        method: 'POST',
        body: JSON.stringify(goal),
      });

      if (response.ok) {
        const newGoal = await response.json();
        setGoals(prev => [{ ...newGoal, progress: 0 }, ...prev]);
        return newGoal;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save goal');
      }
    } catch (error) {
      console.error('Failed to add goal', error);
      alert('Failed to save goal. Please try again.');
      throw error;
    }
  };

  // Delete functions
  const deleteExpense = (id) => setExpenses(prev => prev.filter(p => p.id !== id));
  const deleteIncome = (id) => setIncome(prev => prev.filter(i => i.id !== id));
  const deleteLoan = (id) => setLoans(prev => prev.filter(l => l.id !== id));
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  // Save rule (UI-only)
  const saveRule = (rule) => {
    setRules(prev => [{ ...rule, id: Date.now().toString() }, ...prev]);
  };

  // Trigger rules (UI-only)
  const triggerRules = (exp) => {
    rules.forEach((rule) => {
      if (rule.type === 'amount' && Number(exp.amount) >= Number(rule.value)) {
        window.dispatchEvent(new CustomEvent('insert:rule', { detail: { rule, exp } }));
      }
      if (rule.type === 'category' && exp.category === rule.value) {
        window.dispatchEvent(new CustomEvent('insert:rule', { detail: { rule, exp } }));
      }
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        income,
        addIncome,
        deleteIncome,
        loans,
        addLoan,
        deleteLoan,
        goals,
        addGoal,
        deleteGoal,
        setGoals,
        rules,
        saveRule,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}