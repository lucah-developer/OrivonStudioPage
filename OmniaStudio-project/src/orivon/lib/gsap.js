import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE_OUT = 'expo.out';
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Corre un setup de GSAP con limpieza automática (gsap.context). */
export function useGsap(setup, deps = []) {
  useLayoutEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(setup);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
