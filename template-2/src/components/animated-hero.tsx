"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  titles: string[];
}

export function Hero({ titles }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (animationComplete) return;

    const timeoutId = setTimeout(() => {
      if (titleNumber < titles.length - 1) {
        setTitleNumber(titleNumber + 1);
      } else {
        setAnimationComplete(true);
        setTitleNumber(0); // Reset to first message
      }
    }, 3000); // Increased time to allow for better reading
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length, animationComplete]);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative h-12 md:h-16">
        {titles.map((title, index) => (
          <motion.p
            key={index}
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-center font-semibold text-white bg-clip-text bg-gradient-to-r from-white to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: titleNumber === index ? 1 : 0,
              y: titleNumber === index ? 0 : 20,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

interface AnimatedHeroProps {
  title: string;
  subtitle: string;
}

export function AnimatedHero({ title, subtitle }: AnimatedHeroProps) {
  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/10 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 10 + 10,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-xl text-white/70 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
