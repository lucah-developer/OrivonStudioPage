import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function startSmoothScroll() {
  if (window.__orivonSmooth) return;
  window.__orivonSmooth = true;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce || coarse) return;

  let current = window.scrollY;
  let target = window.scrollY;
  let owned = false;

  const limit = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const locked = () => document.documentElement.classList.contains("orivon-intro");

  window.addEventListener("wheel", (event) => {
    if (locked()) return;
    event.preventDefault();
    target = Math.min(limit(), Math.max(0, target + event.deltaY * 0.62));
  }, { passive: false });

  window.addEventListener("scroll", () => {
    if (owned || locked()) return;
    current = target = window.scrollY;
  }, { passive: true });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    const node = id ? document.getElementById(id) : null;
    if (!node) return;
    event.preventDefault();
    target = Math.min(limit(), node.getBoundingClientRect().top + window.scrollY);
  });

  gsap.ticker.add(() => {
    if (locked()) {
      current = target = window.scrollY;
      return;
    }
    const delta = target - current;
    if (Math.abs(delta) < 0.4) {
      owned = false;
      return;
    }
    owned = true;
    current += delta * 0.075;
    window.scrollTo(0, current);
    ScrollTrigger.update();
  });
}
