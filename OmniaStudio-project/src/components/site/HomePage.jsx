import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import HeroLogo from "./HeroLogo";
import CyclingWord from "./CyclingWord";
import Manifesto from "./Manifesto";
import SelectedWork from "./SelectedWork";
import Services from "../../orivon/sections/Services";
import Approach from "../../orivon/sections/Approach";
import Studio from "../../orivon/sections/Studio";
import Voices from "../../orivon/sections/Voices";
import Cta from "../../orivon/sections/Cta";
import Contact from "../../orivon/sections/Contact";
import Footer from "../../orivon/sections/Footer";
import "./site.css";

const HASH_ALIAS = { contact: "contacto", services: "servicios", studio: "estudio", approach: "metodo" };

let introState = "idle";

export default function HomePage() {
  const rootRef = useRef(null);
  const openRef = useRef(null);
  const { hash } = useLocation();

  useEffect(() => {
    const id = HASH_ALIAS[hash.slice(1)];
    if (!id) return undefined;
    const node = document.getElementById(id);
    if (node) node.scrollIntoView();
    return undefined;
  }, [hash]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const open = openRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const nav = document.querySelector("[data-site-nav]");
    const lines = root.querySelectorAll(".orivon-hero__line > span");
    const leadCopy = root.querySelector(".orivon-hero__lead");
    const actions = root.querySelector(".orivon-hero__actions");
    const mark = root.querySelector(".orivon-hero__mark");
    const word = open?.querySelector(".orivon-open__mark");
    const left = open?.querySelector(".orivon-open__door--left");
    const right = open?.querySelector(".orivon-open__door--right");

    const restPose = () => {
      gsap.set(open, { autoAlpha: 0 });
      gsap.set(lines, { yPercent: 0 });
      gsap.set([leadCopy, actions, mark, nav], { autoAlpha: 1, y: 0, clearProps: "clipPath" });
      html.classList.remove("orivon-intro");
    };

    if (reduce || introState === "done") {
      restPose();
      introState = "done";
      return undefined;
    }

    const ctx = gsap.context(() => {
      html.classList.add("orivon-intro");
      gsap.set(word, { autoAlpha: 0, letterSpacing: "0.42em" });
      gsap.set(lines, { yPercent: 115 });
      gsap.set(leadCopy, { autoAlpha: 0, y: 16 });
      gsap.set(actions, { autoAlpha: 0, y: 14 });
      gsap.set(mark, { clipPath: "inset(0 0 0 100%)" });
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -12 });

      const tl = gsap.timeline({
        onComplete: () => {
          introState = "done";
          html.classList.remove("orivon-intro");
          gsap.set(open, { autoAlpha: 0 });
        },
      });
      tl.to(word, { autoAlpha: 1, duration: 0.7, ease: "power2.out" })
        .to(word, { letterSpacing: "0.18em", duration: 0.85, ease: "power2.inOut" }, "-=0.15")
        .to(left, { xPercent: -100, duration: 1.45, ease: "power2.inOut" }, "+=0.45")
        .to(right, { xPercent: 100, duration: 1.45, ease: "power2.inOut" }, "<")
        .to(word, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "<0.2")
        .to(lines, { yPercent: 0, duration: 1.15, stagger: 0.14, ease: "power3.out" }, "-=0.7")
        .to(mark, { clipPath: "inset(0 0 0 0%)", duration: 1.35, ease: "power2.inOut" }, "-=1.05")
        .to(leadCopy, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.55")
        .to(actions, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.55");
      if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" }, "-=0.7");
    }, root);

    return () => {
      html.classList.remove("orivon-intro");
      ctx.revert();
    };
  }, []);

  return (
    <>
    <div className="studio" id="inicio" ref={rootRef}>
      <div className="orivon-open" ref={openRef} aria-hidden="true">
        <span className="orivon-open__door orivon-open__door--left" />
        <span className="orivon-open__door orivon-open__door--right" />
        <p className="orivon-open__mark">
          <span>Ori</span>
          <span className="orivon-open__dot" />
          <span>Von</span>
        </p>
      </div>

      <section className="orivon-hero" aria-label="Inicio">
        <div className="orivon-hero__copy">
          <p className="kicker">Independent digital studio / design & development</p>
          <h1>
            <span className="orivon-hero__line"><span>Diseño</span></span>
            <span className="orivon-hero__line orivon-hero__line--open"><span>con <CyclingWord /></span></span>
            <span className="orivon-hero__line"><span>Tecnología</span></span>
            <span className="orivon-hero__line"><span>con propósito.</span></span>
          </h1>
          <p className="orivon-hero__lead">
            Diseñamos y desarrollamos experiencias digitales, identidades y soluciones a medida para marcas que buscan diferenciarse y crecer.
          </p>
          <div className="orivon-hero__actions">
            <a className="btn" href="#work">Explorar proyectos</a>
            <a className="btn btn--ghost" href="#contacto">Hablemos de tu proyecto</a>
          </div>
        </div>
        <div className="orivon-hero__mark" role="img" aria-label="Logotipo de Orivon">
          <HeroLogo />
        </div>
      </section>

      <Manifesto />

      <SelectedWork />
    </div>

    {/* 04–10: diseño fase 2 */}
    <div className="ov">
      <Services />
      <Approach />
      <Studio />
      <Voices />
      <Cta />
      <Contact />
      <Footer />
    </div>
    </>
  );
}
