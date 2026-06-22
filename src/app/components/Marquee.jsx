"use client";

import { useMemo, useState, useEffect } from "react";
import useMarqueeImages from "../hooks/useMarqueeImages";
import Image from "next/image";

/**
 * Infinite horizontal marquee of case-study images.
 * If `initialImages` is provided, it renders immediately without fetching (SSR).
 * Otherwise, it falls back to the SWR-backed hook.
 */
export default function Marquee({ initialImages }) {
  const { images: swrImages = [], isLoading } = useMarqueeImages();

  const images = useMemo(() => {
    const raw = initialImages ?? swrImages;
    // raw items may be strings (old API) or objects (new API)
    const normalized = raw.map((img) =>
      typeof img === "string"
        ? { url: img, aspectRatio: 1, width: null, height: null }
        : img
    );

    // Separate into two height groups for visual variety.
    const tall = normalized.filter((img) => img.aspectRatio >= 1.3);
    const short = normalized.filter((img) => img.aspectRatio < 1.3);

    const interleaved = [];
    const max = Math.max(tall.length, short.length);
    for (let i = 0; i < max; i++) {
      if (tall[i]) interleaved.push(tall[i]);
      if (short[i]) interleaved.push(short[i]);
    }

    return interleaved;
  }, [initialImages, swrImages]);

  // Ensure the base set of images is always long enough to cover wide screens
  // We want at least 10 items in a single set to be safe.
  const baseSetCount = images.length > 0 ? Math.ceil(10 / images.length) : 1;
  const singleSet = Array(baseSetCount).fill(images).flat();

  // Duplicate EXACTLY ONCE for the seamless CSS -50% translateX loop
  const allImages = [...singleSet, ...singleSet];

  // Dynamic duration to keep speed consistent. Mobile images are smaller,
  // so they need a shorter duration to travel at the same visual velocity.
  const [isMobile, setIsMobile] = useState(true); // default to true to avoid hydration mismatch assuming mobile-first
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 5 seconds per image on mobile (faster), 8 seconds on desktop
  const animDuration = singleSet.length * (isMobile ? 5 : 8);

  // Varying skeleton heights
  const skeletonHeights = [
    "h-[240px] md:h-[420px]",
    "h-[150px] md:h-[260px]",
    "h-[270px] md:h-[480px]",
    "h-[190px] md:h-[320px]",
  ];

  return (
    <div className="w-full mt-16 md:mt-20 mb-16 overflow-hidden">
      <div 
        className="flex items-start animate-marquee will-change-transform" 
        style={{ width: "max-content", animationDuration: `${animDuration}s` }}
      >
        {isLoading && images.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className={`w-[200px] md:w-[300px] ${skeletonHeights[i % skeletonHeights.length]} mx-3 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0`}
            />
          ))
        ) : allImages.length === 0 ? (
          <div className="h-[190px] md:h-[340px] w-full flex items-center justify-center text-gray-400 text-sm">
            No projects to showcase yet.
          </div>
        ) : (
          allImages.map((img, i) => (
            <div
              key={i}
              className="w-[200px] md:w-[300px] mx-3 rounded-2xl shadow-lg flex-shrink-0 overflow-hidden relative"
              style={{
                aspectRatio: img.width && img.height ? `${img.width} / ${img.height}` : "3/4",
              }}
            >
              <Image
                src={img.url}
                alt={`Project showcase ${(i % images.length) + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 300px"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
