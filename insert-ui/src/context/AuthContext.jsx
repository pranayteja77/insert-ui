// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// 🔥 Helper: Clear ALL old demo data (auth + financial)
const clearAllDemoData = () => {
  localStorage.removeItem('insert_users');
  localStorage.removeItem('insert_demo_profile');
  localStorage.removeItem('insert_expenses');
  localStorage.removeItem('insert_income');
  localStorage.removeItem('insert_loans');
  localStorage.removeItem('insert_goals');
  Object.keys(localStorage)
    .filter(key => key.startsWith('insert_avatar_'))
    .forEach(key => localStorage.removeItem(key));
};

// 🔑 Helper: Make authenticated API calls
// src/context/AuthContext.jsx
export const apiCall = async (url, options = {}) => {
  // Use environment variable for production
  const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  const token = localStorage.getItem('insert_token');
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };
  return fetch(`${baseURL}${url}`, config);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem('insert_users') !== null) {
        console.log('🧹 Clearing old demo data...');
        clearAllDemoData();
      }

      const storedUser = localStorage.getItem('insert_user');
      const token = localStorage.getItem('insert_token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Invalid user data in localStorage', e);
          clearAllDemoData();
        }
      }
    } catch (e) {
      console.error('Auth initialization error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async ({ name, email, password, avatar, pan, aadhaar, phone }) => {
    clearAllDemoData();

    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: name,
        email,
        phone,
        aadhaar_number: aadhaar,
        pan_card_number: pan,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('insert_user', JSON.stringify(data.user));
    localStorage.setItem('insert_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async ({ identifier, password }) => {
    clearAllDemoData();

    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }

    localStorage.setItem('insert_user', JSON.stringify(data.user));
    localStorage.setItem('insert_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearAllDemoData();
    localStorage.removeItem('insert_user');
    localStorage.removeItem('insert_token');
    setUser(null);
  };

  // ✅ Updated: Real profile update API call
// In AuthContext.jsx, update the updateProfile function
// src/context/AuthContext.jsx
// In AuthContext.jsx, update the updateProfile function
const updateProfile = async (updates) => {
  console.log('Calling profile update API with:', updates);
  
  const response = await apiCall('/api/profile/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Profile update API error:', error);
    throw new Error(error.error || 'Failed to update profile');
  }
  
  const data = await response.json();
  console.log('Profile update API response:', data);
  
  // ✅ Update localStorage and state with the correct field name
  const updatedUser = {
    ...data.user,
    avatar: data.user.profile_picture_url // 👈 Map profile_picture_url to avatar for backward compatibility
  };
  
  localStorage.setItem('insert_user', JSON.stringify(updatedUser));
  setUser(updatedUser);
  
  return updatedUser;
};
  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;