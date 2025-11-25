import { Link } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Slider from "../components/Slider";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <Slider />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}