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
    "مرحبا",
  ];

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro → fadeout

  useEffect(() => {
    // interval buat ganti teks
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 600);

    // kasih waktu lebih panjang biar semua sempat muncul
    const timeout = setTimeout(() => {
      setPhase("fadeout");
      clearInterval(interval); // stop interval biar gak nabrak animasi fade
    }, greetings.length * 600 + 500); // total semua + sedikit buffer

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const textColor = phase === "fadeout" ? "#fff" : "#000";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      initial={{ backgroundColor: "#fff", opacity: 1 }}
      animate={
        phase === "fadeout"
          ? { opacity: 0, backgroundColor: "#000" } // fade ke hitam dulu
          : { opacity: 1, backgroundColor: "#fff" }
      }
      transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={greetings[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-[clamp(2rem,5vw,4rem)] font-[var(--font-heading)] font-normal"
          style={{
            color: textColor,
            transition: "color 0.8s ease",
          }}
        >
          {greetings[index]}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
}
