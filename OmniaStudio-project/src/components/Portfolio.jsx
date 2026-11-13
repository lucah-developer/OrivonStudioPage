// src/components/Portfolio.jsx
import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { IconContext } from "react-icons";
import {
  FiExternalLink,
  FiShoppingCart,
  FiSmartphone,
  FiTool,
  FiMap,
  FiPlay,
  FiX,
  FiCode,
  FiDatabase,
  FiUsers,
  FiCheck,
  FiClock,
} from "react-icons/fi";

import Tourist from "../../public/TouristLanding.png";
import { images } from "../assets/Tourist/index";
import { imagesPulso } from "../assets/Pulsomarkt/index";
import { imagesNoSense } from "../assets/NoSense/index";
import { imagesgym } from "../assets/GymOasis/index";
import { imagesddec } from "../assets/DDEC/index";

/* ====== DATA (sin cambios de imports de images) ====== */
const ITEMS = [
  {
    id: 1,
    title: "Tienda NoSense Indumentaria Urbana",
    category: "E-commerce",
    type: "E-commerce",
    client: "NoSense Indumentary",
    year: 2023,
    role: "Desarrollo Full Stack",
    image: imagesNoSense?.uno,
    desc: "E-commerce con catálogo, filtros, modal de producto, carrito y flujo de pedido vía WhatsApp.",
    images: [imagesNoSense?.uno],
    tech: ["React", "TailwindCSS", "WhatsApp API", "Cloudinary"],
    features: [
      { key: "shop", label: "Carrito & checkout", icon: "FiShoppingCart" },
      { key: "responsive", label: "Responsive", icon: "FiSmartphone" },
      { key: "admin", label: "Panel admin", icon: "FiTool" },
    ],
    highlights: [
      "Catálogo con variantes (talle, color)",
      "Modal de vista rápida de producto",
      "Integración WhatsApp para coordinar pago",
    ],
  },
  {
    id: 2,
    title: "Landing Pulsomarkt",
    category: "Landing",
    type: "Landing Page",
    client: "Pulsomarkt",
    year: 2024,
    role: "Freelance - Frontend",
    image: "/Pulso.jpg",
    desc: "Landing optimizada para conversiones, selector de idioma y animaciones interactivas.",
    images: ["/Pulso.jpg", imagesPulso?.Boost, imagesPulso?.Hero, imagesPulso?.Pulso],
    link: "https://pulsomarkt.com/",
    tech: ["React", "TailwindCSS", "AOS (anim.)", "Figma"],
    features: [
      { key: "anim", label: "Animaciones (AOS)", icon: "FiPlay" },
      { key: "form", label: "Formulario activo", icon: "FiTool" },
    ],
    highlights: [
      "Selector de idioma (ES/EN)",
      "Optimización mobile-first",
      "Mejora de conversión en CTA",
    ],
  },
  {
    id: 3,
    title: "App Gym Oasis",
    category: "App",
    type: "SaaS / CRM",
    client: "Osasis Gym",
    year: 2025,
    role: "Full Stack Development",
    image: imagesgym?.uno,
    desc: "CRM para gimnasios con notificaciones, gestión de usuarios, pagos y semáforo de estados.",
    images: [
      imagesgym?.dos,
      imagesgym?.tres,
      imagesgym?.cuatro,
      imagesgym?.cinco,
      imagesgym?.seis,
      imagesgym?.siete,
    ],
    link: "/projects/gym-oasis",
    tech: ["React", "Node.js", "PostgreSQL", "TailwindCSS"],
    features: [
      { key: "crm", label: "Panel admin", icon: "FiTool" },
      { key: "payments", label: "Pasarela de pagos", icon: "FiShoppingCart" },
    ],
    highlights: [
      "Sistema visual tipo semáforo para pagos",
      "Notificaciones automáticas (vencimientos)",
      "Import/Export rutinas con ExcelJS",
    ],
  },
  {
    id: 4,
    title: "Red Brillante",
    category: "Plataformas",
    type: "Sitio",
    client: "Red Brillante",
    year: 2026,
    role: "Sitio y plataformas",
    image: "/RedBrillante.png",
    desc: "Dos plataformas en un mismo sitio: la distribuidora de productos de limpieza y EPP, y los servicios de facility para cada cliente.",
    images: ["/RedBrillante.png"],
    link: "https://redbrillante.com/",
    tech: ["Sitio web"],
    features: [{ key: "web", label: "Plataformas", icon: "FiTool" }],
    highlights: ["Distribuidora de productos y EPP", "Servicios de limpieza y mantenimiento"],
  },
  {
    id: 7,
    title: "ClinicFlow",
    category: "App",
    type: "App",
    client: "ClinicFlow",
    year: 2026,
    role: "App de gestión clínica",
    image: "/ClinicFlowCover.jpg",
    desc: "Plataforma SaaS para ordenar la operación de una clínica: turnos, pacientes y procesos, con automatización e inteligencia artificial.",
    images: ["/ClinicFlowCover.jpg"],
    link: "https://www.clinicflowapp.com.ar/login",
    tech: ["SaaS"],
    features: [{ key: "app", label: "App", icon: "FiTool" }],
    highlights: ["Gestión clínica", "Turnos y pacientes", "Automatización e inteligencia artificial"],
  },
  {
    id: 8,
    title: "Rigio",
    category: "App",
    type: "App",
    client: "Rigio",
    year: 2026,
    role: "App de comparación con IA",
    image: "/Rigio.jpg",
    desc: "Plataforma para buscar, evaluar y comparar productos tecnológicos, con un asistente que interpreta el presupuesto y orienta la compra.",
    images: ["/Rigio.jpg"],
    link: null,
    tech: ["React", "PostgreSQL", "Prisma", "APIs", "OpenRouter", "LLMs"],
    features: [{ key: "app", label: "App", icon: "FiTool" }],
    highlights: ["Comparación según necesidad y presupuesto", "Asistente que recomienda y propone alternativas", "React, PostgreSQL, Prisma y modelos de lenguaje"],
  },
  {
    id: 5,
    title: "Tourist",
    category: "Booking",
    type: "Booking",
    client: "Tourist (San Rafael)",
    year: 2022,
    role: "Co-fundador y Líder de Desarrollo",
    image: Tourist,
    desc: "Plataforma de reservaciones turísticas con paneles para empresas y tickets QR.",
    images: [
      images?.AlquileresT,
      images?.DetalleT,
      images?.ExcursionesT,
      images?.InicioT,
      images?.ReseñasT,
    ],
    link: "https://www.tourist.com.ar/",
    tech: ["React", "Node.js", "PostgreSQL", "MercadoPago", "Cloudinary"],
    features: [
      { key: "booking", label: "Reservas", icon: "FiMap" },
      { key: "admin", label: "Panel admin", icon: "FiTool" },
      { key: "mp", label: "MercadoPago", icon: "FiShoppingCart" },
    ],
    highlights: [
      "Tickets digitales con código QR",
      "Panel para empresas locales",
      "Pasarela MercadoPago y filtros por actividad",
    ],
  },
  {
    id: 6,
    title: "D.D.E.C Empresa Constructora",
    category: "Landing",
    type: "Landing Page",
    client: "D.D.E.C S.R.L",
    year: 2023,
    role: "Desarrollo web",
    image: imagesddec?.uno,
    desc: "Landing page completa con servicios, proyectos con imágenes de cada construcción realizada por la empresa, formulario de contacto y diseño responsive",
    images: [
      imagesddec?.uno,
      imagesddec?.dos,
      imagesddec?.tres,
      imagesddec?.cuatro,
      imagesddec?.cinco,
    ],
    tech: ["React", "TailwindCSS", "AOS", "Javascript"],
    features: [
      { key: "anim", label: "Animaciones (AOS)", icon: "FiPlay" },
      { key: "form", label: "Formulario activo", icon: "FiTool" },
      { key: "responsive", label: "Responsive", icon: "FiSmartphone" },
    ],
    highlights: [
      "Proyectos divididos por secciones ",
      "Diseño responsive",
      "Proyectos con carousel de imágenes",
      "Animaciones y carousel de imágenes",
    ],
  },
];

const ICON_MAP = {
  FiExternalLink,
  FiShoppingCart,
  FiSmartphone,
  FiTool,
  FiMap,
  FiPlay,
  FiX,
  FiCode,
  FiDatabase,
  FiUsers,
  FiCheck,
  FiClock,
};

export default function Portfolio({ projects = ITEMS }) {
  const [active, setActive] = useState(null); // { item, startIndex }
  const [filter, setFilter] = useState("All");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const CATEGORIES = [
    "All",
    ...Array.from(new Set(projects.map((i) => i.category))),
  ];

  const items =
    filter === "All"
      ? projects
      : projects.filter((it) => it.category === filter);

  // reveal animation (simple)
  useEffect(() => {
    const els = document.querySelectorAll(".portfolio-card");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach((el) => {
        el.classList.remove("opacity-0", "translate-y-4");
        el.classList.add("opacity-100", "translate-y-0");
      });
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.remove("opacity-0", "translate-y-4");
            el.classList.add("opacity-100", "translate-y-0");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function openLightbox(item, startIndex = 0) {
    setActive({ item, startIndex });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setActive(null);
    document.body.style.overflow = "";
  }

  return (
    // evitar scroll horizontal inesperado
    <section
      id="portfolio"
      className="py-20 md:py-24 bg-neutral-100 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
            Portfolio
          </h1>

          {/* En mobile usamos select para evitar overflow; en desktop botones */}
          {isMobile ? (
            <div className="w-full sm:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto text-sm px-3 py-2 rounded-md border border-gray-200 bg-white"
                aria-label="Filtrar proyectos"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`text-xs sm:text-sm px-3 py-1 rounded-full focus:outline-none transition ${
                    filter === c
                      ? "bg-[var(--accent-1)] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  aria-pressed={filter === c}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid: responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {items.map((it) => (
            <article
              data-aos="fade-up"
              key={it.id}
              className="portfolio-card group flex flex-col h-full rounded-xl overflow-hidden bg-white/60 border border-transparent hover:border-[rgba(124,58,237,0.12)] shadow-sm hover:shadow-lg transition transform duration-200 opacity-0 translate-y-4"
            >
              {/* IMAGE */}
              <div className="relative w-full h-48 sm:h-56 md:h-52 lg:h-60 flex items-end bg-white">
                <button
                  onClick={() => openLightbox(it, 0)}
                  className="absolute inset-0 w-full h-full focus:outline-none"
                  aria-label={`Abrir ${it.title}`}
                >
                  <img
                    src={it.image}
                    alt={it.title}
                    className="absolute inset-0 w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 bg-gray-50"
                    style={{ objectPosition: "center" }}
                  />
                </button>

                <div className="relative z-10 w-full bg-gradient-to-t from-black/50 to-transparent p-3 sm:p-4 text-white text-left">
                  <h3 className="text-base sm:text-lg font-semibold leading-tight">
                    {it.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs opacity-90">
                    {it.client ? `${it.client} • ` : ""}
                    {it.category} • {it.type}
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col flex-grow p-3 sm:p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[var(--accent-2)]/10 text-[var(--text-primary)]">
                    {it.type}
                  </span>
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[var(--accent-3)]/10 text-[var(--text-primary)]">
                    {it.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {it.desc}
                </p>

                <div className="mt-1 flex flex-wrap gap-2">
                  {it.features?.slice(0, 3).map((f) => (
                    <FeaturePill key={f.key} feature={f} />
                  ))}
                </div>

                {/* fixed bottom area */}
                <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={() => openLightbox(it, 0)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-1)] focus:outline-none hover:text-[var(--accent-2)] transition-colors"
                  >
                    Ver proyecto <FiExternalLink />
                  </button>

                  <div className="flex gap-2">
                    {it.images?.map((img, i) => (
                      <button
                        key={String(img) + i}
                        onClick={() => openLightbox(it, i)}
                        className="w-10 h-10 rounded overflow-hidden border border-gray-200 focus:outline-none hover:border-[var(--accent-1)] transition"
                        aria-label={`Abrir galería - imagen ${i + 1} de ${
                          it.title
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${it.title} mini ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active && (
        <LightboxModal
          active={active}
          onClose={closeLightbox}
          isMobile={isMobile}
        />
      )}
    </section>
  );
}

/* Feature pill */
function FeaturePill({ feature }) {
  const Icon = ICON_MAP[feature.icon] || FiTool;
  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded px-3 py-1 text-sm">
      <IconContext.Provider value={{ size: 14 }}>
        <Icon />
      </IconContext.Provider>
      <span className="text-xs text-gray-700">{feature.label}</span>
    </div>
  );
}

/* Tech pill */
function TechPill({ tech }) {
  const map = {
    React: FiCode,
    "Node.js": FiCode,
    PostgreSQL: FiDatabase,
    SQL: FiDatabase,
    TailwindCSS: FiCode,
    MercadoPago: FiShoppingCart,
    "WhatsApp API": FiSmartphone,
    Cloudinary: FiExternalLink,
  };
  const Icon = map[tech] || FiCode;
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs">
      <IconContext.Provider value={{ size: 14 }}>
        <Icon />
      </IconContext.Provider>
      <span className="text-xs text-gray-700">{tech}</span>
    </div>
  );
}

/* Lightbox modal */
function LightboxModal({ active, onClose, isMobile }) {
  const { item, startIndex } = active;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
  });
  const [current, setCurrent] = useState(startIndex || 0);
  const autoplayRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(startIndex || 0);
      const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
      emblaApi.on("select", onSelect);
      onSelect();
      return () => emblaApi.off("select", onSelect);
    }
  }, [emblaApi, startIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    const play = () => emblaApi.canScrollNext() && emblaApi.scrollNext();
    autoplayRef.current = setInterval(play, 3500);
    return () => clearInterval(autoplayRef.current);
  }, [emblaApi]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasVideo = !!item.videoSrc;

  // Mobile full-screen viewer (keeps big images + toggle details; contains action buttons)
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/80">
        <div className="relative z-10 w-full h-full flex flex-col">
          <button
            onClick={onClose}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-white transition"
          >
            <FiX size={20} />
          </button>

          <div className="flex-1 flex items-center justify-center">
            {hasVideo ? (
              <video
                src={item.videoSrc}
                poster={item.videoPoster}
                controls
                playsInline
                className="w-full h-full object-contain max-h-screen"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="embla w-full h-full">
                  <div
                    className="embla__viewport h-full"
                    ref={emblaRef}
                    style={{ touchAction: "pan-y" }}
                  >
                    <div className="embla__container flex h-full">
                      {item.images?.map((src, idx) => (
                        <div
                          className="embla__slide flex-[0_0_100%] shrink-0 flex items-center justify-center h-full"
                          key={String(src) + idx}
                        >
                          <img
                            src={src}
                            alt={`${item.title} - ${idx + 1}`}
                            className="max-h-[100vh] max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/95 border-t p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                <p className="text-xs text-gray-600 truncate">
                  {item.client ? `${item.client} • ` : ""}
                  {item.year} • {item.category}
                </p>
              </div>

              <button
                onClick={() => setShowInfo((s) => !s)}
                className="text-sm text-[var(--accent-1)] px-3 py-2 rounded-md"
              >
                {showInfo ? "Ocultar" : "Detalles"}
              </button>
            </div>

            {showInfo && (
              <div className="mt-3 text-sm text-gray-700">
                <p className="mb-2">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.tech?.map((t) => (
                    <TechPill key={t} tech={t} />
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  {item.features?.map((f) => (
                    <FeaturePill key={f.key} feature={f} />
                  ))}
                </div>

                {/* ACTIONS (mobile) */}
                {item.link && (
                  <a
                    href={item.link}
                    target={item.link?.startsWith("/") ? "_self" : "_blank"}
                    rel={
                      item.link?.startsWith("/")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="block w-full mb-2 px-4 py-2 rounded-full bg-[var(--accent-1)] text-white text-center"
                  >
                    Ver app / sitio
                  </a>
                )}

                <a
                  href="#contact"
                  onClick={() => {
                    onClose();
                  }}
                  className="block w-full px-4 py-2 rounded-full border border-gray-200 text-center"
                >
                  Solicitar proyecto similar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop / tablet modal (original layout) with action buttons in aside
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 max-w-6xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="md:flex">
          {/* LEFT: carousel / video */}
          <div className="md:w-2/3 w-full overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b md:border-b-0 md:border-r">
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {item.client ? `${item.client} • ` : ""}
                  {item.year} • {item.category} • {item.type}
                </p>
              </div>
            </div>

            {hasVideo ? (
              <div className="w-full p-4 sm:p-6 flex flex-col items-center">
                {/* <div className="w-full mb-2 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={item.videoPoster}
                    alt={`${item.title} cover`}
                    className="w-full h-auto object-contain"
                  />
                </div> */}

                <div className="flex justify-center w-full">
                  <video
                    src={item.videoSrc}
                    poster={item.videoPoster}
                    controls
                    playsInline
                    className="w-full max-h-[520px]"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="embla w-full">
                  <div
                    className="embla__viewport overflow-hidden"
                    ref={emblaRef}
                    style={{ touchAction: "pan-y" }}
                  >
                    <div className="embla__container flex will-change-transform">
                      {item.images?.map((src, idx) => (
                        <div
                          className="embla__slide flex-[0_0_100%] shrink-0 flex items-center justify-center"
                          key={String(src) + idx}
                        >
                          <div className="h-72 sm:h-80 md:h-[520px] w-full flex items-center justify-center bg-gray-50">
                            <img
                              src={src}
                              alt={`${item.title} - ${idx + 1}`}
                              className="max-w-full max-h-full object-contain object-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t md:border-t-0 md:border-r flex items-center justify-center gap-3">
                  <div className="flex gap-2 items-center">
                    {item.images?.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => emblaApi && emblaApi.scrollTo(i)}
                        className={`w-3 h-3 rounded-full ${
                          current === i ? "bg-[var(--accent-1)]" : "bg-gray-300"
                        }`}
                        aria-label={`Ir a la imagen ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <aside className="md:w-1/3 w-full p-4 sm:p-6 relative">
            <button
              onClick={onClose}
              aria-label="Cerrar galería"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiX size={18} />
            </button>

            <p className="text-sm text-gray-600 mb-4">{item.desc}</p>

            <div className="mb-4">
              <div className="text-sm text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <FiUsers /> <span>{item.role}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <FiClock />{" "}
                  <span>
                    {item.client} • {item.year}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">
                Stack / Tecnologías
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.tech?.map((t) => (
                  <TechPill key={t} tech={t} />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Highlights</h4>
              <ul className="list-none space-y-2 text-sm">
                {item.highlights?.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--accent-1)]">
                      <FiCheck />
                    </span>
                    <span className="text-gray-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Características</h4>
              <div className="flex flex-col gap-2">
                {item.features?.map((f) => (
                  <FeaturePill key={f.key} feature={f} />
                ))}
              </div>
            </div>

            <div className="mt-auto">
              {item.link && (
                <a
                  href={item.link}
                  target={item.link?.startsWith("/") ? "_self" : "_blank"}
                  rel={
                    item.link?.startsWith("/")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-[var(--accent-1)] text-white hover:opacity-95 transition"
                >
                  Ver app / sitio <FiExternalLink className="ml-2" />
                </a>
              )}

              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
              >
                Solicitar proyecto similar
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
