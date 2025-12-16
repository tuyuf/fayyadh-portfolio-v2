"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Stack from "./Stack"; 

export default function About() {
  const details = [
    { label: "Role", value: "Designer & Dev" },
    { label: "Based in", value: "Semarang, ID" },
    { label: "Experience", value: "Not Enough😄" }, // Sesuai screenshot terakhir
    { label: "Vibe", value: "Quiet & Minimal" },
  ];

  const stackImages = [
    "/images/1.webp",   
    "/images/2.webp",   
    "/images/3.webp",    
  ];

  return (
    <section
      id="about"
      className="relative bg-white text-black px-6 md:px-24 py-32 md:pb-48 overflow-visible border-t border-gray-100"
    >
      {/* UPDATE: items-center agar vertikal center secara otomatis */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        
        {/* === KIRI: CARD STACK === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          // UPDATE: Hapus -mt-12, ganti jadi 'flex items-center'
          // Tambahkan md:mt-8 kalau masih merasa kurang turun sedikit
          className="w-full md:w-5/12 relative shrink-0 flex items-center justify-center md:mt-10 z-10"
        >
          <div className="w-[300px] h-[380px] md:w-[400px] md:h-[500px] relative transform rotate-[-2deg]">
            <Stack
              randomRotation={true} 
              sensitivity={100}     
              sendToBackOnClick={true}
              autoSlide={true}         
              autoSlideInterval={2500} 
              cards={stackImages.map((src, i) => (
                <div 
                  key={i} 
                  className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white select-none"
                >
                  <Image
                    src={src}
                    alt={`Fayyadh Visual ${i + 1}`}
                    fill
                    className="object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                </div>
              ))}
            />
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-400 tracking-widest uppercase text-center whitespace-nowrap"
          >
            (Tap to Shuffle)
          </motion.p>
        </motion.div>


        {/* === KANAN: TEXT MANIFESTO === */}
        <div className="w-full md:w-7/12 flex flex-col justify-center h-full">
          
          <motion.span 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-8 block"
          >
            (01) Who I Am
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-[var(--font-heading)] leading-[1.05] mb-16"
          >
            I craft digital experiences that feel <span className="italic text-gray-500">calm</span>, <span className="italic text-gray-500">purposeful</span>, and human.
          </motion.h2>

          <motion.div 
            className="grid grid-cols-2 gap-y-10 gap-x-8 border-t border-gray-200 pt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {details.map((item, i) => (
              <div key={i}>
                <h4 className="text-xs font-mono text-gray-400 uppercase mb-3 tracking-wider">{item.label}</h4>
                <p className="text-xl md:text-2xl font-[var(--font-heading)]">{item.value}</p>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}