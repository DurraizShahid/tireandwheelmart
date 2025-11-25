"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  children: ReactNode;
  autoScrollSpeed?: number; // milliseconds between scrolls
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  children, 
  autoScrollSpeed = 4000 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const content = contentRef.current;
    if (!scrollContainer || !content) return;

    let scrollInterval: NodeJS.Timeout;
    let isAutoScrolling = true;

    const autoScroll = () => {
      if (!isAutoScrolling || !scrollContainer) return;

      const scrollAmount = 400; // pixels to scroll per interval
      const halfWidth = content.scrollWidth / 2;

      // When scrolled halfway through duplicated content, reset to start
      if (scrollContainer.scrollLeft >= halfWidth) {
        scrollContainer.scrollLeft = 0;
      }

      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    };

    // Start auto-scroll
    scrollInterval = setInterval(autoScroll, autoScrollSpeed);

    // Pause on hover
    const handleMouseEnter = () => {
      isAutoScrolling = false;
    };

    const handleMouseLeave = () => {
      isAutoScrolling = true;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(scrollInterval);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [autoScrollSpeed]);

  return (
    <div className="relative w-full">
      {/* Left Arrow - Hidden on mobile */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 sm:px-16"
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div ref={contentRef} className="flex gap-6">
          {/* Original children */}
          {childrenArray}
          {/* Duplicated children for infinite scroll effect */}
          {childrenArray}
        </div>
      </div>

      {/* Right Arrow - Hidden on mobile */}
      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>
    </div>
  );
};

export default ProductCarousel;
