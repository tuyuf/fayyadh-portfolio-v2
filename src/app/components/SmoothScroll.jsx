"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // jangan inisialisasi dua kali
    if (lenisRef.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,  // jangan smooth-in scroll sentuhan (hindari lag di iOS)
    });

    lenisRef.current = lenis;

    // ── Sinkronisasi ringan ke ScrollTrigger ──
    lenis.on("scroll", ScrollTrigger.update);

    // Pakai ticker GSAP dengan delta yang stabil (60fps)
    const rafCallback = (time) => {
      // time adalah dalam detik; Lenis mau dalam milidetik
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);

    // Refresh ScrollTrigger setelah Lenis siap (layout stabil)
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
