"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import CardNav from "./components/CardNav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import SplashScreen from "./components/SplashScreen";
import "./globals.css";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // --- 1. FIX SCROLL PROBLEM ---
  useEffect(() => {
    // Matikan scroll restoration bawaan browser (agar selalu mulai dari paling atas)
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }

    // Paksa scroll ke posisi (0,0) saat halaman dimuat
    window.scrollTo(0, 0);

    // Kunci scroll body selama Splash Screen aktif
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

  }, [showSplash]);

  const navItems = [
    {
      label: "Work",
      links: [
        { label: "Projects", href: "#projects" },
      ],
    },
    {
      label: "About",
      links: [
        { label: "Who I Am", href: "#about" },
        { label: "Skills", href: "#skills" },
      ],
    },
    {
      label: "Contact",
      links: [
        { label: "Get in Touch", href: "#contact" },
        {
          label: "LinkedIn ↗",
          href: "https://www.linkedin.com/in/fayyadhmuhammadhabibie",
        },
      ],
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen 
            onComplete={() => {
              setShowSplash(false);
              // Kembalikan scroll ke auto setelah animasi selesai
              document.body.style.overflow = "auto"; 
            }} 
          />
        )}
      </AnimatePresence>

      <main className="overflow-x-hidden relative bg-white text-black">
        {/* Navbar */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full max-w-4xl px-4">
          <CardNav items={navItems} />
        </div>

        {/* ===== Hero Section ===== */}
        <Hero />

        {/* ===== Projects Section ===== */}
        <Projects />

        {/* ===== About Section ===== */}
        <About />

        {/* ===== Skills Section ===== */}
        <Skills />

        {/* ===== Contact & Footer ===== */}
        <Contact />
      </main>
    </>
  );
}