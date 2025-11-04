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
import Pulso from "../../public/Pulso.png";
import { images } from "../assets/Tourist/index";
import { imagesPulso } from "../assets/Pulsomarkt/index";
import { imagesNoSense } from "../assets/NoSense/index";
import { imagesgym } from "../assets/GymOasis/index";

/* ====== DATA mejorada: agregué client, year, role, tech, highlights ====== */
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
    // link: "/projects/nosense",
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
    image: Pulso,
    desc: "Landing optimizada para conversiones, selector de idioma y animaciones interactivas.",
    images: [imagesPulso?.Boost, imagesPulso?.Hero, imagesPulso?.Pulso],
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
    title: "Turnify - Reservas",
    category: "App",
    type: "Booking",
    client: "Turnify",
    year: 2024,
    role: "Desarrollador Frontend",
    image: "/portfolio/turnify-1.jpg",
    desc: "Sistema de reservas con agendamiento por WhatsApp y panel administrativo básico.",
    images: ["/portfolio/turnify-1.jpg"],
    link: "/projects/turnify",
    tech: ["React", "WhatsApp Integration", "TailwindCSS"],
    features: [{ key: "booking", label: "Reservas/Agenda", icon: "FiTool" }],
    highlights: ["Agenda por WhatsApp", "Notificaciones a usuarios"],
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
    title: "Portfolio demo",
    category: "Landing",
    type: "Landing Page",
    client: "Demo",
    year: 2024,
    role: "Desarrollador",
    image: "/portfolio/demo-1.jpg",
    desc: "Landing demo con estructura para presentar servicios y contacto.",
    images: ["/portfolio/demo-1.jpg"],
    link: "/projects/demo",
    tech: ["React", "TailwindCSS"],
    features: [{ key: "demo", label: "Demo", icon: "FiPlay" }],
    highlights: ["Estructura modular", "Ideal para presentar servicios"],
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

  const CATEGORIES = [
    "All",
    ...Array.from(new Set(projects.map((i) => i.category))),
  ];

  const items =
    filter === "All"
      ? projects
      : projects.filter((it) => it.category === filter);

  function openLightbox(item, startIndex = 0) {
    setActive({ item, startIndex });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setActive(null);
    document.body.style.overflow = "";
  }

  return (
    <section id="portfolio" className="py-24 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
            Portfolio
          </h2>

          <div className="flex items-center gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-sm px-3 py-1 rounded-full focus:outline-none transition ${
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <article
              key={it.id}
              className="group rounded-xl overflow-hidden bg-white/60 border border-transparent hover:border-[rgba(124,58,237,0.12)] shadow-sm hover:shadow-lg transition"
            >
              <div className="relative w-full h-56 md:h-44 lg:h-60 flex items-end">
                <button
                  onClick={() => openLightbox(it, 0)}
                  className="absolute inset-0 w-full h-full focus:outline-none"
                  aria-label={`Abrir ${it.title}`}
                >
                  <img
                    src={it.image}
                    alt={it.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: "center" }}
                  />
                </button>

                <div className="relative z-10 w-full bg-gradient-to-t from-black/50 to-transparent p-4 text-white text-left">
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="text-xs opacity-90">
                    {it.client ? `${it.client} • ` : ""}
                    {it.category} • {it.type}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-[var(--accent-2)]/10 text-[var(--text-primary)]">
                    {it.type}
                  </span>
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-[var(--accent-3)]/10 text-[var(--text-primary)]">
                    {it.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{it.desc}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {it.features?.slice(0, 3).map((f) => (
                    <FeaturePill key={f.key} feature={f} />
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => openLightbox(it, 0)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-1)] focus:outline-none"
                  >
                    Ver proyecto <FiExternalLink />
                  </button>

                  <div className="flex gap-2">
                    {it.images?.map((img, i) => (
                      <button
                        key={String(img) + i}
                        onClick={() => openLightbox(it, i)}
                        className="w-10 h-10 rounded overflow-hidden border border-gray-200 focus:outline-none"
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

      {active && <LightboxModal active={active} onClose={closeLightbox} />}
    </section>
  );
}

/* Feature pill (pequeñas características) */
function FeaturePill({ feature }) {
  const Icon = ICON_MAP[feature.icon] || FiTool;
  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded px-3 py-2 text-sm">
      <IconContext.Provider value={{ size: 16 }}>
        <Icon />
      </IconContext.Provider>
      <span className="text-xs text-gray-700">{feature.label}</span>
    </div>
  );
}

/* Tech pill: para mostrar stack con icono genérico si no hay uno específico */
function TechPill({ tech }) {
  // mapeo simple para iconos comunes (extendible)
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

/* Lightbox modal con Embla */
function LightboxModal({ active, onClose }) {
  const { item, startIndex } = active;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [current, setCurrent] = useState(startIndex || 0);
  const autoplayRef = useRef(null);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 max-w-6xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="md:flex">
          {/* LEFT: CAROUSEL */}
          <div className="md:w-2/3 w-full overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b md:border-b-0 md:border-r">
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {item.client ? `${item.client} • ` : ""}
                  {item.year} • {item.category} • {item.type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  aria-label="Cerrar galería"
                  className="p-2"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div className="embla w-full">
              <div className="embla__viewport overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex will-change-transform">
                  {item.images?.map((src, idx) => (
                    <div
                      className="embla__slide flex-[0_0_100%] shrink-0"
                      key={String(src) + idx}
                    >
                      <div className="h-72 md:h-[520px] w-full">
                        <img
                          src={src}
                          alt={`${item.title} - ${idx + 1}`}
                          className="w-full h-full object-cover object-center"
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
          </div>

          {/* RIGHT: DETAILS */}
          <aside className="md:w-1/3 w-full p-6">
            <p className="text-sm text-gray-600 mb-4">{item.desc}</p>

            <div className="mb-4">
              {/* <h4 className="text-sm font-semibold mb-2">
                Rol • Cliente • Año
              </h4> */}
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
                  <div key={f.key} className="flex items-center gap-3">
                    <FeaturePill feature={f} />
                  </div>
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
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-[var(--accent-1)] text-white"
                >
                  Ver app / sitio
                  <FiExternalLink className="ml-2" />
                </a>
              )}

              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 rounded-full border border-gray-200"
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
