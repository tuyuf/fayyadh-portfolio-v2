"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// --- HELPER: EKSTRAK ID YOUTUBE & GET THUMBNAIL ---
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getYoutubeThumb = (url) => {
  const id = getYoutubeId(url);
  if (!id) return "/images/placeholder.webp";
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function Projects() {
  const [activeIndices, setActiveIndices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all 4 sections in parallel
        const [csRes, phRes, viRes, wpRes] = await Promise.all([
          fetch("/api/casestudies").then((r) => r.json()).catch(() => []),
          fetch("/api/photos").then((r) => r.json()).catch(() => []),
          fetch("/api/videos").then((r) => r.json()).catch(() => []),
          fetch("/api/webprojects").then((r) => r.json()).catch(() => []),
        ]);

        const hasAnyData = csRes.length > 0 || phRes.length > 0 || viRes.length > 0 || wpRes.length > 0;

        if (!hasAnyData) {
          // No CMS data yet — fallback to empty state
          setProjects([]);
          setLoading(false);
          return;
        }

        const sections = [];

        // --- UI/UX Design ---
        const uiuxItems = csRes.filter((p) => p.category === "uiux");
        if (uiuxItems.length > 0) {
          sections.push({
            id: "uiux",
            title: "UI / UX Design",
            type: "case-study",
            desc: "Designing digital experiences that are intuitive, elegant, and human-centered.",
            previewLimit: 3,
            items: uiuxItems.map((p) => ({
              title: p.title,
              subtitle: p.subtitle,
              credits: p.credits,
              description: p.description,
              link: p.link,
              images: p.images?.map((img) => img.imageUrl) || [],
            })),
          });
        }

        // --- Brand & Identity ---
        const brandItems = csRes.filter((p) => p.category === "brand");
        if (brandItems.length > 0) {
          sections.push({
            id: "brand",
            title: "Brand & Identity",
            type: "case-study",
            desc: "Crafting distinct visual identities that tell compelling stories and build trust.",
            previewLimit: 2,
            items: brandItems.map((p) => ({
              title: p.title,
              subtitle: p.subtitle,
              credits: p.credits,
              description: p.description,
              link: p.link,
              images: p.images?.map((img) => img.imageUrl) || [],
            })),
          });
        }

        // --- Photography & Videography ---
        if (phRes.length > 0 || viRes.length > 0) {
          const subCategories = [];

          if (phRes.length > 0) {
            subCategories.push({
              label: "Selected Photography",
              type: "gallery",
              slides: phRes.map((p) => p.imageUrl),
            });
          }

          if (viRes.length > 0) {
            subCategories.push({
              label: "Selected Videography",
              type: "video",
              items: viRes.map((v) => ({
                title: v.title,
                url: v.url,
                description: v.description,
              })),
            });
          }

          sections.push({
            id: "media",
            title: "Photography & Videography",
            type: "media",
            desc: "Capturing visual stories through light, movement, and emotion.",
            previewLimit: 2,
            subCategories,
          });
        }

        // --- Web Development ---
        if (wpRes.length > 0) {
          sections.push({
            id: "web",
            title: "Web Development",
            type: "code",
            desc: "Where logic meets aesthetics. Selected web projects built with intention.",
            previewLimit: 3,
            items: wpRes.map((p) => ({
              title: p.title,
              tech: Array.isArray(p.techStack) ? p.techStack.join(" • ") : p.techStack,
              url: p.projectUrl,
              description: p.description,
              embedUrl: p.embedUrl || p.projectUrl,
              thumbnailUrl: p.thumbnailUrl,
            })),
          });
        }

        setProjects(sections);
      } catch (error) {
        console.error("Fetch error:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleSection = (index) => {
    setActiveIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const displayProjects = projects;

  return (
    <section id="projects" className="relative w-full bg-white text-black py-20 border-t border-gray-200">
      <div className="flex justify-between items-center mb-10 px-6 md:px-24 text-sm tracking-widest uppercase text-gray-500 font-[var(--font-body)]">
        <span>My Expertise ({displayProjects.length.toString().padStart(2, '0')})</span>
        <span>Selected Works</span>
      </div>

      <div className="divide-y divide-gray-300 border-b border-gray-300">
        {displayProjects.map((category, i) => {
          const isOpen = activeIndices.includes(i);

          let previewSrcs = [];
          if (category.type === 'media') {
            const videoSub = category.subCategories.find(sub => sub.type === 'video');
            if (videoSub) {
              previewSrcs = videoSub.items.map(v => getYoutubeThumb(v.url));
            } else {
              const firstSub = category.subCategories[0];
              if (firstSub) {
                if (firstSub.type === 'gallery') {
                  previewSrcs = firstSub.slides || [];
                } else {
                  previewSrcs = firstSub.items.map(v => getYoutubeThumb(v.url));
                }
              }
            }
          } else if (category.type === 'code') {
            const cmsThumbnails = category.items?.map(item => item.thumbnailUrl).filter(Boolean);
            previewSrcs = cmsThumbnails && cmsThumbnails.length > 0 ? cmsThumbnails : ["/images/uiux3.webp", "/images/uiux4.webp", "/images/uiux6.webp"];
          } else if (category.type === 'case-study') {
            // Take the first few images from the first item
            previewSrcs = category.items?.[0]?.images?.slice(0, 3) || [];
          } else {
            previewSrcs = category.slides || [];
          }

          return (
            <div key={i} className="py-4">
              <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-6 min-h-[100px] px-6 md:px-24">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleSection(i)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors group">
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-3xl font-heading group-hover:text-gray-500">+</motion.span>
                  </button>
                  <h3 className="text-2xl md:text-4xl font-heading leading-tight cursor-pointer hover:text-gray-600 transition-colors" onClick={() => toggleSection(i)}>
                    {category.title}
                  </h3>
                </div>

                {!isOpen && (
                  <div className="flex justify-end w-full md:w-[60%]">
                    <div
                      className={`grid gap-3 w-full max-w-[640px] ${
                        category.previewLimit === 1
                          ? "grid-cols-1"
                          : category.previewLimit === 2
                          ? "grid-cols-2"
                          : "grid-cols-3"
                      }`}
                    >
                      {previewSrcs.slice(0, category.previewLimit).map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt="preview"
                          className="w-full h-[80px] md:h-[110px] object-cover rounded-xl transition-all duration-500"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="overflow-hidden">
                    <div className="mt-8 pb-12">
                      <div className="px-6 md:px-24">
                        <p className="text-gray-600 text-lg md:text-xl mb-24 max-w-3xl leading-relaxed md:ml-14">{category.desc}</p>
                      </div>

                      {/* --- MEDIA (Photography & Videography) --- */}
                      {category.type === 'media' && (
                        <motion.div
                          className="space-y-16"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {category.subCategories.map((sub, subIdx) => (
                            <motion.div key={subIdx} variants={fadeInVariants}>
                              <div className="flex items-center gap-4 mb-8 px-6 md:px-24 md:pl-[calc(6rem+3.5rem)]">
                                <span className="text-xs font-mono text-gray-400">0{subIdx + 1}</span>
                                <h4 className="text-xl md:text-2xl font-heading font-normal">{sub.label}</h4>
                                <div className="h-[1px] flex-1 bg-gray-100"></div>
                              </div>

                              {/* Sub-Category Type: GALLERY (Images) */}
                              {sub.type === 'gallery' && (
                                <motion.div
                                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 gap-8 px-6 md:px-24 md:pl-[calc(6rem+3.5rem)]"
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  {sub.slides.map((src, idx) => (
                                    <motion.div
                                      key={idx}
                                      className="snap-center shrink-0 rounded-lg overflow-hidden"
                                      variants={itemVariants}
                                      whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.3 } }}
                                    >
                                      <img src={src} alt="slide" className={`object-cover transition-transform ${idx % 2 === 0 ? "w-[360px] h-[500px]" : "w-[360px] h-[420px]"}`} />
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}

                              {/* Sub-Category Type: VIDEO */}
                              {sub.type === 'video' && (
                                <motion.div
                                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 gap-10 px-6 md:px-24 md:pl-[calc(6rem+3.5rem)]"
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  {sub.items.map((video, idx) => (
                                    <motion.a
                                      key={idx}
                                      href={video.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="snap-center shrink-0 w-[80vw] md:w-[480px] block group"
                                      variants={itemVariants}
                                      whileHover={{ y: -6, transition: { duration: 0.3 } }}
                                    >
                                      <div className="w-full bg-white border border-gray-200 overflow-hidden flex flex-col transition-all hover:border-gray-400 rounded-lg h-full">
                                        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                                          <img src={getYoutubeThumb(video.url)} alt={video.title} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" />
                                          {/* Optional Play Icon Overlay */}
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="px-5 py-5 flex flex-col gap-3 border-t border-gray-100">
                                          <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-xl font-heading leading-tight">{video.title}</h4>
                                            <ArrowUpRight size={18} className="shrink-0 text-gray-400 group-hover:text-black transition-colors mt-0.5" />
                                          </div>
                                          <p className="text-sm text-gray-500 leading-relaxed">{video.description}</p>
                                        </div>
                                      </div>
                                    </motion.a>
                                  ))}
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* --- WEB DEVELOPMENT --- */}
                      {category.type === 'code' && (
                        <motion.div
                          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 gap-10 px-6 md:px-24 md:pl-[calc(6rem+3.5rem)]"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {category.items.map((project, idx) => (
                            <motion.a
                              key={idx}
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="snap-center shrink-0 w-[85vw] md:w-[720px] block group"
                              variants={itemVariants}
                              whileHover={{ y: -8, transition: { duration: 0.4, ease: "easeOut" } }}
                            >
                              <div className="w-full bg-white border border-gray-100 overflow-hidden flex flex-col transition-all hover:border-black/20 hover:shadow-2xl hover:shadow-black/5 rounded-2xl h-full">
                                {/* Desktop Viewport Scaling Trick */}
                                <div className="w-full aspect-[16/10] bg-gray-50 relative overflow-hidden">
                                  <div className="absolute inset-0 w-[200%] h-[200%] origin-top-left scale-[0.5]">
                                    <iframe 
                                      src={project.embedUrl} 
                                      title={project.title} 
                                      className="w-full h-full border-none pointer-events-none" 
                                      loading="lazy" 
                                      tabIndex={-1} 
                                    />
                                  </div>
                                  {/* Subtle Overlay to prevent accidental interactions and add depth */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                                
                                <div className="px-8 py-8 flex flex-col gap-4 border-t border-gray-50">
                                  <div className="flex items-start justify-between gap-4">
                                    <h4 className="text-2xl md:text-3xl font-heading italic leading-tight text-gray-900 group-hover:text-black transition-colors">
                                      {project.title}
                                    </h4>
                                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-black transition-colors duration-500">
                                      <ArrowUpRight size={18} className="shrink-0 text-gray-400 group-hover:text-black transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
                                    {project.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-3 pt-2">
                                    <span className="w-6 h-[1px] bg-gray-200"></span>
                                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">
                                      {project.tech}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.a>
                          ))}
                        </motion.div>
                      )}

                      {/* --- CASE STUDY (UI/UX & BRAND) --- */}
                      {category.type === 'case-study' && (
                        <motion.div
                          className="space-y-24"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {category.items.map((study, idx) => (
                            <div key={idx}>
                              {/* Header Layout: Left (Title/Subtitle) - Right (Desc) */}
                              <div className="flex flex-col md:flex-row justify-between items-start mb-10 px-6 md:px-24 md:pl-[calc(6rem+3.5rem)] gap-8">
                                <div className="md:w-1/3">
                                  <h4 className="text-2xl md:text-3xl font-heading mb-2">{study.title}</h4>
                                  <p className="text-lg text-gray-500 font-heading">{study.subtitle}</p>
                                  {study.credits && <p className="text-xs text-gray-400 mt-4 font-mono">{study.credits}</p>}
                                </div>
                                <div className="md:w-1/2">
                                  <p className="text-gray-600 text-sm leading-relaxed">{study.description}</p>
                                  {study.link && (
                                    <a href={study.link} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm font-mono text-black hover:opacity-60 transition-opacity">
                                      Visit Site ↗
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Horizontal Scroll Images */}
                              <motion.div
                                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 gap-8 px-6 md:px-24 md:pl-[calc(6rem+3.5rem)]"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                {study.images.map((src, imgIdx) => (
                                  <motion.div
                                    key={imgIdx}
                                    className="snap-center shrink-0 rounded-lg overflow-hidden"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                  >
                                    <img src={src} alt={`${study.title} slide ${imgIdx}`} className={`object-cover transition-transform ${imgIdx % 2 === 0 ? "w-[360px] h-[500px]" : "w-[360px] h-[420px]"}`} />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          ))}
                        </motion.div>
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
