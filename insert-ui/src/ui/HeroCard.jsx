export default function HeroCard({ title, value, subtitle, imgUrl }){
  return (
    <div className='card p-4 flex flex-col justify-between' style={{ minHeight:150 }}>
      <div>
        <div className='small-muted'>{title}</div>
        <div className='text-2xl font-bold mt-2'>{value}</div>
        <div className='small-muted mt-2'>{subtitle}</div>
      </div>
      <div className='mt-3 flex justify-end'>
        <img src={imgUrl} alt='mock' className='w-20 h-20 object-cover rounded' />
      </div>
    </div>
  )
}
