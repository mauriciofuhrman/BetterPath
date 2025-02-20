import { motion } from "framer-motion";
import Link from "next/link";

interface AnimatedTitleProps {
  titleSize?: "sm" | "md" | "lg";
  className?: string;
  containerWidth?: string;
}

export function AnimatedTitle({
  titleSize = "lg",
  className = "",
  containerWidth = "max-w-4xl",
}: AnimatedTitleProps) {
  const titleSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-4xl md:text-5xl",
    lg: "text-6xl md:text-8xl",
  };

  const strokeWidths = {
    sm: { glow: 20, path: 2 },
    md: { glow: 30, path: 3 },
    lg: { glow: 40, path: 4 },
  };

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 },
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Link href="/">
      <div
        className={`relative flex flex-col items-center w-full ${containerWidth} ${className}`}
      >
        <h1
          className={`${titleSizes[titleSize]} font-bold tracking-tighter text-center`}
        >
          <span className="text-white">Better</span>
          <span className="text-[hsl(var(--accent-blue))]">Path</span>
        </h1>

        <motion.div
          initial="hidden"
          animate="visible"
          className="absolute inset-0 w-full h-full z-20"
        >
          {/* Glowing background for the path */}
          <motion.div
            variants={glowVariants}
            className="absolute inset-0 w-full h-full"
            style={{
              filter: "blur(20px)",
              transform: "translateZ(0)",
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 950 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M50 100 C200 20, 600 180, 900 100"
                stroke="hsl(var(--accent-blue))"
                strokeWidth={strokeWidths[titleSize].glow}
                strokeLinecap="round"
                variants={pathVariants}
              />
            </svg>
          </motion.div>

          {/* Main path */}
          <svg
            className="w-full h-full absolute inset-0"
            viewBox="0 0 950 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M50 100 C200 20, 600 180, 900 100"
              stroke="white"
              strokeWidth={strokeWidths[titleSize].path}
              strokeLinecap="round"
              strokeDasharray="8,12"
              variants={pathVariants}
            />
            {/* Arrow head */}
            <motion.path
              d="M880 85 L900 100 L880 115"
              stroke="white"
              strokeWidth={strokeWidths[titleSize].path}
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={pathVariants}
            />
          </svg>
        </motion.div>
      </div>
    </Link>
  );
}
