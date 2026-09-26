import { useEffect } from 'react';

/**
 * useScrollReveal: Automatically observes elements with the class '.scroll-reveal'
 * or '.scroll-reveal-group' and activates their entry transitions as they scroll into view.
 */
export const useScrollReveal = (dependency?: unknown) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve after revealing so animation runs smoothly once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [dependency]);
};
