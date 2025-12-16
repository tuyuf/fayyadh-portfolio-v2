"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Logika Counter: Cepat di awal, melambat di akhir (easing manual)
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800); // Tahan sebentar di 100% biar dramatis
          return 100;
        }
        
        // Random jump biar kerasa "loading" beneran
        const jump = Math.floor(Math.random() * 10) + 1;
        
        // Makin dekat 100, makin pelan (biar ada tensi)
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
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#111] text-[#f1f1f1] px-6 py-6 md:px-12 md:py-12"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Easing "mahal"
          }} 
        >
          {/* === TOP BAR (Details) === */}
          <div className="flex justify-between items-start w-full opacity-50 text-xs font-mono tracking-widest uppercase">
            <span>Portfolio &copy; 2025</span>
            <span className="text-right">Semarang, ID</span>
          </div>

          {/* === CENTER (THE GIANT COUNTER) === */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative overflow-hidden">
               <motion.h1 
                 className="text-[clamp(6rem,25vw,16rem)] leading-none font-[var(--font-heading)] font-medium tabular-nums"
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8 }}
               >
                 {count}
               </motion.h1>
               {/* Simbol Persen Kecil di sebelah angka */}
               <span className="absolute top-4 right-[-2rem] md:right-[-4rem] text-xl md:text-4xl font-mono opacity-50">
                 %
               </span>
            </div>
          </div>

          {/* === BOTTOM BAR (Status) === */}
          <div className="flex justify-between items-end w-full">
            <div className="text-xs font-mono tracking-widest uppercase opacity-50">
              {count < 100 ? "Loading Resources..." : "Welcome."}
            </div>
            
            {/* Loading Bar Line */}
            <div className="w-32 md:w-64 h-[1px] bg-gray-700 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                animate={{ x: `${count - 100}%` }} // Gerak dari -100% ke 0%
                transition={{ duration: 0.1 }} // Responsif ngikutin count
              />
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}