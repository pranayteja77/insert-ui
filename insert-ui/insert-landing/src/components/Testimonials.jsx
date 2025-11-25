import React from 'react';

const testimonials = [
  {
    name: "John Doe",
    feedback: "In$€₹T has transformed the way I manage my finances. The insights are invaluable!",
    image: "path/to/image1.jpg" // Replace with actual image path
  },
  {
    name: "Jane Smith",
    feedback: "I love the automation features! It saves me so much time and effort.",
    image: "path/to/image2.jpg" // Replace with actual image path
  },
  {
    name: "Alice Johnson",
    feedback: "The user interface is so intuitive and easy to navigate. Highly recommend!",
    image: "path/to/image3.jpg" // Replace with actual image path
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <h2 className="text-4xl font-bold text-center mb-12 gradient-title tracking-wide">
        What Our Users Say
      </h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white/10 p-6 rounded-lg shadow-lg">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-bold text-center">{testimonial.name}</h3>
            <p className="text-center opacity-90">{testimonial.feedback}</p>
          </div>
        ))}
      </div>
    </section>
  );
}