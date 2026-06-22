"use client";

import { useRef, useLayoutEffect, useState, useMemo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback Images ─── */
const FALLBACKS = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493868181083-32c5a87b0e80?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469334031218-378f6bb84726?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1501854140884-074cf2b21d25?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505144808399-5b1a9f8e1c47?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519608487953-e155c8e2b06f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

function fallbackPhotos() {
  return FALLBACKS.map((url, i) => ({
    id: `fb-${i}`,
    imageUrl: url,
    caption: "Photography",
  }));
}

/* ─── Viewport Hook ─── */
function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

/* ════════════════════════════════════════ */
export default function PhotographyUnstack({ photos: propPhotos }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const itemsRef = useRef([]);
  const [photos, setPhotos] = useState([]);
  const { width, height } = useViewportSize();

  /* ─── Fetch or use prop data ─── */
  useLayoutEffect(() => {
    if (Array.isArray(propPhotos) && propPhotos.length > 0) {
      setPhotos(propPhotos.slice(0, 12));
      return;
    }
    let cancel = false;
    fetch("/api/photos")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancel) return;
        const fetched = Array.isArray(data) ? data : data.photos || [];
        setPhotos(
          fetched.length > 0 ? fetched.slice(0, 12) : fallbackPhotos()
        );
      })
      .catch(() => {
        if (!cancel) setPhotos(fallbackPhotos());
      });
    return () => {
      cancel = true;
    };
  }, [propPhotos]);

  /* ─── Responsive grid math ─── */
  const grid = useMemo(() => {
    if (!width || !height || photos.length === 0) return null;

    const count = Math.min(photos.length, 12);
    let cols = 1;
    if (width >= 768) cols = 3;
    if (width >= 1280) cols = 4;
    if (count <= 2) cols = 1;
    else if (count <= 4 && width >= 768) cols = 2;
    else if (count <= 6 && width >= 1280) cols = 3;

    const rows = Math.ceil(count / cols);
    const gap = width < 768 ? 16 : 24;

    const maxGridW = Math.min(width * 0.94, 1440);
    const maxGridH = height * 0.78;

    let itemW = (maxGridW - (cols - 1) * gap) / cols;
    let itemH = (itemW * 4) / 3;
    const rawTotalH = rows * itemH + (rows - 1) * gap;

    if (rawTotalH > maxGridH) {
      itemH = (maxGridH - (rows - 1) * gap) / rows;
      itemW = (itemH * 3) / 4;
    }

    const totalGridW = cols * itemW + (cols - 1) * gap;
    const totalGridH = rows * itemH + (rows - 1) * gap;

    const heroMinScale = width < 768 ? 1.3 : 1.6;
    const heroScale = Math.max(
      (Math.min(width, height) * 0.65) / itemW,
      heroMinScale
    );

    return {
      count,
      cols,
      rows,
      itemW,
      itemH,
      gap,
      totalGridW,
      totalGridH,
      heroScale,
    };
  }, [width, height, photos.length]);

  const isMobile = width > 0 && width < 768;

  /* ─── GSAP ScrollTrigger timeline ─── */
  useLayoutEffect(() => {
    if (isMobile || !containerRef.current || !grid) return;

    const ctx = gsap.context(() => {
      const heroImage = itemsRef.current[0];
      const otherImages = itemsRef.current.slice(1, grid.count);

      /* Initial stack: everything dead center */
      if (heroImage) {
        gsap.set(heroImage, {
          position: "absolute",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          width: grid.itemW,
          height: grid.itemH,
          x: 0,
          y: 0,
          scale: grid.heroScale,
          opacity: 1,
          zIndex: 100,
        });
      }

      otherImages.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          position: "absolute",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          width: grid.itemW,
          height: grid.itemH,
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          zIndex: grid.count - i - 1,
        });
      });

      /* Scrubbed timeline */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: "+=300%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      /* Typography fade */
      if (textRef.current) {
        tl.to(textRef.current, { opacity: 0, duration: 0.3, ease: "none" }, 0);
      }

      /* Animate EVERY image simultaneously at position 0 */
      if (heroImage) {
        const targetX =
          0 * (grid.itemW + grid.gap) + grid.itemW / 2 - grid.totalGridW / 2;
        const targetY =
          0 * (grid.itemH + grid.gap) + grid.itemH / 2 - grid.totalGridH / 2;

        tl.to(
          heroImage,
          {
            scale: 1,
            x: targetX,
            y: targetY,
            duration: 1,
            ease: "none",
          },
          0
        );
      }

      otherImages.forEach((el, i) => {
        if (!el) return;
        const index = i + 1;
        const col = index % grid.cols;
        const row = Math.floor(index / grid.cols);
        const targetX =
          col * (grid.itemW + grid.gap) + grid.itemW / 2 - grid.totalGridW / 2;
        const targetY =
          row * (grid.itemH + grid.gap) + grid.itemH / 2 - grid.totalGridH / 2;

        tl.to(
          el,
          {
            scale: 1,
            opacity: 1,
            x: targetX,
            y: targetY,
            duration: 1,
            ease: "none",
          },
          0
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [grid, photos]);

  /* ─── SSR / loading guard ─── */
  if (!grid) {
    return (
      <section ref={containerRef} className="relative h-screen bg-white">
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="aspect-[3/4] w-[60vw] max-w-[360px] rounded-xl bg-[#E0EBF0] animate-pulse" />
        </div>
      </section>
    );
  }

  const activePhotos = photos.slice(0, grid.count);

  if (isMobile) {
    return (
      <motion.section 
        className="bg-white px-6 pb-24 max-w-[600px] mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpItem} className="mb-12 border-b border-[#051A24]/20 pb-4">
          <h2 className="font-pp-mondwest text-3xl md:text-4xl text-[#051A24] tracking-tight">
            Photography
          </h2>
        </motion.div>
        <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3 md:gap-4">
          {photos.slice(0, 8).map((photo) => (
            <motion.div
              variants={fadeUpItem}
              key={photo.id}
              className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-[#E0EBF0] relative"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption || "Photography"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-screen bg-white">
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h2
            ref={textRef}
            className="font-pp-mondwest text-[12vw] md:text-[8vw] text-[#051A24] tracking-tighter whitespace-nowrap"
            style={{ opacity: 0.25 }}
          >
            PHOTOGRAPHY
          </h2>
        </div>

        {/* Fan-out Image Layers */}
        <div className="relative w-full h-full">
          {activePhotos.map((photo, i) => (
              <div
              key={photo.id}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="aspect-[3/4] overflow-hidden rounded-xl shadow-md relative will-change-transform"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption || "Photography"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 25vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
