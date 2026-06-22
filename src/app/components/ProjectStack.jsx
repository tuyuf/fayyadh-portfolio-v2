"use client";

import { useState, useCallback, useEffect } from "react";
import ProjectCard from "./ProjectCard";

const CARD_WIDTH_MOBILE = 360;
const CARD_WIDTH_DESKTOP = 720;
const STACK_PEEK = 8; // px peek offset per stacked card
const GAP = 24;
const WEB_CARD_ASPECT = 9 / 14; // 14:9 aspect ratio (middle ground between 16:10 and 3:2)

export default function ProjectStack({ projects }) {
  const totalProjects = projects.length;
  const [collapsedCount, setCollapsedCount] = useState(0);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);

  // Height is purely based on aspect ratio now (pure 16:9 screenshot preview)
  const cardHeight = cardWidth * WEB_CARD_ASPECT;

  // Responsive card width
  useEffect(() => {
    const updateWidth = () => {
      const isMobile = window.innerWidth < 768;
      setCardWidth(isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const goNext = useCallback(() => {
    if (collapsedCount >= totalProjects - 1) return;
    setCollapsedCount((prev) => prev + 1);
  }, [collapsedCount, totalProjects]);

  const goPrev = useCallback(() => {
    if (collapsedCount <= 0) return;
    setCollapsedCount((prev) => prev - 1);
  }, [collapsedCount]);

  if (totalProjects === 0) return null;

  return (
    <div className="mt-6">
      {/* Cards container */}
      <div
        className="relative"
        style={{
          height: `${cardHeight}px`,
        }}
      >
        {projects.map((project, i) => {
          let x;
          let zIndex;

          if (i === 0) {
            x = 0;
            zIndex = 1;
          } else if (i <= collapsedCount) {
            // Stacked on card 0 with small horizontal peek
            x = i * STACK_PEEK;
            zIndex = i + 1;
          } else {
            // Spread out to the right of the stack
            const stackRightEdge = cardWidth + collapsedCount * STACK_PEEK;
            const spreadIndex = i - collapsedCount; // 1-based
            x = stackRightEdge + GAP + (spreadIndex - 1) * (cardWidth + GAP);
            zIndex = 1;
          }

          const isStacked = i > 0 && i <= collapsedCount;

          return (
            <div
              key={`stack-card-${project.id || i}`}
              className="absolute top-0 left-0 cursor-pointer group/card focus:outline-none focus:ring-2 focus:ring-[#051A24]/30 rounded-xl"
              tabIndex={0}
              role="button"
              aria-label={`${project.title} — press Enter to ${isStacked ? "expand" : "view details"}`}
              onClick={goNext}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goNext();
                }
              }}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                zIndex,
                transform: `translateX(${x}px)`,
                transition:
                  "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                className="w-full h-full rounded-xl overflow-hidden"
              >
                <ProjectCard project={project} index={i} variant="web" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows — below the stack, aligned left */}
      {totalProjects > 1 && (
        <div className="flex gap-2 mt-8">
          <button
            onClick={goPrev}
            disabled={collapsedCount <= 0}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${
              collapsedCount <= 0
                ? "border-[#051A24]/10 text-[#051A24]/20 cursor-not-allowed"
                : "border-[#051A24]/25 text-[#051A24]/70 hover:border-[#051A24] hover:bg-[#051A24] hover:text-white"
            }`}
            aria-label="Previous project"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={collapsedCount >= totalProjects - 1}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${
              collapsedCount >= totalProjects - 1
                ? "border-[#051A24]/10 text-[#051A24]/20 cursor-not-allowed"
                : "border-[#051A24]/25 text-[#051A24]/70 hover:border-[#051A24] hover:bg-[#051A24] hover:text-white"
            }`}
            aria-label="Next project"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}