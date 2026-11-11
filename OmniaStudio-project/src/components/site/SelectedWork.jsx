import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { imagesgym } from "../../assets/GymOasis/index";
import nosense from "../../assets/NoSense/NoSense.png";
import { imagesturnify } from "../../assets/Turnify/index";
import { imagesddec } from "../../assets/DDEC/index";
import "./selected-work.css";

const WORK = [
  {
    name: "Tourist",
    category: "Turismo",
    cover: "/TouristLanding.png",
    width: 1900,
    height: 915,
    href: "https://www.tourist.com.ar/",
  },
  {
    name: "Gym Oasis",
    category: "CRM",
    cover: imagesgym.uno,
    width: 1919,
    height: 907,
    href: null,
  },
  {
    name: "Turnify",
    category: "Reservas",
    cover: imagesturnify.uno,
    width: 1448,
    height: 667,
    href: null,
    fit: "contain",
  },
  {
    name: "NoSense",
    category: "E-commerce",
    cover: nosense,
    width: 1626,
    height: 888,
    href: null,
  },
  {
    name: "D.D.E.C",
    category: "Constructora",
    cover: imagesddec.uno,
    width: 1832,
    height: 946,
    href: null,
  },
  {
    name: "Pulsomarkt",
    category: "Landing",
    cover: "/Pulso.png",
    width: 1793,
    height: 939,
    href: "https://pulsomarkt.com/",
  },
];

const pad = (value, size = 2) => String(value).padStart(size, "0");

export default function SelectedWork() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const closeRef = useRef(null);
  const [open, setOpen] = useState(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const card = cardRef.current;
    const tilt = tiltRef.current;
    if (!section || !list || !card || !tilt) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = () => window.matchMedia("(max-width: 860px)").matches;
    const rows = [...list.querySelectorAll(".orivon-index__row")];
    const inks = rows.map((row) => row.querySelector(".orivon-index__ink"));
    let active = -1;

    const xTo = gsap.quickTo(card, "x", { duration: reduce ? 0 : 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: reduce ? 0 : 0.7, ease: "power3.out" });
    const ryTo = gsap.quickTo(tilt, "rotationY", { duration: reduce ? 0 : 0.8, ease: "power2.out" });
    const rxTo = gsap.quickTo(tilt, "rotationX", { duration: reduce ? 0 : 0.8, ease: "power2.out" });

    gsap.set(card, {
      x: 0,
      y: 0,
      xPercent: 6,
      yPercent: -50,
      scale: 0.94,
      autoAlpha: 0,
    });
    gsap.set(tilt, { rotationX: 0, rotationY: 8, transformPerspective: 900, transformOrigin: "left center" });
    gsap.set(card.querySelectorAll("img"), { autoAlpha: 0 });
    gsap.set(inks, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(rows, { clearProps: "paddingTop,paddingBottom" });

    const moveCard = (clientX, clientY) => {
      if (narrow()) return;
      const width = card.offsetWidth || 480;
      const maxX = window.innerWidth - width - 12;
      xTo(Math.max(12, Math.min(maxX, clientX + 28)));
      yTo(clientY);
      const nx = clientX / window.innerWidth - 0.5;
      const ny = clientY / window.innerHeight - 0.5;
      ryTo(nx * 18);
      rxTo(ny * -12);
    };

    const show = (index, clientX, clientY) => {
      if (index !== active) {
        rows.forEach((row, i) => {
          const on = i === index;
          row.classList.toggle("is-active", on);
          gsap.to(inks[i], {
            clipPath: on ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            duration: reduce ? 0 : on ? 0.85 : 0.4,
            ease: on ? "power3.out" : "power2.inOut",
            overwrite: "auto",
          });
        });
        [...card.querySelectorAll("img")].forEach((shot, i) => {
          gsap.to(shot, { autoAlpha: i === index ? 1 : 0, duration: reduce ? 0 : 0.35, overwrite: true });
        });
        if (!narrow()) {
          gsap.to(card, { autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.45, ease: "power3.out", overwrite: "auto" });
        }
        active = index;
      }
      moveCard(clientX, clientY);
    };

    const hide = () => {
      if (active === -1) return;
      rows.forEach((row, i) => {
        row.classList.remove("is-active");
        gsap.to(inks[i], { clipPath: "inset(0 100% 0 0)", duration: reduce ? 0 : 0.35, ease: "power2.inOut", overwrite: "auto" });
      });
      gsap.to(card, { autoAlpha: 0, scale: 0.94, duration: reduce ? 0 : 0.3, overwrite: "auto" });
      active = -1;
    };

    const onMove = (event) => {
      const row = event.target.closest(".orivon-index__row");
      if (!row || !list.contains(row)) {
        hide();
        return;
      }
      show(Number(row.dataset.index), event.clientX, event.clientY);
    };

    const onFocusIn = (event) => {
      const row = event.target.closest(".orivon-index__row");
      if (!row || !list.contains(row)) return;
      const box = row.getBoundingClientRect();
      show(Number(row.dataset.index), box.left + 80, box.top + box.height / 2);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", hide);
    section.addEventListener("focusin", onFocusIn);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", hide);
      section.removeEventListener("focusin", onFocusIn);
      gsap.killTweensOf([card, tilt, ...rows, ...inks, ...card.querySelectorAll("img")]);
    };
  }, []);

  useEffect(() => {
    if (open === null) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((index) => (index + 1) % WORK.length);
      if (event.key === "ArrowLeft") setOpen((index) => (index - 1 + WORK.length) % WORK.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = open === null ? null : WORK[open];

  return (
    <section className="orivon-index" id="work" aria-labelledby="orivon-work-title" ref={sectionRef}>
      <header className="orivon-index__head">
        <div className="orivon-index__kicker">
          <p>Orivon Studio / 03 — Selected work</p>
          <p>Project index / 001—{pad(WORK.length, 3)}</p>
        </div>
        <div className="orivon-index__intro">
          <h2 id="orivon-work-title">Buenas ideas.<br />Mejor ejecución.</h2>
          <p>Una selección de proyectos donde el diseño, la estrategia y la tecnología se encuentran.</p>
        </div>
      </header>

      <div className="orivon-index__list" ref={listRef}>
        {WORK.map((project, index) => (
          <button
            key={project.name}
            type="button"
            data-index={index}
            className="orivon-index__row"
            onClick={() => setOpen(index)}
          >
            <span className="orivon-index__no">{pad(index + 1)}</span>
            <span className="orivon-index__name">
              <span className="orivon-index__ghost">{project.name}</span>
              <span className="orivon-index__ink" aria-hidden="true">{project.name}</span>
            </span>
            <span className="orivon-index__cat">{project.category}</span>
          </button>
        ))}

        <div className="orivon-index__card" ref={cardRef} aria-hidden="true">
          <div className="orivon-index__tilt" ref={tiltRef}>
            {WORK.map((project) => (
              <img
                key={project.name}
                src={project.cover}
                alt=""
                width={project.width}
                height={project.height}
                className={project.fit === "contain" ? "is-contain" : ""}
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>

      {current && (
        <div className="orivon-case" role="dialog" aria-modal="true" aria-labelledby="orivon-case-title">
          <div className="orivon-case__bar">
            <p id="orivon-case-title">Caso {pad(open + 1)} — {current.name} / {current.category}</p>
            <button type="button" ref={closeRef} onClick={() => setOpen(null)}>Cerrar</button>
          </div>
          <div className={`orivon-case__frame${current.fit === "contain" ? " is-contain" : ""}`}>
            <img src={current.cover} alt="" width={current.width} height={current.height} />
          </div>
          <div className="orivon-case__bar orivon-case__bar--foot">
            <p>
              <button type="button" onClick={() => setOpen((index) => (index - 1 + WORK.length) % WORK.length)}>Anterior</button>
              <span aria-hidden="true"> / </span>
              <button type="button" onClick={() => setOpen((index) => (index + 1) % WORK.length)}>Siguiente</button>
            </p>
            {current.href ? (
              <a href={current.href} target="_blank" rel="noreferrer">Abrir sitio ↗</a>
            ) : <span />}
          </div>
        </div>
      )}
    </section>
  );
}
