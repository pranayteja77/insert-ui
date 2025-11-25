import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        In$€₹T
      </div>
      <nav className="flex space-x-4">
        <Link to="/login" className="hover:text-indigo-400">
          Login
        </Link>
        <Link to="/register" className="hover:text-indigo-400">
          Register
        </Link>
      </nav>
    </header>
  );
}