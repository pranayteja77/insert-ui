// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const route = useLocation().pathname;
  const { user } = useAuth();

  const menu = user ? [
    { key: 'dash', name: 'Dashboard', path: '/dashboard' },
    { key: 'ai', name: 'AI Insights', path: '/ai-insights' },
    { key: 'support', name: 'Support', path: '/support' },
  ] : [
    { key: 'home', name: 'Home', path: '/' },
    { key: 'about', name: 'About Us', path: '/about' },
    { key: 'support', name: 'Support', path: '/support' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/8 backdrop-blur-md z-50 border-b border-white/6">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xl shadow">
              I₹
            </div>
            <div className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                In$€₹T
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {menu.map(m => {
            const active = route === m.path;
            return (
              <Link
                key={m.key}
                to={m.path}
                className={`text-sm font-semibold px-3 py-1 rounded-md transition-all duration-200
                  ${active ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-slate-200 hover:text-white/90 hover:bg-white/6'}`}
              >
                {m.name}
              </Link>
            )
          })}

          {/* auth actions */}
          <AuthActions />
        </nav>

        {/* mobile toggle */}
        <div className="md:hidden">
          <button onClick={()=>setOpen(o=>!o)} className="p-2">
            {open ? <X size={22} color="#e9e7ff" /> : <Menu size={22} color="#e9e7ff" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/6 backdrop-blur p-4 border-t border-white/5">
          <div className="flex flex-col gap-3">
            {menu.map(m => (
              <Link key={m.key} to={m.path} className="px-3 py-2 rounded-md text-white/95 bg-transparent hover:bg-white/8">
                {m.name}
              </Link>
            ))}
            <AuthActions mobile />
          </div>
        </div>
      )}
    </header>
  )
}

function AuthActions({ mobile } = {}){
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div className={`flex items-center gap-3 ${mobile ? 'flex-col mt-2' : ''}`}>
        {/* Profile circle with hover tooltip */}
        <div className="relative group">
          <Link to="/profile" className="flex items-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="avatar" 
                className="w-8 h-8 rounded-full ring-2 ring-white/20 object-cover" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-sm font-semibold">
                {(user.full_name || 'U').split(' ').map(s => s[0]).slice(0, 2).join('')}
              </div>
            )}
          </Link>

          {/* Hover tooltip */}
          {!mobile && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="font-medium">{user.email}</div>
              <div className="text-gray-300 mt-1">ID: {user.id}</div>
            </div>
          )}
        </div>

        {mobile && (
          <div className="text-xs text-white/80 bg-black/50 p-2 rounded w-full text-center">
            {user.email}
          </div>
        )}

        <button 
          onClick={() => { logout(); navigate('/'); }} 
          className="text-sm font-semibold px-3 py-1 rounded-md bg-white/8"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${mobile ? 'mt-2' : ''}`}>
      <Link to="/login" className="text-sm font-semibold px-3 py-1 rounded-md text-slate-200 hover:text-white/90 hover:bg-white/6">Login</Link>
      <Link to="/register" className="text-sm font-semibold px-3 py-1 rounded-md bg-white/8">Register</Link>
    </div>
  );
}