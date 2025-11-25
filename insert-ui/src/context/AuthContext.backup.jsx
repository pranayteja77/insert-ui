import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('insert_user')
      if (raw) {
        const u = JSON.parse(raw)
        // attach avatar if stored separately
        const avatar = localStorage.getItem(`insert_avatar_${u.id}`)
        setUser(avatar ? { ...u, avatar } : u)
      }
    } catch (e) {
      console.error('Auth load error', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const register = async ({ name, email, password, avatar, pan, aadhaar, phone }) => {
    const usersRaw = localStorage.getItem('insert_users')
    const users = usersRaw ? JSON.parse(usersRaw) : []
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists')
    }
    const newUser = { id: Date.now().toString(), name, email }
    users.push({ ...newUser, password, pan, aadhaar, phone })
    localStorage.setItem('insert_users', JSON.stringify(users))
    // store avatar separately to avoid large user objects
    if (avatar) localStorage.setItem(`insert_avatar_${newUser.id}`, avatar)
    localStorage.setItem('insert_user', JSON.stringify(newUser))
    setUser(avatar ? { ...newUser, avatar } : newUser)
    return newUser
  }

  const login = async ({ identifier, password }) => {
    // identifier can be username/email
    if (identifier === 'admin' && password === 'admin') {
      const admin = { id: 'admin', name: 'Admin', email: 'admin@local' }
      localStorage.setItem('insert_user', JSON.stringify(admin))
      setUser(admin)
      return admin
    }

    const usersRaw = localStorage.getItem('insert_users')
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const found = users.find(u => (u.email === identifier || u.name === identifier) && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    const safeUser = { id: found.id, name: found.name, email: found.email }
    // attach avatar if present
    const avatar = localStorage.getItem(`insert_avatar_${found.id}`)
    if (avatar) safeUser.avatar = avatar
    localStorage.setItem('insert_user', JSON.stringify(safeUser))
    setUser(safeUser)
    return safeUser
  }

  const logout = () => {
    localStorage.removeItem('insert_user')
    setUser(null)
  }

  const updateProfile = async (updates) => {
    // updates: { name, email, avatar, pan, aadhaar, phone }
    if (!user) throw new Error('Not authenticated')
    const usersRaw = localStorage.getItem('insert_users')
    const users = usersRaw ? JSON.parse(usersRaw) : []
    const idx = users.findIndex(u => u.id === user.id)
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates }
      localStorage.setItem('insert_users', JSON.stringify(users))
    }
    // store avatar separately
    if (updates.avatar) localStorage.setItem(`insert_avatar_${user.id}`, updates.avatar)
    const updatedPublic = { id: user.id, name: updates.name || user.name, email: updates.email || user.email }
    const avatar = localStorage.getItem(`insert_avatar_${user.id}`)
    if (avatar) updatedPublic.avatar = avatar
    localStorage.setItem('insert_user', JSON.stringify(updatedPublic))
    setUser(updatedPublic)
    return updatedPublic
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
