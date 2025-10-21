"use client";
import { motion } from "framer-motion";
import Squares from "./Squares";
import BlurText from "./BlurText";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-white text-black text-center"
    >
      {/* === Background Grid === */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Squares
          direction="right"
          speed={0.25}
          borderColor="#000"
          squareSize={80}
          hoverFillColor="#000"
        />
      </div>

      {/* === Foreground Content === */}
      <div className="relative z-10 px-6 md:px-12 w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center">

        {/* === Heading (2 baris total) === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="leading-[1.1]"
        >
          <BlurText
            text="Quietly crafting visuals that resonate."
            delay={120}
            animateBy="words"
            direction="top"
            className="text-[clamp(3rem,7vw,5rem)] font-[var(--font-heading)] font-normal text-gray-900 leading-tight text-center"
          />
        </motion.div>


        {/* === Subheading === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          className="mt-6"
        >
          <BlurText
            text="Design and photography shaped by clarity and intent."
            delay={180}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-xl font-[var(--font-heading)] font-light text-gray-700 leading-relaxed tracking-wide mb-10 max-w-2xl mx-auto"
          />
        </motion.div>

        {/* === Description === */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-[0.95rem] text-gray-600 font-[var(--font-body)] leading-relaxed max-w-md mx-auto mb-12"
        >
          Every detail considered,
          <span className="italic"> nothing accidental.</span>
        </motion.p>

        {/* === Button === */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          whileHover={{ scale: 1.03 }}
          className="relative inline-flex items-center justify-center px-8 py-3 rounded-full bg-black text-white font-[var(--font-body)] text-sm overflow-hidden group transition-all duration-300"
        >
          <span className="relative z-10 italic">explore quietly</span>
          <span className="absolute w-16 h-16 bg-white/30 rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
        </motion.a>
      </div>
    </section>
  );
}
