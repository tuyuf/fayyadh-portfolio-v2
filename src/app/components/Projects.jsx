"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// --- KOMPONEN BANTUAN: AUTO SCROLL CONTAINER ---
const AutoScrollContainer = ({ children, className }) => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused) return;

      const firstCard = container.firstElementChild;
      if (!firstCard) return;

      // Hitung gap
      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.gap) || 0; 
      
      const scrollAmount = firstCard.offsetWidth + gap; 
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000); // Durasi 1 detik

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {children}
    </div>
  );
};

// --- KOMPONEN UTAMA ---
export default function Projects() {
  // UPDATE 1: Gunakan Array untuk menampung BANYAK section yang terbuka
  const [activeIndices, setActiveIndices] = useState([]);

  // Fungsi Toggle: Buka/Tutup tanpa ganggu yang lain
  const toggleSection = (index) => {
    setActiveIndices((prev) => {
      if (prev.includes(index)) {
        // Kalau sudah ada, hapus (Tutup)
        return prev.filter((i) => i !== index);
      } else {
        // Kalau belum ada, tambahkan (Buka)
        return [...prev, index];
      }
    });
  };

  const allProjects = [
    {
      id: "uiux",
      title: "UI / UX Design",
      type: "gallery",
      desc: "Designing digital experiences that are intuitive, elegant, and human-centered — blending creativity with usability.",
      previewLimit: 2,
      slides: [
        "/images/uiux1.webp", "/images/uiux2.webp",
        "/images/uiux3.webp", "/images/uiux4.webp",
        "/images/uiux6.webp", "/images/uiux8.webp",
      ],
    },
    {
      id: "photo",
      title: "Photography",
      type: "gallery",
      desc: "Capturing visual stories through light and emotion — from portraits to events that define authentic moments.",
      previewLimit: 3,
      slides: [
        "/images/foto1.webp", "/images/foto2.webp",
        "/images/foto3.webp", "/images/foto6.webp",
        "/images/foto4.webp", "/images/foto5.webp",
      ],
    },
    {
      id: "web",
      title: "Web Development",
      type: "code",
      desc: "Where logic meets aesthetics. Selected web projects built with intention.",
      previewLimit: 1,
      slides: ["/images/uiux1.webp"], 
      items: [
        {
          title: "Reloved — Thrift E-Commerce",
          tech: "React • Supabase • Tailwind",
          url: "https://www.reloved.biz.id/",
          description: "Sustainable fashion marketplace focused on pre-loved items.",
          embedUrl: "https://www.reloved.biz.id/",
          fallbackImage: "/images/uiux1.webp" 
        },
        {
          title: "Reswara Praptama",
          tech: "Next.js • Sanity CMS • Tailwind",
          url: "https://reswarapraptama.com",
          description: "Portfolio site for Reswara Praptama.",
          embedUrl: "https://reswarapraptama.com",
          fallbackImage: "/images/uiux2.webp"
        },
        {
          title: "Portfolio V2",
          tech: "Next.js 15 • Framer Motion",
          url: "https://www.interactwithf.my.id/",
          description: "The site you are looking at right now. Crafted with quiet intention.",
          embedUrl: "https://www.interactwithf.my.id/",
          fallbackImage: "/images/uiux3.webp"
        }
      ]
    },
  ];

  return (
    <section
      id="projects"
      className="relative w-full bg-white text-black px-6 md:px-24 py-20 border-t border-gray-200"
    >
      <div className="flex justify-between items-center mb-10 text-sm tracking-widest uppercase text-gray-500 font-[var(--font-body)]">
        <span>My Expertise (03)</span>
        <span>Selected Works</span>
      </div>

      <div className="divide-y divide-gray-300">
        {allProjects.map((category, i) => {
          // UPDATE 2: Cek apakah index 'i' ada di dalam array activeIndices
          const isOpen = activeIndices.includes(i);

          return (
            <div key={i} className="py-8">
              
              {/* Header Row */}
              <div className="flex justify-between items-center flex-wrap gap-6 min-h-[120px]">
                <div className="flex items-center gap-4">
                  <button
                    // UPDATE 3: Panggil toggleSection
                    onClick={() => toggleSection(i)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors group"
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-4xl font-[var(--font-heading)] group-hover:text-gray-500"
                    >
                      +
                    </motion.span>
                  </button>
                  <h3 
                    className="text-3xl md:text-5xl font-[var(--font-heading)] leading-tight cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => toggleSection(i)}
                  >
                    {category.title}
                  </h3>
                </div>

                {/* Preview Grid (Hanya muncul jika TERTUTUP) */}
                {!isOpen && (
                  <div className="flex justify-end w-full md:w-[60%]">
                    <div
                      className={`grid gap-3 w-full max-w-[640px] ${
                        category.previewLimit === 1 ? "grid-cols-1" : 
                        category.previewLimit === 2 ? "grid-cols-2" : "grid-cols-3"
                      }`}
                    >
                      {category.slides.slice(0, category.previewLimit).map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt="preview"
                          className="w-full h-[120px] md:h-[180px] object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 pl-2 md:pl-14 pb-12">
                      <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-3xl leading-relaxed">
                        {category.desc}
                      </p>

                      {/* --- CASE 1: UI/UX & PHOTOGRAPHY --- */}
                      {category.type === 'gallery' && (
                        <div className="w-full">
                          <AutoScrollContainer className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 gap-6">
                            {category.slides.map((src, idx) => (
                              <div key={idx} className="snap-center shrink-0">
                                <img
                                  src={src}
                                  alt="slide"
                                  className={`rounded-2xl shadow-sm object-cover ${
                                    idx % 2 === 0 ? "w-[320px] h-[460px]" : "w-[320px] h-[380px]"
                                  }`}
                                />
                              </div>
                            ))}
                          </AutoScrollContainer>
                        </div>
                      )}

                      {/* --- CASE 2: WEB DEVELOPMENT --- */}
                      {category.type === 'code' && (
                        <div className="w-full">
                          <AutoScrollContainer className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 gap-6 md:gap-10">
                            {category.items.map((project, idx) => (
                              <div 
                                key={idx} 
                                className="snap-center shrink-0 w-[90vw] md:w-[850px]"
                              >
                                <div className="w-full bg-white rounded-xl border border-gray-300 shadow-xl overflow-hidden flex flex-col">
                                  <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
                                    <div className="flex gap-2">
                                      <div className="w-3 h-3 rounded-full bg-red-400" />
                                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                      <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="bg-white px-3 py-1 rounded text-xs text-gray-400 font-mono hidden sm:block shadow-sm">
                                      {project.url}
                                    </div>
                                    <a 
                                      href={project.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-bold uppercase hover:text-blue-600 flex items-center gap-1 transition-colors"
                                    >
                                      Visit <ArrowUpRight size={14}/>
                                    </a>
                                  </div>
                                  <div className="p-6 bg-white border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-end gap-4 shrink-0">
                                    <div>
                                      <h4 className="text-2xl font-[var(--font-heading)]">{project.title}</h4>
                                      <p className="text-sm text-gray-500 font-mono mt-1 bg-gray-100 inline-block px-2 py-1 rounded">{project.tech}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 max-w-xs md:text-right hidden md:block">
                                      {project.description}
                                    </p>
                                  </div>
                                  <div className="w-full h-[500px] bg-gray-100 relative group">
                                    <iframe 
                                      src={project.embedUrl}
                                      title={project.title}
                                      className="w-full h-full border-none"
                                      loading="lazy"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </AutoScrollContainer>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}