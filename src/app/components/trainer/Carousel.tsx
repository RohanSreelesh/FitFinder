import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.offsetWidth);
      setCarouselHeight(carouselRef.current.offsetHeight);
    }
  }, []);

  const handlePrev = () => {
    setCurrentSlide((oldSlide) => {
      return oldSlide === 0 ? images.length - 1 : oldSlide - 1;
    });
  };

  const handleNext = () => {
    setCurrentSlide((oldSlide) => {
      return oldSlide === images.length - 1 ? 0 : oldSlide + 1;
    });
  };

  return (
    <div className="relative w-full overflow-hidden h-96 rounded-lg shadow-lg transform hover:scale-105 transition-all ease-in-out duration-300" ref={carouselRef}>
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
            index === currentSlide ? "opacity-100 transform scale-105 shadow-lg" : "opacity-0 transform scale-95"
          }`}
          style={{ top: '0', left: '0' }}
        >
          <Image
            layout="fill" 
            objectFit="cover" 
            src={src}
            alt={`Carousel slide ${index}`}
            quality={50}
          />
        </div>
      ))}

      <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current={index === currentSlide ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      {images.length > 1 && (
      <button
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handlePrev}
      >
        <svg
          className="w-4 h-4 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
        <span className="sr-only">Previous</span>
      </button>
      )}
      {images.length > 1 && (

      <button
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handleNext}
      >
        <svg
          className="w-4 h-4 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
        <span className="sr-only">Next</span>
      </button>
      )}
    </div>
  );
};

export default Carousel;
