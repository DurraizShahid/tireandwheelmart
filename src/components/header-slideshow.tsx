"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderSlideshowProps {
  slides: string[];
}

const HeaderSlideshow: React.FC<HeaderSlideshowProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${slide}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center p-4 z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Your Ultimate Destination for Wheels & Tires
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
            Explore a wide range of high-quality tires, wheels, and wheel accessories for every vehicle and season.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/category/all-season-tires"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-primary transition-colors duration-300 shadow-lg"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 p-3 bg-black/30 rounded-full backdrop-blur-sm border border-white/20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 hover:scale-125 active:scale-95 ${
              index === currentSlide ? "h-3 w-8 bg-white shadow-lg" : "h-2.5 w-2.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeaderSlideshow;
