// ...existing code...
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Support from "./pages/Support";
import Income from "./pages/Income";
import Loans from "./pages/Loans";
import AddExpense from "./pages/AddExpense";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import AiInsights from "./pages/AiInsights";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import { ExpenseProvider } from "./context/ExpenseContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
// ...existing code...
export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />

            <Routes>
              {/* Public before login */}
              <Route path="/" element={<RootOrLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/income" element={<PrivateRoute><Income /></PrivateRoute>} />
              <Route path="/loans" element={<PrivateRoute><Loans /></PrivateRoute>} />

              {/* Private pages - guarded */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/ai-insights" element={<PrivateRoute><AiInsights /></PrivateRoute>} />
              <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

              {/* fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ExpenseProvider>
    </AuthProvider>
  )
}

function RootOrLanding(){
  const { user, loading } = useAuth()
  if(loading) return null
  if(user) return <Navigate to="/dashboard" replace />
  return <Landing />
}
// ...existing code...