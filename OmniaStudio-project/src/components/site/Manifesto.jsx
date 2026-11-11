import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manifesto.css";

gsap.registerPlugin(ScrollTrigger);

const LINE = "Menos ruido";
const LEAD = "El diseño no es apariencia. Es cómo las ideas se vuelven experiencia.";
const COPY = "Orivon combina criterio visual y desarrollo para que una marca se entienda, se recuerde y funcione. Más intención, menos ruido.";

export default function Manifesto() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const stage = root.querySelector(".orivon-essence__stage");
    const stack = root.querySelector(".orivon-essence__stack");
    const lines = [...root.querySelectorAll(".orivon-essence__line")];
    const texts = [...root.querySelectorAll(".orivon-essence__wipe")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 1000px)").matches;

    texts.forEach((text) => text.setAttribute("data-text", text.textContent.trim()));

    const fit = () => {
      const target = window.innerWidth * 0.995;
      lines.forEach((line) => {
        line.style.fontSize = "18vw";
      });
      const ratio = target / lines[0].scrollWidth;
      let size = 18 * ratio;
      lines.forEach((line) => {
        line.style.fontSize = `${size}vw`;
      });
      const stackHeight = lines[0].offsetHeight * lines.length;
      const maxHeight = window.innerHeight * 0.94;
      if (stackHeight > maxHeight) {
        size *= maxHeight / stackHeight;
        lines.forEach((line) => {
          line.style.fontSize = `${size}vw`;
        });
      }
    };
    fit();
    document.fonts?.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });

    if (reduce) {
      gsap.set(lines, { x: 0, y: 0, scale: 1 });
      gsap.set(lines[0], { autoAlpha: 0 });
      gsap.set(lines[2], { autoAlpha: 0 });
      texts.forEach((text) => text.style.setProperty("--clip-value", "0%"));
      return undefined;
    }

    const ctx = gsap.context(() => {
      texts.forEach((textElement) => {
        ScrollTrigger.create({
          trigger: textElement,
          start: "top 50%",
          end: "bottom 50%",
          scrub: 1.15,
          onUpdate: (self) => {
            const clipValue = Math.max(0, 100 - self.progress * 100);
            textElement.style.setProperty("--clip-value", `${clipValue}%`);
          },
        });
      });

      ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "top top",
        scrub: 1.15,
        onUpdate: (self) => {
          gsap.set(lines[0], { x: `${100 - self.progress * 100}%` });
          gsap.set(lines[1], { x: `${-100 + self.progress * 100}%` });
          gsap.set(lines[2], { x: `${100 - self.progress * 100}%` });
        },
      });

      const stackScroll = 1.35;
      const shrinkScroll = 0.52;
      const pinScroll = stackScroll + shrinkScroll;

      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * pinScroll}`,
        pin: true,
        pinSpacing: false,
        scrub: 1.15,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const stackEnd = stackScroll / pinScroll;
          if (self.progress <= stackEnd) {
            const yProgress = self.progress / stackEnd;
            gsap.set(stack, { y: 0 });
            gsap.set(lines[0], { x: 0, y: `${yProgress * 100}%`, scale: 1 });
            gsap.set(lines[1], { x: 0, y: 0, scale: 1 });
            gsap.set(lines[2], { x: 0, y: `${yProgress * -100}%`, scale: 1 });
          } else {
            const scaleProgress = (self.progress - stackEnd) / (1 - stackEnd);
            const minScale = narrow ? 0.36 : 0.2;
            const scale = 1 - scaleProgress * (1 - minScale);
            gsap.set(stack, { y: scaleProgress * window.innerHeight * 0.18 });
            gsap.set(lines[0], { x: 0, y: "100%", scale });
            gsap.set(lines[1], { x: 0, y: 0, scale });
            gsap.set(lines[2], { x: 0, y: "-100%", scale });
          }
        },
      });
    }, root);

    const onResize = () => {
      fit();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="orivon-essence" ref={rootRef}>
      <section className="orivon-essence__about" aria-labelledby="orivon-manifesto-title">
        <p className="orivon-essence__wipe" id="orivon-manifesto-title">{LEAD}</p>
      </section>

      <section className="orivon-essence__stage" aria-hidden="true">
        <div className="orivon-essence__stack">
          <p className="orivon-essence__line">{LINE}</p>
          <p className="orivon-essence__line">{LINE}</p>
          <p className="orivon-essence__line">{LINE}</p>
        </div>
      </section>

      <section className="orivon-essence__copy">
        <p className="orivon-essence__wipe">{COPY}</p>
      </section>
    </div>
  );
}
