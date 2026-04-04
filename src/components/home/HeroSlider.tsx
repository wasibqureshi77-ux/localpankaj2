"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSliderProps {
  isMobile: boolean;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ isMobile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const desktopSlides = ["/banner-1.png", "/banner-2.png", "/banner-3.png"];
  const mobileSlides = ["/mobile-banner-1.png", "/mobile-banner-2.png", "/mobile-banner-3.png"];
  const slides = isMobile ? mobileSlides : desktopSlides;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isMobile]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Container that scales perfectly with the image aspect ratio */}
      <div className="relative w-full">
        {/* Invisible image to reserve space based on actual image aspect ratio */}
        <img 
          src={slides[0]} 
          className="w-full h-auto invisible pointer-events-none" 
          aria-hidden="true" 
          alt=""
        />

        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={slides[currentIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0 w-full h-full object-cover select-none"
            alt={`Promotional Banner ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* Dynamic Shadow Mask for better edge blending */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/5 via-transparent to-black/5 pointer-events-none" />

        {/* Side Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/10 hover:bg-black/30 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 group"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/10 hover:bg-black/30 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 group"
          aria-label="Next slide"
        >
          <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
