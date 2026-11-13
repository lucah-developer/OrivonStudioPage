import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manifesto.css";

gsap.registerPlugin(ScrollTrigger);

const LINE = "Menos ruido";
const LEAD = "El diseño no es apariencia. Es cómo las ideas se vuelven experiencia.";
const COPY = "Orivon combina criterio visual y desarrollo para que una marca se entienda, se recuerde y funcione. Más intención, menos ruido.";

function splitBlockLines(element) {
  const source = element.getAttribute("data-copy") || element.textContent;
  element.textContent = source;
  const words = source.replace(/\s+/g, " ").trim().split(" ");
  element.replaceChildren();
  const measurers = words.map((word) => {
    const span = document.createElement("span");
    span.textContent = word;
    return span;
  });
  measurers.forEach((span, index) => {
    element.appendChild(span);
    if (index < measurers.length - 1) element.appendChild(document.createTextNode(" "));
  });

  const groups = [];
  let group = [];
  let last = null;
  measurers.forEach((span) => {
    const top = span.getBoundingClientRect().top;
    if (last === null || Math.abs(top - last) < 4) {
      group.push(span);
      last = top;
    } else {
      groups.push(group);
      group = [span];
      last = top;
    }
  });
  if (group.length) groups.push(group);

  const built = groups.map((wordGroup) => {
    const wrapper = document.createElement("span");
    wrapper.className = "block-line-wrapper";
    const line = document.createElement("span");
    line.className = "block-line";
    wordGroup.forEach((span, index) => {
      line.appendChild(span);
      if (index < wordGroup.length - 1) line.appendChild(document.createTextNode(" "));
    });
    const block = document.createElement("span");
    block.className = "block-revealer";
    block.setAttribute("aria-hidden", "true");
    wrapper.append(line, block);
    return { wrapper, line, block };
  });

  element.replaceChildren(...built.map((item) => item.wrapper));
  return built;
}

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
    let ctx;

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

    const revealCopy = () => {
      if (reduce) return;
      texts.forEach((textElement) => {
        const reading = splitBlockLines(textElement);
        gsap.set(reading.map((item) => item.line), { opacity: 0 });
        gsap.set(reading.map((item) => item.block), { scaleX: 0, transformOrigin: "left center" });
        reading.forEach(({ line, block }, index) => {
          const timeline = gsap.timeline({ paused: true, delay: index * 0.15 });
          timeline.to(block, { scaleX: 1, duration: 0.75, ease: "power4.inOut" });
          timeline.set(line, { opacity: 1 });
          timeline.set(block, { transformOrigin: "right center" });
          timeline.to(block, { scaleX: 0, duration: 0.75, ease: "power4.inOut" });
          ScrollTrigger.create({
            trigger: textElement,
            start: "top 82%",
            once: true,
            onEnter: () => timeline.play(),
          });
        });
      });
    };

    fit();
    if (reduce) {
      gsap.set(lines, { x: 0, y: 0, scale: 1 });
      gsap.set(lines[0], { autoAlpha: 0 });
      gsap.set(lines[2], { autoAlpha: 0 });
    } else {
      ctx = gsap.context(() => {
        revealCopy();

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
    }

    document.fonts?.ready.then(() => {
      if (!root.isConnected) return;
      fit();
      ScrollTrigger.refresh();
    });

    const onResize = () => {
      fit();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  return (
    <div className="orivon-essence" ref={rootRef}>
      <section className="orivon-essence__about" aria-labelledby="orivon-manifesto-title">
        <p className="orivon-essence__wipe" id="orivon-manifesto-title" data-copy={LEAD}>{LEAD}</p>
      </section>

      <section className="orivon-essence__stage" aria-hidden="true">
        <div className="orivon-essence__stack">
          <p className="orivon-essence__line">{LINE}</p>
          <p className="orivon-essence__line">{LINE}</p>
          <p className="orivon-essence__line">{LINE}</p>
        </div>
      </section>

      <section className="orivon-essence__copy">
        <p className="orivon-essence__wipe" data-copy={COPY}>{COPY}</p>
      </section>
    </div>
  );
}
