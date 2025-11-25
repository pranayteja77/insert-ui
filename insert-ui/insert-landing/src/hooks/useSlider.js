import { useState, useEffect } from 'react';

const useSlider = (initialIndex = 0, images = []) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return {
    currentImage: images[currentIndex],
    nextSlide,
    prevSlide,
    currentIndex,
    totalSlides: images.length,
  };
};

export default useSlider;