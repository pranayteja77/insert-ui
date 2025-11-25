import { useState } from "react";
import { useSlider } from "../hooks/useSlider";

const Slider = ({ slides }) => {
  const { currentSlide, nextSlide, prevSlide } = useSlider(slides.length);
  
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full">
            <img src={slide.image} alt={slide.alt} className="w-full h-auto object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
              <h3 className="text-xl font-bold">{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg">
        Prev
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg">
        Next
      </button>
    </div>
  );
};

export default Slider;