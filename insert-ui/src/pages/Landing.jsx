import { Link } from "react-router-dom";
import heroAvatar from "../assets/avatar.png";
import { useEffect, useState } from 'react'

function Slider({ images = [], interval = 4000 }){
  const [idx, setIdx] = useState(0)
  useEffect(()=>{
    if(!images.length) return
    const t = setInterval(()=> setIdx(i => (i+1) % images.length), interval)
    return ()=>clearInterval(t)
  },[images, interval])
  if(!images.length) return null
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-64 md:h-96">
        {images.map((src,i)=> (
          <img key={i} src={src} alt={`slide-${i}`} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i===idx? 'opacity-100' : 'opacity-0'}`} />
        ))}
      </div>
      <div className="flex justify-center gap-2 p-3 bg-black/30">
        {images.map((_,i)=> (
          <button key={i} onClick={()=>setIdx(i)} className={`w-3 h-3 rounded-full ${i===idx? 'bg-white' : 'bg-white/30'}`}></button>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center animate-fadeIn">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight gradient-title">
            Welcome to In$€₹T
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Your personal AI-powered financial companion. Track expenses, set goals,
            automate money rules, and visualize your financial health beautifully.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20"
            >
              Login
            </Link>
          </div>
        </div>

        {/* SLIDER */}
        <div className="flex justify-center">
          <Slider images={[
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1400&q=80&auto=format&fit=crop'
          ]} />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <h2 className="text-4xl font-bold text-center mb-12 tracking-wide">
          Why Choose <span className="gradient-title">In$€₹T</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[ 
            { title: "Smart Expense Tracking", img: 'https://picsum.photos/id/1011/800/800', text: "Automatically track and categorize your spending with AI precision." },
            { title: "Powerful Analytics", img: 'https://picsum.photos/id/1015/800/800', text: "Visualize your spending with charts, insights, and weekly trends." },
            { title: "Goals & Automation", img: 'https://picsum.photos/id/1025/800/800', text: "Set financial goals and automate custom rules with notifications." }
          ].map((card, i) => (
            <div key={i} className="card text-center p-8">
              <div className="w-24 h-24 mx-auto rounded-xl mb-4 shadow-lg overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="opacity-90 text-sm">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 gradient-title tracking-wide text-center">About Us</h2>

        <p className="max-w-3xl mx-auto text-center text-lg opacity-90">
          In$€₹T was created with a simple mission — make personal finance effortless
          and beautiful. Our team believes financial clarity should be accessible to
          everyone. With modern UI, automation, and deep analytics, In$€₹T helps you
          take control of your financial journey.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 px-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <h2 className="text-4xl font-bold text-center mb-8 gradient-title tracking-wide">
          Contact Us
        </h2>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-lg opacity-90 mb-4">Have questions or need support?</p>
          <p className="text-lg">📩 support@insert.app</p>
          <p className="text-lg">📞 +91 98765 43210</p>
        </div>
      </section>
    </div>
  );
}
