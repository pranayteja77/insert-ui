import React from 'react';
import heroAvatar from '../assets/avatar.png';

const featuresData = [
  {
    title: "Smart Expense Tracking",
    img: heroAvatar,
    text: "Automatically track and categorize your spending with AI precision."
  },
  {
    title: "Powerful Analytics",
    img: heroAvatar,
    text: "Visualize your spending with charts, insights, and weekly trends."
  },
  {
    title: "Goals & Automation",
    img: heroAvatar,
    text: "Set financial goals and automate custom rules with notifications."
  }
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <h2 className="text-4xl font-bold text-center mb-12 tracking-wide">
        Why Choose <span className="gradient-title">In$€₹T</span>?
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {featuresData.map((feature, index) => (
          <div key={index} className="card text-center p-8">
            <img
              src={feature.img}
              className="w-24 h-24 mx-auto rounded-xl mb-4 shadow-lg"
              alt={feature.title}
            />
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="opacity-90 text-sm">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}