import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import HeroLogo from "./HeroLogo";
import CyclingWord from "./CyclingWord";
import Manifesto from "./Manifesto";
import SelectedWork from "./SelectedWork";
import Contact from "../Contact";
import "./site.css";

const SERVICES = [
  ["01", "Branding & Design", "Identidad visual, diseño de interfaces, sistemas gráficos y dirección creativa.", ["Identidad", "UI", "Dirección"]],
  ["02", "Web Development", "Sitios web profesionales, diseño y desarrollo frontend.", ["Sitios", "Frontend", "Performance"]],
  ["03", "Custom Solutions", "Plataformas, sistemas personalizados e integraciones.", ["Plataformas", "Sistemas", "Integraciones"]],
  ["04", "E-commerce", "Tiendas online, catálogos y experiencias de compra.", ["Tiendas", "Catálogo", "Conversión"]],
  ["05", "Digital Experiences", "Interacciones, motion design y experiencias digitales.", ["Motion", "Interacción", "Experiencia"]],
];

const STEPS = [
  ["01", "Discover", "Comprender el negocio, sus objetivos y necesidades."],
  ["02", "Strategy", "Definir prioridades, enfoque y dirección."],
  ["03", "Design", "Construir la experiencia visual y la arquitectura de la solución."],
  ["04", "Develop", "Implementar con calidad técnica y atención al detalle."],
  ["05", "Launch", "Publicar, revisar y optimizar."],
];

function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const nodes = [...root.querySelectorAll("[data-reveal]")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ref]);
}

let introState = "idle";

export default function HomePage() {
  const rootRef = useRef(null);
  const openRef = useRef(null);
  useReveal(rootRef);

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
      tl.to(word, { autoAlpha: 1, duration: 0.32, ease: "power2.out" })
        .to(word, { letterSpacing: "0.18em", duration: 0.38, ease: "power3.inOut" }, "-=0.05")
        .to(left, { xPercent: -100, duration: 0.72, ease: "power3.inOut" }, "+=0.08")
        .to(right, { xPercent: 100, duration: 0.72, ease: "power3.inOut" }, "<")
        .to(word, { autoAlpha: 0, duration: 0.25, ease: "power2.in" }, "<0.08")
        .to(lines, { yPercent: 0, duration: 0.62, stagger: 0.07, ease: "power3.out" }, "-=0.42")
        .to(mark, { clipPath: "inset(0 0 0 0%)", duration: 0.7, ease: "power3.inOut" }, "-=0.55")
        .to(leadCopy, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.35")
        .to(actions, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.28");
      if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.45");
    }, root);

    return () => {
      html.classList.remove("orivon-intro");
      ctx.revert();
    };
  }, []);

  return (
    <div className="studio" ref={rootRef}>
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
            <a className="btn btn--ghost" href="#contact">Hablemos de tu proyecto</a>
          </div>
        </div>
        <div className="orivon-hero__mark" role="img" aria-label="Logotipo de Orivon">
          <HeroLogo />
        </div>
      </section>

      <Manifesto />

      <SelectedWork />

      <section className="services" id="services">
        <div className="wrap">
          <div className="section-head">
            <h2>Services.</h2>
            <p className="kicker">Cinco disciplinas</p>
          </div>
          {SERVICES.map(([no, title, text, tags]) => (
            <article className="service" key={no} data-reveal>
              <p className="service__no">{no}</p>
              <h3>{title}</h3>
              <div>
                <p>{text}</p>
                <div className="service__tags">
                  {tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process" id="approach">
        <div className="wrap">
          <div className="section-head">
            <h2>Approach.</h2>
            <p className="kicker">Método</p>
          </div>
          {STEPS.map(([no, title, text]) => (
            <article className="step" key={no} data-reveal>
              <strong>{no}</strong>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-block" id="studio">
        <div className="wrap inner">
          <div data-reveal>
            <p className="kicker">Studio</p>
            <h2>Diseño y código en la misma mesa.</h2>
          </div>
          <div data-reveal>
            <p>
              Orivon es un estudio que combina diseño, desarrollo y pensamiento estratégico para construir productos digitales. Trabajamos cerca de cada proyecto, desde el primer brief hasta la publicación.
            </p>
            <div className="facts">
              <div>
                <b>Argentina / remoto</b>
                <span>Proyectos locales y para clientes del exterior.</span>
              </div>
              <div>
                <b>Contacto directo</b>
                <span>orivonstudio2022@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap" data-reveal>
          <p className="kicker">09 — Start</p>
          <h2>¿Tenés una idea? Hagámosla realidad.</h2>
          <a className="btn btn--night" href="#contact">Escribirnos</a>
        </div>
      </section>

      <Contact />
    </div>
  );
}
