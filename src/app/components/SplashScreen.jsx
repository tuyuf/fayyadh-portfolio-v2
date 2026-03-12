"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        const jump = Math.floor(Math.random() * 10) + 1;
        if (prev > 80 && Math.random() > 0.5) return prev;
        return Math.min(prev + jump, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#0a0a0a] text-[#fafafa] px-8 py-8 md:px-24 md:py-24"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 1.2, ease: [0.85, 0, 0.15, 1] } 
          }}
        >
          {/* Top Info */}
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">Portfolio Edition</span>
              <span className="text-xs font-heading italic">MMXXV / V2</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">Location</span>
              <p className="text-xs font-heading italic">Semarang, ID</p>
            </div>
          </div>

          {/* Large Counter */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="flex items-baseline"
              >
                <h1 className="text-[clamp(8rem,30vw,24rem)] leading-[0.8] font-heading font-normal tabular-nums">
                  {count}
                </h1>
                <span className="text-xl md:text-4xl font-heading italic opacity-20 ml-2">%</span>
              </motion.div>
              
              {/* Subtle Label Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: count === 100 ? 1 : 0 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-[10px] uppercase tracking-[0.5em] font-medium opacity-40">Ready to present</span>
              </motion.div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8">
            <div className="max-w-xs">
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-30 mb-2">Philosophy</p>
              <p className="text-sm md:text-base font-heading italic leading-tight">
                Crafting digital experiences with quiet intention and technical precision.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">
                {count < 100 ? "Loading Essence" : "Initialized"}
              </span>
              <div className="w-48 md:w-80 h-[1.5px] bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  animate={{ x: `${count - 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}