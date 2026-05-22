"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that triggers a fade-in-up animation when an element
 * scrolls into view using IntersectionObserver.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1). Default: 0.1
 * @param {string} options.rootMargin - Root margin for observer. Default: "0px"
 * @returns {{ ref: React.RefObject, isInView: boolean }}
 */
export function useInViewAnimation({ threshold = 0.1, rootMargin = "0px" } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isInView };
}
