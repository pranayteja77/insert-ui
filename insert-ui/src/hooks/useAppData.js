import { useEffect, useState, useMemo, useCallback } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { useAuth } from '../context/AuthContext'

function safeRead(key){ try{ return JSON.parse(localStorage.getItem(key) || '[]') }catch(e){ return [] } }

export default function useAppData(){
  const { expenses } = useExpenses()
  const { user } = useAuth()

  const [income, setIncome] = useState(()=> safeRead('insert_incomes'))
  const [loans, setLoans] = useState(()=> safeRead('insert_loans'))
  const [goals, setGoals] = useState(()=> safeRead('insert_goals'))

  // helpers that persist and update state
  const persist = useCallback((key, value, setter)=>{
    try{ localStorage.setItem(key, JSON.stringify(value)) }catch(e){}
    if(typeof setter === 'function') setter(value)
  }, [])

  const setIncomes = useCallback((next)=> persist('insert_incomes', next, setIncome), [persist])
  const setLoansList = useCallback((next)=> persist('insert_loans', next, setLoans), [persist])
  const setGoalsList = useCallback((next)=> persist('insert_goals', next, setGoals), [persist])

  // storage listener for cross-tab updates
  useEffect(()=>{
    const onStorage = (e)=>{
      if(!e.key) return
      if(e.key === 'insert_incomes') setIncome(safeRead('insert_incomes'))
      if(e.key === 'insert_loans') setLoans(safeRead('insert_loans'))
      if(e.key === 'insert_goals') setGoals(safeRead('insert_goals'))
      if(e.key === 'insert_expenses') {
        // expenses come from context; do nothing here
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return useMemo(()=>({
    income,
    expenses,
    loans,
    goals,
    user,
    setIncomes,
    setLoansList,
    setGoalsList
  }), [income, expenses, loans, goals, user, setIncomes, setLoansList, setGoalsList])
}
