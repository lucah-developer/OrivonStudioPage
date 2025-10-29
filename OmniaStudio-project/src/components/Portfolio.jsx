import React, { useState } from "react";

/**
 * Reemplazá las rutas de imágenes por las tuyas (pueden estar en /public/portfolio/... o importadas)
 * Ej: image: "/portfolio/project1.jpg" o import project1 from "../assets/portfolio/project1.jpg"
 */
const ITEMS = [
  {
    id: 1,
    title: "Tienda NoSense",
    category: "E-commerce",
    image: "/portfolio/nosense-1.jpg",
    desc: "E-commerce completo con catálogo y checkout.",
  },
  {
    id: 2,
    title: "Landing Pulsomarkt",
    category: "Landing",
    image: "/portfolio/pulsomarkt-1.jpg",
    desc: "Landing optimizada para conversiones.",
  },
  {
    id: 3,
    title: "App Gym Oasis",
    category: "App",
    image: "/portfolio/gym-oasis-1.jpg",
    desc: "CRM web con notificaciones y gestión.",
  },
  {
    id: 4,
    title: "Turnify - Reservas",
    category: "App",
    image: "/portfolio/turnify-1.jpg",
    desc: "Sistema de reservas y agendamiento por WhatsApp.",
  },
  {
    id: 5,
    title: "Branding y piezas",
    category: "Branding",
    image: "/portfolio/branding-1.jpg",
    desc: "Logos y material de lanzamiento.",
  },
  {
    id: 6,
    title: "Portfolio demo",
    category: "Landing",
    image: "/portfolio/demo-1.jpg",
    desc: "Ejemplo de landing con animaciones.",
  },
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(ITEMS.map((i) => i.category))),
];

export default function Portfolio() {
  const [active, setActive] = useState(null); // item
  const [filter, setFilter] = useState("All");

  const items =
    filter === "All" ? ITEMS : ITEMS.filter((it) => it.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-3xl font-heading font-bold text-[var(--text-primary)]"
            data-aos="fade-up"
          >
            Portfolio
          </h2>

          <div
            className="flex items-center gap-3"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-sm px-3 py-1 rounded-full ${
                  filter === c
                    ? "bg-[var(--accent-1)] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
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
              className="group rounded-xl overflow-hidden bg-gray-50 shadow-sm hover:shadow-lg transition"
              data-aos="zoom-in"
            >
              <button
                onClick={() => setActive(it)}
                className="relative w-full h-56 md:h-44 lg:h-60 flex items-end"
                aria-label={`Ver ${it.title}`}
              >
                <img
                  src={it.image}
                  alt={it.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="relative z-10 w-full bg-gradient-to-t from-black/50 to-transparent p-4 text-white text-left">
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="text-xs opacity-90">{it.category}</p>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Modal lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-start gap-4">
              <img
                src={active.image}
                alt={active.title}
                className="w-1/2 h-96 object-cover"
              />
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-semibold mb-2">{active.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{active.desc}</p>
                <p className="text-xs text-gray-400 mb-6">{active.category}</p>
                <div className="flex gap-3">
                  <a
                    href="#contact"
                    onClick={() => setActive(null)}
                    className="px-4 py-2 rounded-full bg-[var(--accent-1)] text-white"
                  >
                    Solicitar proyecto similar
                  </a>
                  <button
                    onClick={() => setActive(null)}
                    className="px-4 py-2 rounded-full border border-gray-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
