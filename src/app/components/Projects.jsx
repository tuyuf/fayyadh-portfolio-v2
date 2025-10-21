"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(null);

  const projects = [
    {
      title: "UI / UX Design",
      desc: "Designing digital experiences that are intuitive, elegant, and human-centered — blending creativity with usability.",
      previewLimit: 2,
      slides: [
        "/images/uiux1.webp",
        "/images/uiux2.webp",
        "/images/uiux3.webp",
        "/images/uiux4.webp",
        "/images/uiux5.webp",
      ],
    },
    {
      title: "Photography",
      desc: "Capturing visual stories through light and emotion — from portraits to events that define authentic moments.",
      previewLimit: 3,
      slides: [
        "/images/foto1.webp",
        "/images/foto2.webp",
        "/images/foto3.webp",
        "/images/foto4.webp",
        "/images/foto5.webp",
        "/images/foto6.webp",
        "/images/foto7.webp",
      ],
    },
  ];

  return (
    <section
      id="projects"
      className="relative w-full bg-white text-black px-6 md:px-24 py-20 border-t border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10 text-sm tracking-widest uppercase text-gray-500 font-[var(--font-body)]">
        <span>My Expertise (02)</span>
        <span>Selected Projects</span>
      </div>

      <div className="divide-y divide-gray-300">
        {projects.map((item, i) => (
          <div key={i} className="py-8">
            {/* Header Row */}
            <div className="flex justify-between items-center flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <motion.span
                    animate={{ rotate: activeIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-3xl font-[var(--font-heading)]"
                  >
                    +
                  </motion.span>
                </button>
                <h3 className="text-3xl md:text-4xl font-[var(--font-heading)] leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Right: Preview */}
              {activeIndex !== i && (
                <div className="flex justify-end w-full md:w-[60%]">
                  <div
                    className={`grid gap-3 ${
                      item.previewLimit === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    } w-full max-w-[640px]`}
                  >
                    {item.slides.slice(0, item.previewLimit).map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`${item.title} preview ${idx + 1}`}
                        className="w-full h-[180px] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Expanded */}
            <AnimatePresence initial={false}>
              {activeIndex === i && (
                <motion.div
                  key="expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden mt-10 pl-10 md:pl-12"
                >
                  <p className="text-gray-600 text-base md:text-lg mb-6 max-w-2xl leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="relative overflow-x-auto flex gap-6 scrollbar-hide">
                    <motion.div
                      className="flex gap-6"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                        duration: 25,
                      }}
                    >
                      {[...item.slides, ...item.slides].map((src, idx) => (
                        <div key={idx} className="flex-shrink-0">
                          <img
                            src={src}
                            alt={`${item.title} slide ${idx + 1}`}
                            className={`rounded-2xl shadow-md object-cover ${
                              idx % 2 === 0
                                ? "w-[320px] h-[460px]"
                                : "w-[320px] h-[380px]"
                            }`}
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
