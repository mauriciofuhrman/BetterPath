"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  isActive,
}: FeatureCardProps) => {
  // Convert title to URL path
  const featurePath = `/${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className={`
    transition-all duration-300 ease-in-out
    bg-gray-900/50 p-8 rounded-xl border border-gray-800
    h-full flex flex-col
    ${
      isActive
        ? "transform scale-105 bg-gray-900/80 border-blue-500/50 shadow-lg shadow-blue-500/10 my-4"
        : "scale-100"
    }
  `}
    >
      <div
        className={`
        w-12 h-12 rounded-full flex items-center justify-center mb-6
        ${isActive ? "bg-blue-500/30" : "bg-blue-500/20"}
      `}
      >
        <Icon
          className={`h-6 w-6 ${isActive ? "text-blue-400" : "text-blue-500"}`}
        />
      </div>
      <h3
        className={`text-xl font-bold mb-4 ${
          isActive ? "text-white" : "text-white/90"
        }`}
      >
        {title}
      </h3>
      <p
        className={`${
          isActive ? "text-gray-300" : "text-gray-400"
        } flex-grow mb-6`}
      >
        {description}
      </p>
    </div>
  );
};

interface FeatureCarouselProps {
  features: Feature[];
}

export const FeatureCarousel = ({ features }: FeatureCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance the carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  // Calculate which features to display (always show 3 at a time)
  const getVisibleFeatures = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index = (activeIndex + i + features.length) % features.length;
      result.push({
        ...features[index],
        isActive: i === 0,
        index,
      });
    }
    return result;
  };

  const visibleFeatures = getVisibleFeatures();

  return (
    <div
      className="relative py-24"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel container */}
      <div className="relative overflow-visible mx-auto max-w-6xl px-8">
        <div className="flex justify-center items-stretch gap-4 md:gap-8 min-h-[500px]">
          {visibleFeatures.map((feature, idx) => (
            <div
              key={feature.index}
              className={`
        transition-all duration-500 ease-in-out
        ${idx === 0 ? "opacity-80 md:-translate-x-6" : ""}
        ${idx === 1 ? "z-10 opacity-100" : "opacity-80"} 
        ${idx === 2 ? "md:translate-x-6" : ""}
        flex-1 ${idx === 1 ? "self-stretch flex" : ""}
      `}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isActive={feature.isActive}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 p-3 rounded-full border border-gray-700 text-white/80 hover:text-white transition-all"
          aria-label="Previous feature"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 p-3 rounded-full border border-gray-700 text-white/80 hover:text-white transition-all"
          aria-label="Next feature"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Feature counter (optional) */}
      <div className="text-center mt-12 text-gray-500">
        <span className="text-blue-400">{activeIndex + 1}</span>
        <span> / {features.length}</span>
      </div>
    </div>
  );
};
