"use client";

import { useMemo } from "react";
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

  // Duplicate for seamless infinite scroll
  const allImages = [...images, ...images];

  // Varying skeleton heights
  const skeletonHeights = [
    "h-[240px] md:h-[420px]",
    "h-[150px] md:h-[260px]",
    "h-[270px] md:h-[480px]",
    "h-[190px] md:h-[320px]",
  ];

  return (
    <div className="w-full mt-16 md:mt-20 mb-16 overflow-hidden">
      <div className="flex items-start animate-marquee" style={{ width: "max-content" }}>
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
