"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

const CARD_WIDTH_MOBILE = 160;
const CARD_WIDTH_DESKTOP = 200;
const STACK_PEEK = 8; // px peek offset per stacked card

export default function ImageCarousel({ images, projectTitle, variant = "portrait" }) {
  const totalImages = images.length;
  // collapsedCount = how many images have collapsed onto the first image
  // 0 = all spread, 1 = image[1] stacked on image[0], 2 = image[1]+image[2] stacked, etc.
  const [collapsedCount, setCollapsedCount] = useState(0);
  const wrapperRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);
  const [gap, setGap] = useState(14);
  // Lock card width after first measurement so it never changes due to container shrinking
  const lockedSizes = useRef(null);

  // Responsive sizing — only on mount and window resize
  useEffect(() => {
    const updateSizes = () => {
      if (!wrapperRef.current) return;
      const containerWidth = wrapperRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      const currentGap = isMobile ? 10 : 14;
      const maxCards = Math.min(3, totalImages);
      const calculatedWidth = Math.floor(
        (containerWidth - currentGap * (maxCards - 1)) / maxCards
      );
      const finalWidth = Math.max(120, Math.min(calculatedWidth, 240));

      // Lock sizes on first measurement
      if (!lockedSizes.current) {
        lockedSizes.current = { cardWidth: finalWidth, gap: currentGap };
      }
      setCardWidth(lockedSizes.current.cardWidth);
      setGap(lockedSizes.current.gap);
    };
    updateSizes();
    const handleResize = () => {
      // Reset lock on actual window resize so it adapts
      lockedSizes.current = null;
      updateSizes();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalImages]);

  // Click > : collapse one more (sequential: 2→1, 3→stack, 4→stack…)
  const goNext = useCallback(() => {
    if (collapsedCount >= totalImages - 1) return;
    setCollapsedCount((prev) => prev + 1);
  }, [collapsedCount, totalImages]);

  // Click < : spread one back out
  const goPrev = useCallback(() => {
    if (collapsedCount <= 0) return;
    setCollapsedCount((prev) => prev - 1);
  }, [collapsedCount]);

  const isWeb = variant === "web";
  const aspectRatio = isWeb ? "16 / 9" : "3 / 4";
  const aspectNum = isWeb ? 9 / 16 : 4 / 3;

  if (totalImages === 0) return null;

  // Spread count = remaining visible spread columns (stack counts as 1)
  const spreadCount = totalImages - collapsedCount;
  const containerHeight = cardWidth * aspectNum;

  return (
    <div className="mt-6" ref={wrapperRef}>
      {/* Cards container */}
      <div
        className="relative"
        style={{
          height: `${containerHeight}px`,
        }}
      >
        {images.map((img, i) => {
          let x, zIndex;

          if (i === 0) {
            // Base image: always at position 0
            x = 0;
            zIndex = 1;
          } else if (i <= collapsedCount) {
            // Collapsed: stacked on image[0] with peek offset
            x = i * STACK_PEEK;
            zIndex = i + 1;
          } else {
            // Spread: position relative to the ACTUAL stack width
            // Stack right edge = cardWidth + collapsedCount * STACK_PEEK
            const stackRightEdge = cardWidth + collapsedCount * STACK_PEEK;
            const spreadIndex = i - collapsedCount; // 1-based (1 = first after stack)
            x = stackRightEdge + gap + (spreadIndex - 1) * (cardWidth + gap);
            zIndex = 1;
          }

          const isStacked = i > 0 && i <= collapsedCount;

          return (
            <div
              key={`card-${i}`}
              className="absolute top-0 left-0 overflow-hidden rounded-xl"
              style={{
                width: `${cardWidth}px`,
                zIndex,
                transform: `translateX(${x}px)`,
                transition:
                  "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
                boxShadow: isStacked
                  ? "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)"
                  : "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${projectTitle} ${i + 1}`}
                width={cardWidth}
                height={Math.round(cardWidth * aspectNum)}
                className="object-cover rounded-xl"
                style={{ aspectRatio }}
                loading="lazy"
                sizes={`${cardWidth}px`}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation arrows — below first card, aligned left */}
      {totalImages > 1 && (
        <div className="flex gap-2 mt-8">
          <button
            onClick={goPrev}
            disabled={collapsedCount <= 0}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${collapsedCount <= 0
                ? "border-[#051A24]/10 text-[#051A24]/20 cursor-not-allowed"
                : "border-[#051A24]/25 text-[#051A24]/70 hover:border-[#051A24] hover:bg-[#051A24] hover:text-white"
              }`}
            aria-label="Spread image"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={collapsedCount >= totalImages - 1}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${collapsedCount >= totalImages - 1
                ? "border-[#051A24]/10 text-[#051A24]/20 cursor-not-allowed"
                : "border-[#051A24]/25 text-[#051A24]/70 hover:border-[#051A24] hover:bg-[#051A24] hover:text-white"
              }`}
            aria-label="Stack image"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
