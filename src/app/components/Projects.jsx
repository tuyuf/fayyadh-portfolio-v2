"use client";

import { useMemo } from "react";
import ProjectCategorySection from "./ProjectCategorySection";
import PhotographyUnstack from "./PhotographyUnstack";

const CATEGORIES = [
  {
    id: "uiux",
    num: "03",
    title: "UI / UX Design",
    preview:
      "Crafting intuitive interfaces and user-centered experiences that bridge clarity and delight. Every pixel is placed with purpose.",
  },
  {
    id: "brand",
    num: "04",
    title: "Brand & Identity",
    preview:
      "Building memorable visual identities and cohesive brand systems from the ground up. From logomarks to full guidelines.",
  },
  {
    id: "webdev",
    num: "05",
    title: "Web Development",
    preview:
      "Engineering performant, interactive web experiences with modern technologies. From concept to deployment.",
  },
];

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
      <div className="max-w-[900px] mx-auto px-6 mb-16 md:mb-24">
        <ProjectCategorySection
          id={uiuxCat.id}
          num={uiuxCat.num}
          title={uiuxCat.title}
          preview={uiuxCat.preview}
          projects={getProjectsForCategory("uiux")}
        />
      </div>

      {/* ===== 03 Brand & Identity ===== */}
      <div className="max-w-[900px] mx-auto px-6 mb-16 md:mb-24">
        <ProjectCategorySection
          id={brandCat.id}
          num={brandCat.num}
          title={brandCat.title}
          preview={brandCat.preview}
          projects={getProjectsForCategory("brand")}
        />
      </div>

      {/* ===== 04 Web Development ===== */}
      <div className="max-w-[900px] mx-auto px-6 mb-16 md:mb-24">
        <ProjectCategorySection
          layout="horizontal"
          id={webCat.id}
          num={webCat.num}
          title={webCat.title}
          preview={webCat.preview}
          projects={getProjectsForCategory("webdev")}
        />
      </div>

      {/* ===== Transition: Photography Philosophy ===== */}
      <div className="max-w-[440px] mx-auto px-6 mb-16 md:mb-24 min-h-[100dvh] flex flex-col items-start justify-center text-left">
        <h2 className="font-pp-mondwest text-3xl md:text-5xl text-[#051A24] leading-[1.15] tracking-tight mb-6">
          Beyond the screen
        </h2>
        <p className="text-base md:text-lg text-[#051A24]/60 leading-relaxed">
          Capturing fleeting moments and turning them into timeless stories.
          From intimate portraits to sweeping landscapes, every frame is a deliberate pause in time —
          a visual narrative shaped by light, composition, and the quiet poetry of the everyday.
        </p>

      </div>

      {/* ===== 05 Photography & Videography (full width) ===== */}
      <div id="photovideo" className="mb-16 md:mb-24">
        <PhotographyUnstack photos={allPhotos} videos={allVideos} />
      </div>
    </>
  );
}
