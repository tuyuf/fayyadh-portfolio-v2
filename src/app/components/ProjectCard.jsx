"use client";

import Image from "next/image";
import ImageCarousel from "./ImageCarousel";

export default function ProjectCard({ project, index, variant = "portrait" }) {
  const hasMultipleImages = project.images && project.images.length > 1;

  const isWeb = variant === "web";

  return (
    <div className="group relative h-full" style={{ perspective: "1000px" }}>
      {/* Base content: 16:9 screenshot preview only for web */}
      {isWeb ? (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#F2F2F2]">
          {hasMultipleImages ? (
            <ImageCarousel images={project.images} projectTitle={project.title} variant={variant} />
          ) : project.images?.[0]?.imageUrl ? (
            <Image
              src={project.images[0].imageUrl}
              alt={project.images[0].altText || project.title}
              className="object-cover rounded-xl"
              fill
              sizes="(max-width: 768px) 260px, 360px"
              loading="lazy"
            />
          ) : project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              className="object-cover rounded-xl"
              fill
              sizes="(max-width: 768px) 260px, 360px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-[#051A24]/30 uppercase tracking-wider">Preview not available</span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Project header */}
          <div className={`${isWeb ? "mb-4 min-h-[4.2rem] flex flex-col" : "mb-6 pb-4"}`}>
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-block focus:outline-none focus:ring-2 focus:ring-[#051A24]/30 rounded-sm"
              >
                <h4 className={`font-pp-mondwest text-[#051A24] group-hover/link:opacity-70 transition-opacity ${isWeb ? "text-xl md:text-2xl leading-tight line-clamp-2" : "text-xl md:text-2xl lg:text-3xl pb-2"}`}>
                  {project.title}
                </h4>
              </a>
            ) : (
              <h4 className={`font-pp-mondwest text-[#051A24] ${isWeb ? "text-xl md:text-2xl leading-tight line-clamp-2" : "text-xl md:text-2xl lg:text-3xl pb-2"}`}>
                {project.title}
              </h4>
            )}

            <p className={`mt-1 ${isWeb ? "text-[11px] md:text-xs text-[#051A24]/50 uppercase tracking-wider min-h-[1.2rem]" : "text-xs md:text-sm text-[#051A24]/70 font-medium"}`}>
              {(project.subtitle || project.credits) ? (project.subtitle || project.credits) : (isWeb ? "\u00A0" : null)}
            </p>
          </div>

          {/* Description */}
          <p className={`leading-relaxed ${isWeb ? "text-sm text-[#051A24]/70 max-w-xl line-clamp-3 min-h-[3.75rem]" : "text-base md:text-lg text-[#051A24]/80 max-w-2xl mb-6"}`}>
            {project.description || (isWeb ? "\u00A0" : "")}
          </p>

          {/* Image carousel or single image */}
          {hasMultipleImages ? (
            <ImageCarousel images={project.images} projectTitle={project.title} variant={variant} />
          ) : project.images?.[0]?.imageUrl ? (
            <div className={`mt-6 overflow-hidden rounded-xl ${isWeb ? "w-full aspect-video" : "w-[320px] md:w-[540px] aspect-[3/4]"}`}>
              <Image
                src={project.images[0].imageUrl}
                alt={project.images[0].altText || project.title}
                className="object-cover rounded-xl"
                fill
                sizes="(max-width: 768px) 320px, 540px"
                loading="lazy"
              />
            </div>
          ) : project.imageUrl ? (
            <div className={`mt-6 overflow-hidden rounded-xl ${isWeb ? "w-full aspect-video" : "w-[320px] md:w-[540px] aspect-[3/4]"}`}>
              <Image
                src={project.imageUrl}
                alt={project.title}
                className="object-cover rounded-xl"
                fill
                sizes="(max-width: 768px) 320px, 540px"
                loading="lazy"
              />
            </div>
          ) : isWeb ? (
            <div className="mt-6 w-full aspect-video rounded-xl bg-[#F2F2F2] flex items-center justify-center">
              <span className="text-xs text-[#051A24]/30 uppercase tracking-wider">Preview not available</span>
            </div>
          ) : null}
        </>
      )}

      {/* Hover overlay - only for web variant */}
      {isWeb && (
        <div
          className="absolute inset-0 rounded-xl bg-[#051A24]/85 flex flex-col justify-center items-center px-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out backdrop-blur-sm"
          style={{
            transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        >
          <h4 className="font-pp-mondwest text-xl md:text-2xl text-[#F6FCFF] text-center leading-tight mb-2">
            {project.title}
          </h4>

          {project.subtitle && (
            <p className="font-mono text-[10px] text-[#F6FCFF]/70 uppercase tracking-widest text-center mb-4">
              {project.subtitle}
            </p>
          )}

          {project.description && (
            <p className="text-sm text-[#F6FCFF]/80 text-center leading-relaxed mb-6 line-clamp-3 max-w-[280px]">
              {project.description}
            </p>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F6FCFF] text-[#051A24] text-sm font-medium hover:bg-white transition-colors duration-300"
            >
              Visit Project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
