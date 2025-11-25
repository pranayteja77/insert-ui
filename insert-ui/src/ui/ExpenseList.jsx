import { useExpenses } from '../context/ExpenseContext'
export default function ExpenseList(){
  const { expenses, deleteExpense } = useExpenses()
  if(!expenses.length) return <div className='text-sm text-slate-500'>No expenses yet — add one.</div>
  return (
    <ul className='space-y-2'>
      {expenses.map(e=> (
        <li key={e.id} className='p-3 rounded flex justify-between items-center border'>
          <div>
            <div className='font-semibold'>{e.title}</div>
            <div className='small-muted'>{e.category} • {new Date(e.created).toLocaleString()}</div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='font-bold'>₹{e.amount}</div>
            <button className='text-sm text-red-600' onClick={()=>deleteExpense(e.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
