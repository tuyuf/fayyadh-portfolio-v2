"use client";

import { useState, useEffect } from "react";
import CardNav from "./components/CardNav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import SplashScreen from "./components/SplashScreen";
import "./globals.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Splash screen delay
  useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 5000);
  return () => clearTimeout(timer);
  }, []);


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
        href: "https://www.linkedin.com/in/fayyadh-muhammad-habibie",
      },
    ],
  },
];


  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
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
      )}
    </>
  );
}
