"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const greetings = [
    "Hello",
    "Hola",
    "Bonjour",
    "Ciao",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Hallo",
    "Salam",
    "Halo",
  ];

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro → fadeout

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 600);

    // mulai fade out ke putih
    const timeout = setTimeout(() => {
      setPhase("fadeout");
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center text-white"
      style={{ zIndex: 9999 }}
      initial={{ backgroundColor: "#ffffffff", opacity: 1 }}
      animate={
        phase === "fadeout"
          ? { opacity: 0, backgroundColor: "#000000ff" }
          : { opacity: 1, backgroundColor: "#ffffffff" }
      }
      transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={greetings[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-[clamp(2rem,5vw,4rem)] font-[var(--font-heading)] font-normal text-black"
        >
          {greetings[index]}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
}
