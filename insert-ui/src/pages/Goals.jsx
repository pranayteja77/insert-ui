import { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'

export default function Goals(){
  const { goals, setGoals } = useExpenses()
  const [g,setG] = useState({ title:'', limit:'' })
  const save = ()=> setGoals([...goals, { ...g, id:Date.now().toString(), progress:0 } ])

  return (
    <div className='pt-24 max-w-4xl mx-auto p-6'>
      <div className='grid grid-cols-2 gap-6'>
        <div className='card p-4'>
          <h1 className="text-2xl font-bold gradient-title mb-4">🎯 Goals</h1>
          <h3 className='header-title'>Create Goal</h3>
          <input className='input w-full' placeholder='Goal Title' onChange={e=>setG({...g,title:e.target.value})} />
          <input className='input w-full' placeholder='Amount' onChange={e=>setG({...g,limit:e.target.value})} />
          <button className='btn mt-2' onClick={save}>Save Goal</button>
        </div>
        <div className='card p-4'>
          <h3 className='header-title'>Your Goals</h3>
          <ul className='mt-3 space-y-2'>
            {goals.map(gg=> (
              <li key={gg.id} className='p-3 border rounded flex justify-between items-center'>
                <div>
                  <div className='font-semibold'>{gg.title}</div>
                  <div className='small-muted'>Target: ₹{gg.limit}</div>
                </div>
                <div>{gg.progress}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
