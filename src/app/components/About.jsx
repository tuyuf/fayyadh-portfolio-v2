"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import BlurText from "./BlurText"; // Menggunakan komponen yang sudah ada [cite: 132]

export default function About() {
  const containerRef = useRef(null);
  
  // Parallax effect simple untuk text
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-[#fafafa] text-black w-full py-24 md:py-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* === HEADER SECTION === */}
        <div className="mb-20 md:mb-32 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-[var(--font-heading)] leading-[0.9] tracking-tight">
              Behind the <br className="md:hidden" />
              <span className="italic text-gray-400">pixels.</span>
            </h2>
            {/* Dekorasi kecil */}
            <motion.span 
              className="absolute -top-6 -right-8 text-sm font-[var(--font-body)] tracking-widest uppercase border border-black/20 rounded-full px-3 py-1 hidden md:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              Est. 2025
            </motion.span>
          </motion.div>
        </div>

        {/* === CONTENT: STICKY LAYOUT === */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 relative">
          
          {/* --- LEFT: STICKY IMAGE --- */}
          {/* Foto akan diam saat discroll sampai section selesai */}
          <div className="md:w-5/12 h-fit md:sticky md:top-32 self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/pp.webp" // Pastikan path ini sesuai file kamu
                alt="Fayyadh Portrait"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Overlay Gradient Halus */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Caption kecil di bawah foto */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-xs font-[var(--font-body)] text-gray-400 tracking-widest uppercase text-center md:text-left"
            >
              Based in Semarang, ID
            </motion.p>
          </div>

          {/* --- RIGHT: SCROLLING NARRATIVE --- */}
          <motion.div 
            style={{ y: yText }}
            className="md:w-7/12 flex flex-col gap-16 md:gap-24 pt-10 md:pt-0"
          >
            {/* Thought Block 1 */}
            <div className="group">
              <h3 className="text-3xl font-[var(--font-heading)] mb-4 text-gray-300 group-hover:text-black transition-colors duration-300">
                01. The Approach
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed font-[var(--font-body)] text-gray-800">
                I’m Fayyadh — a designer and photographer focused on creating clear, <span className="italic font-semibold">intentional</span>, and human-centered visuals. My work blends structure with creativity, ensuring every interaction feels natural.
              </p>
            </div>

            {/* Thought Block 2 */}
            <div className="group">
              <h3 className="text-3xl font-[var(--font-heading)] mb-4 text-gray-300 group-hover:text-black transition-colors duration-300">
                02. The Philosophy
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed font-[var(--font-body)] text-gray-800">
                I value <span className="border-b border-black pb-1">process over speed</span> and clarity over noise. Whether it’s a visual identity, a web layout, or a single frame, I aim to craft something that simply feels right—without shouting for attention.
              </p>
            </div>

            {/* Thought Block 3 */}
            <div className="group">
              <h3 className="text-3xl font-[var(--font-heading)] mb-4 text-gray-300 group-hover:text-black transition-colors duration-300">
                03. The Portfolio
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed font-[var(--font-body)] text-gray-800">
                This space is a reflection of that mindset. Thoughtful, minimal, and quietly deliberate. Every detail here was stitched together to form something simple, yet <span className="italic font-serif text-3xl align-middle">whole</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}