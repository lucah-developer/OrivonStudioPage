import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenHeroReady } from "./Hero";
import { pillarsState, focusOfTour, handOver } from "./pillarsState";
import "./pillars.css";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    n: "01",
    title: "Diseño & Motion",
    phrase: "Dar vida a las ideas.",
    focus: "Identidades visuales modernas y experiencias digitales con personalidad.",
    specialty: "Diseño UI/UX, animaciones GSAP, motion design y dirección visual.",
    value: "Crear una presencia digital memorable y diferenciadora.",
    color: "#00A78E",
  },
  {
    n: "02",
    title: "Desarrollo a medida",
    phrase: "Construir sin límites.",
    focus: "Soluciones digitales creadas alrededor de las necesidades de cada negocio.",
    specialty: "Aplicaciones web, e-commerce, paneles administrativos y sistemas personalizados.",
    value: "Convertir necesidades reales en herramientas digitales funcionales.",
    color: "#FF9A2A",
  },
  {
    n: "03",
    title: "Experiencias 3D",
    phrase: "Crear lo inesperado.",
    focus: "Experiencias digitales que integran profundidad, movimiento e interacción.",
    specialty: "Three.js, WebGL, modelado 3D y animaciones inmersivas.",
    value: "Transformar una navegación convencional en una experiencia memorable.",
    color: "#7C3AED",
  },
  {
    n: "04",
    title: "Rendimiento & UX",
    phrase: "Diseñar para funcionar.",
    focus: "Experiencias intuitivas, rápidas y accesibles desde cualquier dispositivo.",
    specialty: "Optimización, responsive, arquitectura frontend y experiencia de usuario.",
    value: "Conseguir productos digitales eficientes, claros y fáciles de utilizar.",
    color: "#5B8DEF",
  },
];

// The entrance (logo burst + reveal) plays on its own clock as soon as the user starts scrolling,
// and rewinds on its own when they return to the very top. Everything after it is scrubbed by
// native scroll on one pinned timeline:
//   0 -> ENTRY_END          short buffer while the entrance plays
//   ENTRY_END -> TOUR_END   the four disciplines (25% each)
//   TOUR_END -> 1           the installation pulls back and dims before the pin releases
const PIN_LENGTH = "+=320%";
const ENTRY_END = 0.1;
const START_AT = 0.004;
const TOUR_END = 0.93;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function smoothstep(value) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

// Editorial layer: the active discipline's headline rises out of a mask, the rest fades with a short lift.
function createStory(root) {
  const slides = [...root.querySelectorAll("[data-slide]")].map((slide) => ({
    slide,
    mask: slide.querySelector("[data-mask]"),
    fades: [...slide.querySelectorAll("[data-fade]")],
  }));
  const count = root.querySelector("[data-count]");
  const fills = [...root.querySelectorAll("[data-fill]")];
  const segments = [...root.querySelectorAll("[data-seg]")];
  const cards = [...root.querySelectorAll(".pillar")];
  let shownFocus = -1;
  let shownIndex = -1;

  return (focus, tour) => {
    fills.forEach((fill, index) => {
      fill.style.transform = `scaleX(${clamp01(tour * 4 - index).toFixed(4)})`;
    });
    if (Math.abs(focus - shownFocus) < 0.0005) return;
    shownFocus = focus;

    // Sequential hand-over: the outgoing discipline leaves in the first half (headline rising out of
    // its mask), the next one arrives in the second half. The headlines overlap only briefly.
    const turn = handOver(focus, 0.3, 0.7);
    const leave = turn.mix;
    slides.forEach(({ slide, mask, fades }, index) => {
      let titleShift;
      let fadeAt;
      if (index === turn.from) {
        titleShift = -smoothstep(leave / 0.6);
        fadeAt = (order) => smoothstep(leave / 0.45 - order * 0.12);
      } else if (index === turn.to) {
        titleShift = 1 - smoothstep((leave - 0.4) / 0.6);
        fadeAt = (order) => 1 - smoothstep((leave - 0.5) / 0.45 - order * 0.12);
      } else {
        titleShift = index < turn.from ? -1 : 1;
        fadeAt = () => 1;
      }
      const hidden = Math.abs(titleShift) >= 0.999 && fadeAt(0) >= 0.999;
      slide.style.visibility = hidden ? "hidden" : "visible";
      if (hidden) return;
      if (mask) mask.style.transform = `translate3d(0, ${(titleShift * 108).toFixed(2)}%, 0)`;
      const dir = index === turn.from ? -1 : 1;
      fades.forEach((node, order) => {
        const k = clamp01(fadeAt(order));
        node.style.opacity = (1 - k).toFixed(3);
        node.style.transform = `translate3d(0, ${(dir * k * 10).toFixed(2)}px, 0)`;
      });
    });

    const index = turn.mix >= 0.5 ? turn.to : turn.from;
    if (index !== shownIndex) {
      shownIndex = index;
      if (count) count.textContent = PILLARS[index].n;
      root.style.setProperty("--active", PILLARS[index].color);
      const stageLight = document.querySelector("[data-stage-light]");
      if (stageLight) {
        stageLight.style.setProperty("--stage-color", PILLARS[index].color);
        // Pillar centres mapped into the stage-light layer (which overhangs the installation).
        stageLight.style.setProperty("--stage-x", `${(28.5 + index * 14.35).toFixed(2)}%`);
      }
      slides.forEach(({ slide }, slideIndex) => slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true"));
      segments.forEach((segment, segIndex) => {
        segment.classList.toggle("is-active", segIndex === index);
        segment.setAttribute("aria-current", segIndex === index ? "step" : "false");
      });
      cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
    }
  };
}

export default function Pillars() {
  const rootRef = useRef(null);
  const goToRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const journey = root?.closest(".journey");
    const stage = document.querySelector(".hero3d__stage");
    if (!root || !journey || !stage) return undefined;

    let built = false;
    let ctx;
    const paintStory = createStory(root);

    const boot = () => {
      if (built) return;
      built = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reduced motion: no pin, no scrub. The segments switch disciplines directly.
      if (reduce) {
        root.classList.add("is-live", "is-calm");
        const show = (index) => {
          pillarsState.tour = (index + 0.5) / 4;
          pillarsState.exit = 0;
          paintStory(index, (index + 1) / 4);
        };
        goToRef.current = show;
        show(0);
        return;
      }

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        const logoOf = () => document.getElementById("orivon-logo-stage");

        mm.add("(max-width: 900px)", () => {
          const proxy = { phase: 0 };
          const write = () => {
            const logo = logoOf();
            if (logo) logo.dataset.scrub = proxy.phase.toFixed(4);
          };
          const mobileShow = gsap.timeline({ paused: true, onUpdate: write, onComplete: () => root.classList.add("is-live") });
          mobileShow.to(proxy, { phase: 0.74, duration: 1.8, ease: "power2.inOut" });
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 72%",
            onEnter: () => mobileShow.play(0),
            onLeaveBack: () => {
              mobileShow.pause(0);
              proxy.phase = 0;
              write();
              root.classList.remove("is-live");
            },
          });
          return () => {
            mobileShow.kill();
            trigger.kill();
          };
        });

        mm.add("(min-width: 901px)", () => {
          const copy = journey.querySelector(".hero3d__copy");
          const caption = journey.querySelector(".hero3d__caption");
          const bg = journey.querySelector(".hero3d__bg");
          const logo = logoOf();
          const wash = root.querySelector(".pillars__wash");
          if (wash && wash.parentElement !== journey) journey.appendChild(wash);
          const head = [root.querySelector(".pillars__intro"), root.querySelector(".pillars__story")].filter(Boolean);

          const intro = { phase: 0 };
          const state = { progress: 0 };

          const paint = () => {
            const progress = state.progress;
            const phase = intro.phase;
            const tour = clamp01((progress - ENTRY_END) / (TOUR_END - ENTRY_END));
            const exit = clamp01((progress - TOUR_END) / (1 - TOUR_END));
            pillarsState.tour = tour;
            pillarsState.exit = exit;
            if (logo) logo.dataset.scrub = phase.toFixed(4);

            const copyFade = 1 - smoothstep(phase / 0.14);
            if (copy) {
              copy.style.opacity = copyFade.toFixed(3);
              copy.style.visibility = copyFade < 0.01 ? "hidden" : "";
              copy.style.transform = `translate3d(0, ${((1 - copyFade) * -28).toFixed(1)}px, 0)`;
            }
            if (caption) caption.style.opacity = copyFade.toFixed(3);
            const space = smoothstep((phase - 0.5) / 0.22);
            if (wash) wash.style.opacity = space.toFixed(3);
            if (bg) bg.style.opacity = (1 - space * 0.35).toFixed(3);

            const show = smoothstep((phase - 0.8) / 0.18) * (1 - exit * 0.35);
            head.forEach((node) => {
              node.style.opacity = show.toFixed(3);
              node.style.visibility = show < 0.01 ? "hidden" : "";
              node.style.transform = `translate3d(0, ${((1 - smoothstep((phase - 0.8) / 0.18)) * 16).toFixed(1)}px, 0)`;
            });
            root.classList.toggle("is-live", phase >= 0.98);
            stage.style.pointerEvents = phase > 0.04 ? "none" : "";
            paintStory(focusOfTour(tour), tour);
          };

          // Entrance on its own clock: arrive -> spin up -> compress -> supernova -> reveal.
          const entrance = gsap.timeline({ paused: true, onUpdate: paint });
          entrance
            .to(intro, { phase: 0.16, duration: 0.6, ease: "power2.inOut" })
            .to(intro, { phase: 0.44, duration: 0.8, ease: "power1.in" })
            .to(intro, { phase: 0.5, duration: 0.42, ease: "power3.in" })
            .to(intro, { phase: 0.58, duration: 0.45, ease: "power2.out" })
            .to(intro, { phase: 1, duration: 1.4, ease: "power1.inOut" });

          const syncEntrance = () => {
            if (state.progress > START_AT) {
              if (entrance.reversed() || entrance.progress() < 1) {
                if (!entrance.isActive() || entrance.reversed()) entrance.timeScale(1).play();
              }
            } else if (entrance.progress() > 0 && !(entrance.isActive() && entrance.reversed())) {
              entrance.timeScale(1.8).reverse();
            }
          };

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: journey,
              start: "top top",
              end: PIN_LENGTH,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          timeline.to(state, {
            progress: 1,
            duration: 1,
            onUpdate: () => {
              syncEntrance();
              paint();
            },
          });
          paint();

          // Segment buttons scroll natively to the middle of that discipline's quarter.
          goToRef.current = (index) => {
            const trigger = timeline.scrollTrigger;
            if (!trigger) return;
            const at = ENTRY_END + (TOUR_END - ENTRY_END) * ((index + 0.5) / 4);
            window.scrollTo({ top: trigger.start + at * (trigger.end - trigger.start), behavior: "smooth" });
          };

          return () => {
            goToRef.current = null;
            entrance.kill();
            timeline.scrollTrigger?.kill();
            timeline.kill();
            pillarsState.tour = 0;
            pillarsState.exit = 0;
            if (logo) {
              delete logo.dataset.scrub;
              delete logo.dataset.play;
              delete logo.dataset.phase;
              delete logo.dataset.journey;
            }
            stage.style.pointerEvents = "";
            root.classList.remove("is-live");
            [copy, caption, bg, wash, ...head].forEach((node) => {
              if (!node) return;
              node.style.opacity = "";
              node.style.visibility = "";
              node.style.transform = "";
            });
          };
        });
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

  const goTo = (index) => goToRef.current?.(index);

  const select = (event) => {
    const root = rootRef.current;
    const pillar = event.currentTarget;
    if (!root?.classList.contains("is-live")) return;
    if (Number.isFinite(event.clientX) && event.type !== "focus") {
      const box = pillar.getBoundingClientRect();
      pillar.style.setProperty("--px", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      pillar.style.setProperty("--py", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    }
    root.dataset.focus = pillar.dataset.index;
    if (root.classList.contains("is-calm")) goTo(Number(pillar.dataset.index));
    root.querySelectorAll(".pillar.is-hot").forEach((item) => {
      if (item !== pillar) item.classList.remove("is-hot");
    });
    pillar.classList.add("is-hot");
  };

  const cool = (event) => {
    event.currentTarget.classList.remove("is-hot");
  };

  return (
    <section id="pillars" ref={rootRef} className="pillars" data-focus="0" aria-labelledby="pillars-title">
      <div className="pillars__wash" aria-hidden="true">
        <span className="space__nebula space__nebula--violet" />
        <span className="space__nebula space__nebula--teal" />
        <span className="space__stars" />
        <span className="space__stage" data-stage-light />
        <span className="space__horizon" />
      </div>

      <div className="pillars__content">
        <header className="pillars__intro">
          <p className="pillars__kicker">
            <span className="pillars__kicker-dot" aria-hidden="true" />
            Four Pillars
          </p>
          <h2 id="pillars-title">Cuatro pilares.</h2>
          <p className="pillars__sub">Una visión digital.</p>
          <p className="pillars__lead">
            Combinamos diseño, tecnología y creatividad para construir experiencias digitales que generan impacto.
          </p>
        </header>

        <div className="exhibit" data-exhibit>
          {PILLARS.map((pillar, index) => (
            <article
              key={pillar.n}
              className={`pillar${index === 0 ? " is-active" : ""}`}
              data-index={index}
              style={{ "--c": pillar.color }}
              tabIndex={0}
              onPointerEnter={select}
              onPointerMove={select}
              onFocus={select}
              onPointerLeave={cool}
              onBlur={cool}
            >
              <div className="pillar__slot" data-slot aria-hidden="true" />
              <div className="pillar__note">
                <p className="pillar__index">{pillar.n}</p>
                <h3>{pillar.title}</h3>
                <p className="pillar__phrase">{pillar.phrase}</p>
                <p>{pillar.focus}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="pillars__story" aria-live="polite">
          <div className="story__stack">
            {PILLARS.map((pillar, index) => (
              <article
                key={pillar.n}
                className="story"
                data-slide
                aria-hidden={index === 0 ? "false" : "true"}
                style={{ "--c": pillar.color }}
              >
                <p className="story__label" data-fade>
                  <span className="story__dot" aria-hidden="true" />
                  {pillar.title}
                </p>
                <h3 className="story__title">
                  <span className="story__mask">
                    <span className="story__line" data-mask>
                      {pillar.phrase}
                    </span>
                  </span>
                </h3>
                <p className="story__lead" data-fade>
                  {pillar.focus}
                </p>
                <dl className="story__meta" data-fade>
                  <div>
                    <dt>Especialidad</dt>
                    <dd>{pillar.specialty}</dd>
                  </div>
                  <div>
                    <dt>Valor</dt>
                    <dd>{pillar.value}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <nav className="progress" aria-label="Los cuatro pilares">
            <p className="progress__count">
              <span data-count>01</span>
              <span className="progress__total"> / 04</span>
            </p>
            <div className="progress__track">
              {PILLARS.map((pillar, index) => (
                <button
                  key={pillar.n}
                  type="button"
                  className={`progress__seg${index === 0 ? " is-active" : ""}`}
                  data-seg
                  style={{ "--c": pillar.color }}
                  aria-label={`${pillar.n}: ${pillar.title}`}
                  aria-current={index === 0 ? "step" : "false"}
                  onClick={() => goTo(index)}
                >
                  <span className="progress__fill" data-fill />
                </button>
              ))}
            </div>
          </nav>
        </aside>
      </div>
    </section>
  );
}
