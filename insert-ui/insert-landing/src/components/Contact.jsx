import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-20 px-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <h2 className="text-4xl font-bold text-center mb-8 gradient-title tracking-wide">
        Contact Us
      </h2>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-lg opacity-90 mb-4">Have questions or need support?</p>
        <p className="text-lg">📩 support@insert.app</p>
        <p className="text-lg">📞 +91 98765 43210</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            rows="4"
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}