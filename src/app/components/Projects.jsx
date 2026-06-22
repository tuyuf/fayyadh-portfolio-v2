"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import ProjectCategorySection from "./ProjectCategorySection";
import PhotographyUnstack from "./PhotographyUnstack";

const CATEGORIES = [
  {
    id: "uiux",
    num: "03",
    title: "UI/UX Designer",
    preview: "Here's some of the projects:",
  },
  {
    id: "brand",
    num: "04",
    title: "Brand & Identity",
    preview: "Here's some of the projects:",
  },
  {
    id: "webdev",
    num: "05",
    title: "Web Development",
    preview: "Here's some of the projects:",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Projects({ caseStudies, photos, videos, webProjects }) {
  const { projects, allPhotos, allVideos } = useMemo(() => {
    const allProjects = [];

    // Case studies (uiux, brand)
    if (caseStudies?.length > 0) {
      caseStudies.forEach((p) => {
        allProjects.push({
          _source: "casestudy",
          categoryId:
            p.category === "uiux"
              ? "uiux"
              : p.category === "brand"
              ? "brand"
              : null,
          title: p.title,
          subtitle: p.subtitle,
          credits: p.credits,
          description: p.description,
          images: p.images || [],
          imageUrl: p.images?.[0]?.imageUrl || null,
          link: p.link,
        });
      });
    }

    // Web projects -> webdev
    if (webProjects?.length > 0) {
      webProjects.forEach((p) => {
        allProjects.push({
          _source: "webproject",
          categoryId: "webdev",
          title: p.title,
          subtitle: Array.isArray(p.techStack)
            ? p.techStack.join(" · ")
            : typeof p.techStack === "string"
            ? p.techStack
            : null,
          credits: null,
          description: p.description,
          images: p.thumbnailUrl ? [{ imageUrl: p.thumbnailUrl }] : [],
          imageUrl: p.thumbnailUrl || null,
          link: p.projectUrl || null,
        });
      });
    }

    return {
      projects: allProjects,
      allPhotos: photos || [],
      allVideos: videos || [],
    };
  }, [caseStudies, photos, videos, webProjects]);

  const loading = !caseStudies && !photos && !videos && !webProjects;

  const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
  const getProjectsForCategory = (categoryId) =>
    projects.filter((p) => p.categoryId === categoryId);

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto px-6 py-20">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#051A24]/20 border-t-[#051A24] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const uiuxCat = getCategory("uiux");
  const brandCat = getCategory("brand");
  const webCat = getCategory("webdev");

  return (
    <>
      {/* ===== 02 UI/UX Design ===== */}
      <ProjectCategorySection
        id={uiuxCat.id}
        num={uiuxCat.num}
        title={uiuxCat.title}
        preview={uiuxCat.preview}
        projects={getProjectsForCategory("uiux")}
      />

      {/* ===== 03 Brand & Identity ===== */}
      <ProjectCategorySection
        id={brandCat.id}
        num={brandCat.num}
        title={brandCat.title}
        preview={brandCat.preview}
        projects={getProjectsForCategory("brand")}
      />

      {/* ===== 04 Web Development ===== */}
      <ProjectCategorySection
        layout="horizontal"
        id={webCat.id}
        num={webCat.num}
        title={webCat.title}
        preview={webCat.preview}
        projects={getProjectsForCategory("webdev")}
      />

      {/* ===== Projects Recap ===== */}
      <motion.div 
        id="recap" 
        className="max-w-[600px] mx-auto px-6 mt-12 md:mt-24 mb-32 md:mb-64 text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpItem} className="flex justify-between items-baseline border-b border-[#051A24]/20 pb-4 mb-6">
          <h2 className="font-pp-mondwest text-3xl md:text-4xl text-[#051A24] leading-[1.15] tracking-tight">
            Projects
          </h2>
          <span className="font-pp-mondwest text-2xl md:text-3xl text-[#051A24]/50">
            {projects.length}
          </span>
        </motion.div>

        <motion.div variants={fadeUpItem} className="flex justify-between items-center pb-3 mb-2 text-[#051A24]/40 text-[11px] md:text-xs tracking-widest uppercase font-semibold border-b border-[#051A24]/10">
          <span>Client</span>
          <span>Services</span>
        </motion.div>

        <ul className="flex flex-col">
          {projects.map((p, i) => (
            <motion.li 
              key={i} 
              variants={fadeUpItem}
              className="flex justify-between items-center py-4 border-b border-[#051A24]/10"
            >
              <span className="text-base md:text-lg font-medium text-[#051A24]">
                {p.title}
              </span>
              <span className="text-sm md:text-sm text-[#051A24]/60 text-right max-w-[50%]">
                {p.subtitle || "—"}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* ===== 05 Photography & Videography (full width) ===== */}
      <div id="photovideo" className="mb-16 md:mb-24">
        <PhotographyUnstack photos={allPhotos} videos={allVideos} />
      </div>
    </>
  );
}
