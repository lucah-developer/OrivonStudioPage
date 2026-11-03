import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import HeroParticles from "./HeroParticles";
import "./hero.css";

const OrivonLogo = lazy(() => import("./OrivonLogo"));

let heroIntroDone = false;

function scrollToId(event, id) {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const rootRef = useRef(null);
  const loaderRef = useRef(null);
  const halfTopRef = useRef(null);
  const halfBotRef = useRef(null);
  const markRef = useRef(null);
  const kickerRef = useRef(null);
  const leadRef = useRef(null);
  const actionsRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const nav = document.querySelector("[data-site-nav]");
    const lines = root.querySelectorAll(".hero3d__line-inner");

    const showResting = () => {
      gsap.set(loaderRef.current, { autoAlpha: 0 });
      gsap.set(lines, { yPercent: 0 });
      gsap.set([kickerRef.current, leadRef.current, actionsRef.current, stageRef.current], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });
      if (nav) gsap.set(nav, { clearProps: "opacity,visibility,transform" });
    };

    if (reduce || heroIntroDone) {
      showResting();
      return undefined;
    }

    const ctx = gsap.context(() => {
      html.classList.add("orivon-intro");
      gsap.set(markRef.current, { opacity: 0, letterSpacing: "0.3em" });
      gsap.set(lines, { yPercent: 110 });
      gsap.set(kickerRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(leadRef.current, { autoAlpha: 0, y: 18 });
      gsap.set(actionsRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(stageRef.current, { autoAlpha: 0, y: 28, scale: 0.96 });
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -16 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          heroIntroDone = true;
          html.classList.remove("orivon-intro");
        },
      });

      tl.to(markRef.current, { opacity: 1, duration: 0.55, delay: 0.25 })
        .to(markRef.current, { letterSpacing: "0.08em", duration: 0.65, ease: "power3.inOut" }, "+=0.22")
        .to(halfTopRef.current, { yPercent: -100, duration: 1.15, ease: "power3.inOut" }, "+=0.16")
        .to(halfBotRef.current, { yPercent: 100, duration: 1.15, ease: "power3.inOut" }, "<")
        .to(markRef.current, { opacity: 0, scale: 0.96, duration: 0.4, ease: "power2.in" }, "<0.12")
        .set(loaderRef.current, { autoAlpha: 0 })
        .call(() => html.classList.remove("orivon-intro"));

      if (nav) {
        tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.15");
      }

      tl.to(kickerRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.45")
        .to(lines, { yPercent: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, "-=0.35")
        .to(leadRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.42")
        .to(actionsRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.36")
        .to(stageRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, ease: "power3.out" }, "-=0.72");
    }, root);

    return () => {
      html.classList.remove("orivon-intro");
      ctx.revert();
      if (nav) gsap.set(nav, { clearProps: "opacity,visibility,transform" });
    };
  }, []);

  return (
    <section id="hero" ref={rootRef} className="hero3d" aria-label="Inicio">
      <div className="orivon-loader" ref={loaderRef} aria-hidden="true">
        <span className="orivon-half orivon-half--top" ref={halfTopRef} />
        <span className="orivon-half orivon-half--bottom" ref={halfBotRef} />
        <div className="orivon-loader__title" ref={markRef}>
          <span className="orivon-loader__word">ORI</span>
          <span className="orivon-loader__dot" />
          <span className="orivon-loader__word">VON</span>
        </div>
      </div>

      <div className="hero3d__bg" aria-hidden="true">
        <HeroParticles />
        <span className="hero3d__glow hero3d__glow--violet" />
        <span className="hero3d__glow hero3d__glow--teal" />
        <span className="hero3d__glow hero3d__glow--navy" />
        <span className="hero3d__spark hero3d__spark--a" />
        <span className="hero3d__spark hero3d__spark--b" />
        <span className="hero3d__spark hero3d__spark--c" />
      </div>

      <div className="hero3d__layout">
        <div className="hero3d__copy">
          <p className="hero3d__kicker" ref={kickerRef}>
            <span className="hero3d__kicker-mark" aria-hidden="true" />
            ESTUDIO DIGITAL INDEPENDIENTE
          </p>

          <h1 className="hero3d__title">
            <span className="hero3d__line">
              <span className="hero3d__line-inner">Diseñamos experiencias</span>
            </span>
            <span className="hero3d__line">
              <span className="hero3d__line-inner">
                digitales que <em>impactan.</em>
              </span>
            </span>
          </h1>

          <p className="hero3d__lead" ref={leadRef}>
            Diseño web, desarrollo y experiencias 3D para marcas que buscan ir más allá.
          </p>

          <div className="hero3d__actions" ref={actionsRef}>
            <Link className="hero3d__btn hero3d__btn--primary" to="/portfolio">
              Explorar proyectos <span aria-hidden="true">↗</span>
            </Link>
            <a className="hero3d__btn hero3d__btn--ghost" href="#contact" onClick={(event) => scrollToId(event, "contact")}>
              Hablemos
            </a>
          </div>
        </div>

        <div className="hero3d__stage" ref={stageRef}>
          <Suspense fallback={<p className="hero3d__loading">Preparando el logotipo</p>}>
            <OrivonLogo />
          </Suspense>
          <p className="hero3d__caption">Orivon — Digital experiences</p>
        </div>
      </div>
    </section>
  );
}
