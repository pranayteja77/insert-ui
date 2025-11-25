import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-70">© {new Date().getFullYear()} In$€₹T. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}