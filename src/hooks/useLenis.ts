import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * useLenis: Subtle, responsive desktop smooth scrolling
 * configured per Section 25 of specification to NOT interfere with
 * modals, fixed sidebars, textareas, or keyboard navigation.
 */
export const useLenis = (enabled: boolean = true) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Respect reduced motion settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    // Only apply smooth scrolling on desktop devices with fine pointer
    const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
    if (!isDesktop) {
      return;
    }

    try {
      const lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
      });

      lenisRef.current = lenis;

      let rafId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
      };
    } catch (err) {
      console.warn('[Lenis] Could not initialize smooth scroll:', err);
    }
  }, [enabled]);

  return lenisRef;
};
