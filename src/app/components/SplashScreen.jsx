"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "crafted in quiet motion"; // 💬 ubah ini sesuai tone kamu
  const [done, setDone] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);

  // Efek decrypt text
  useEffect(() => {
    const chars = "!@#$%^&*()_+=-<>?/[]{}";
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        fullText
          .split("")
          .map((char, i) =>
            i < iteration ? fullText[i] : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
      if (iteration >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
      iteration += 1 / 2.2;
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  // Setelah teks selesai, mulai transisi ke hitam
  useEffect(() => {
    if (done) {
      setTimeout(() => setFadeToBlack(true), 500);
    }
  }, [done]);

  return (
    <AnimatePresence>
      {!fadeToBlack && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 flex items-end justify-start z-[9999]"
        >
          {/* Background dari putih → hitam */}
          <motion.div
            animate={{
              backgroundColor: fadeToBlack ? "#ffffffff" : "#ffffffff",
            }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0"
          />

          {/* Text decrypt */}
          <motion.h1
            className="relative z-10 font-[var(--font-heading)] text-[clamp(2rem,6vw,5rem)] tracking-tight italic p-10"
            animate={{
              color: fadeToBlack ? "#000000ff" : "#000000ff",
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {displayText}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
