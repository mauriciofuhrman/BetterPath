"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = [
    "A Modern Solution To A Better Tomorrow",
    "For Gambling Addicts",
    "By Gambling Addicts",
  ];
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
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length, animationComplete]);

  return (
    <div className="h-8 relative w-full max-w-4xl mx-auto">
      <div className="relative h-full">
        {titles.map((title, index) => (
          <motion.p
            key={index}
            className="text-2xl md:text-3xl tracking-tighter text-center font-medium"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: titleNumber === index ? 1 : 0,
              y: titleNumber === index ? 0 : 40,
            }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {title}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
