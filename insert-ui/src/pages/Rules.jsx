import { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'

export default function Rules(){
  const { rules, setRules } = useExpenses()
  const [r,setR] = useState({ type:'amount', value:'', message:'' })
  const save = ()=> setRules([...rules, { ...r, id:Date.now().toString() } ])

  // Listen to triggers (simple global listener)
  if (typeof window !== 'undefined') {
    window.addEventListener('insert:rule', (e)=>{
      const { rule, exp } = e.detail
      if (Notification && Notification.permission !== 'granted') Notification.requestPermission()
      if (Notification.permission === 'granted') {
        new Notification('INSERT Rule Triggered', { body: rule.message + ' • ₹' + exp.amount })
      } else {
        alert(`Rule: ${rule.message} — Expense ₹${exp.amount}`)
      }
    })
  }

  return (
    <div className='pt-24 max-w-3xl mx-auto p-6'>
      <div className='card p-4'>
        <h1 className="text-2xl font-bold gradient-title mb-4">⚙️ Rules</h1>
        <h3 className='header-title'>Auto Rules</h3>
        <select className='input' onChange={e=>setR({...r,type:e.target.value})} value={r.type}>
          <option value='amount'>Amount</option>
          <option value='category'>Category</option>
        </select>
        <input className='input' placeholder='Trigger Value' onChange={e=>setR({...r,value:e.target.value})} />
        <input className='input' placeholder='Message' onChange={e=>setR({...r,message:e.target.value})} />
        <button className='btn' onClick={save}>Save Rule</button>
        <div className='mt-4'>
          <h4 className='small-muted'>Existing Rules</h4>
          <ul className='mt-2'>
            {rules.map(rr=> <li key={rr.id} className='p-2 border rounded my-1'>{rr.type} • {rr.value} — {rr.message}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
