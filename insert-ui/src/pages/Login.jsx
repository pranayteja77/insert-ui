import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard'
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const isValid = identifier.trim() !== '' && password.trim() !== ''

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ identifier, password })
      navigate(from, { replace: true })
    } catch (err) {
      alert(err.message || 'Login failed')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0020] to-[#17042b] p-6">
      <div className="max-w-md w-full card p-6">

        <h2 className="text-2xl font-bold gradient-title mb-2">Login</h2>
        <p className="small-muted mb-4">Sign in to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm small-muted">Email or username</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input w-full mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm small-muted">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input w-full mt-1"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn w-full" disabled={!isValid}>
            Login
          </button>
        </form>

        <div className="mt-4 text-sm small-muted text-center">
          Don't have an account? <Link to="/register" className="text-indigo-300">Register</Link>
        </div>

      </div>
    </div>
  );
}
