import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenHeroReady } from "./Hero";
import "./pillars.css";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    n: "01",
    title: "Diseño & Motion",
    text: "Diseños modernos, animaciones cuidadas e identidades visuales que destacan.",
    color: "#00A78E",
  },
  {
    n: "02",
    title: "Desarrollo a medida",
    text: "Plataformas y soluciones especializadas para cada negocio.",
    color: "#FF9A2A",
  },
  {
    n: "03",
    title: "Experiencias 3D",
    text: "Modelado, interacción y tecnología para generar experiencias memorables.",
    color: "#7C3AED",
  },
  {
    n: "04",
    title: "Rendimiento & UX",
    text: "Experiencias rápidas, intuitivas y optimizadas para cualquier dispositivo.",
    color: "#0B2C4A",
  },
];

export default function Pillars() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const journey = root?.closest(".journey");
    const stage = document.querySelector(".hero3d__stage");
    if (!root || !journey || !stage) return undefined;

    let built = false;
    let ctx;

    const boot = () => {
      if (built) return;
      built = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) root.dataset.blast = "1";
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        const logoOf = () => document.getElementById("orivon-logo-stage");

        const release = (logo) => {
          if (!logo) return;
          logo.dataset.play = "0";
          logo.dataset.scrub = "0";
        };

        mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
          gsap.set(root.querySelectorAll(".pillars__heading, .pillar__body, .pillar"), {
            clearProps: "opacity,visibility,transform",
          });
          gsap.from(root.querySelectorAll(".pillar__body, .pillars__heading"), {
            y: 22,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
          ScrollTrigger.create({
            trigger: root,
            start: "top 90%",
            end: "bottom 35%",
            onUpdate: (self) => {
              const logo = logoOf();
              if (!logo) return;
              const playing = logo.dataset.play === "1" || logo.dataset.play === "done";
              if (playing && self.direction < 0 && self.progress < 0.12) release(logo);
              if (logo.dataset.play === "1" || logo.dataset.play === "done") return;
              const approach = Math.min(self.progress / 0.42, 1);
              logo.dataset.scrub = approach.toFixed(4);
              if (approach >= 0.98 && self.direction >= 0) logo.dataset.play = "1";
            },
            onLeave: () => release(logoOf()),
            onLeaveBack: () => release(logoOf()),
          });
        });

        const mountScroll = (wide) => () => {
          const copy = journey.querySelector(".hero3d__copy");
          const caption = journey.querySelector(".hero3d__caption");
          const bg = journey.querySelector(".hero3d__bg");
          const logo = logoOf();
          const wash = root.querySelector(".pillars__wash");
          const flash = root.querySelector(".pillars__flash");
          const heading = root.querySelector(".pillars__heading");
          const bodies = [...root.querySelectorAll(".pillar__body")];

          if (flash && flash.parentElement !== journey) journey.appendChild(flash);

          const fade = (value) => {
            const x = Math.max(0, Math.min(1, value));
            return x * x * (3 - 2 * x);
          };

          const paint = () => {
            const phase = Number(logo?.dataset.phase || 0);
            const copyFade = 1 - fade(phase / 0.14);
            if (copy) gsap.set(copy, { autoAlpha: copyFade, y: (1 - copyFade) * -28 });
            if (caption) gsap.set(caption, { autoAlpha: copyFade });
            const flashA = phase < 0.34 ? 0 : Math.sin(Math.min(1, (phase - 0.34) / 0.1) * Math.PI);
            if (flash) gsap.set(flash, { autoAlpha: flashA });
            const washA = fade((phase - 0.72) / 0.18);
            if (wash) gsap.set(wash, { autoAlpha: washA });
            if (bg) gsap.set(bg, { autoAlpha: 1 - washA });
            const head = fade((phase - 0.84) / 0.08);
            if (heading) gsap.set(heading, { autoAlpha: head, y: (1 - head) * 16 });
            bodies.forEach((el, index) => {
              const shown = fade((phase - 0.88 - index * 0.018) / 0.07);
              gsap.set(el, { autoAlpha: shown, y: (1 - shown) * 14 });
            });
            root.classList.toggle("is-live", phase > 0.92);
            root.dataset.blast = phase.toFixed(4);
            stage.style.pointerEvents = phase > 0.04 ? "none" : "";
          };

          const stopForward = (event) => {
            if (logo?.dataset.play !== "1") return;
            if (event.deltaY > 0) event.preventDefault();
          };
          let touchY = 0;
          const onTouchStart = (event) => {
            touchY = event.touches[0]?.clientY || 0;
          };
          const onTouchMove = (event) => {
            if (logo?.dataset.play !== "1") return;
            const y = event.touches[0]?.clientY || 0;
            if (y < touchY - 2) event.preventDefault();
            touchY = y;
          };

          window.addEventListener("wheel", stopForward, { passive: false });
          window.addEventListener("touchstart", onTouchStart, { passive: true });
          window.addEventListener("touchmove", onTouchMove, { passive: false });
          gsap.ticker.add(paint);

          ScrollTrigger.create({
            trigger: journey,
            start: "top top",
            end: wide ? "+=160%" : "+=120%",
            pin: true,
            pinSpacing: true,
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!logo) return;
              const playing = logo.dataset.play === "1";
              const settled = logo.dataset.play === "done";
              if ((playing && self.direction < 0 && self.progress < 0.8) || (settled && self.direction < 0 && self.progress < 0.48)) {
                logo.dataset.play = "0";
              }
              if (logo.dataset.play === "1" || logo.dataset.play === "done") return;
              logo.dataset.scrub = self.progress.toFixed(4);
              if (self.progress >= 0.96 && self.direction > 0) logo.dataset.play = "1";
            },
            onLeaveBack: () => release(logo),
          });

          return () => {
            gsap.ticker.remove(paint);
            window.removeEventListener("wheel", stopForward);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            if (logo) {
              delete logo.dataset.scrub;
              delete logo.dataset.play;
              delete logo.dataset.phase;
              delete logo.dataset.journey;
            }
            delete root.dataset.blast;
            stage.style.pointerEvents = "";
            root.classList.remove("is-live");
            if (copy) gsap.set(copy, { clearProps: "opacity,visibility,transform" });
            if (caption) gsap.set(caption, { clearProps: "opacity,visibility" });
            if (bg) gsap.set(bg, { clearProps: "opacity,visibility" });
          };
        };

        mm.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", mountScroll(true));
        mm.add("(min-width: 901px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)", mountScroll(false));
      }, journey);
    };

    const stopWaiting = whenHeroReady(boot);

    return () => {
      stopWaiting();
      ctx?.revert();
      const logo = document.getElementById("orivon-logo-stage");
      if (logo) {
        delete logo.dataset.journey;
        delete logo.dataset.scrub;
        delete logo.dataset.play;
        delete logo.dataset.phase;
      }
    };
  }, []);

  const aim = (event) => {
    const pillar = event.currentTarget;
    if (Number.isFinite(event.clientX)) {
      const box = pillar.getBoundingClientRect();
      pillar.style.setProperty("--px", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      pillar.style.setProperty("--py", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    }
    pillar.classList.add("is-hot");
  };

  const cool = (event) => {
    event.currentTarget.classList.remove("is-hot");
  };

  const kick = (event) => {
    const pillar = event.currentTarget;
    pillar.dataset.kick = String(performance.now());
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    pillar.parentElement?.querySelectorAll(".pillar.is-hot").forEach((item) => {
      if (item !== pillar) item.classList.remove("is-hot");
    });
    pillar.classList.toggle("is-hot");
  };

  return (
    <section id="pillars" ref={rootRef} className="pillars" aria-labelledby="pillars-title">
      <div className="pillars__wash" aria-hidden="true" />
      <div className="pillars__flash" aria-hidden="true" />

      <div className="pillars__content">
        <div className="pillars__spacer" aria-hidden="true" />
        <header className="pillars__heading">
          <h2 id="pillars-title">
            Una visión.
            <br />
            Cuatro pilares.
          </h2>
          <p>
            No hacemos solamente páginas web. Construimos experiencias digitales que conectan diseño, tecnología y resultados.
          </p>
        </header>

        <div className="pillars__grid">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.n}
              className="pillar"
              style={{ "--c": pillar.color }}
              tabIndex={0}
              onPointerEnter={aim}
              onPointerMove={aim}
              onPointerLeave={cool}
              onPointerUp={kick}
              onFocus={aim}
              onBlur={cool}
            >
              <div className="pillar__slot" data-slot aria-hidden="true">
                <span className="pillar__contact" />
              </div>
              <div className="pillar__body">
                <p className="pillar__index">{pillar.n}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
