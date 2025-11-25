import { Link } from "react-router-dom";
import heroImage from "../assets/hero-image.png"; // Replace with your actual hero image path

export default function Hero() {
  return (
    <section className="hero min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="text-center text-white p-6 bg-black bg-opacity-50 rounded-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Welcome to In$€₹T
        </h1>
        <p className="mt-4 text-lg opacity-90">
          Your personal AI-powered financial companion. Track expenses, set goals,
          automate money rules, and visualize your financial health beautifully.
        </p>
        <div className="mt-6 flex justify-center gap-4">
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
    </section>
  );
}