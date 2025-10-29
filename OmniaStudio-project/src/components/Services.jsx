import React from "react";
import {
  FaLaptopCode,
  FaPaintBrush,
  FaServer,
  FaShareAlt,
  FaIdBadge,
  FaUsersCog,
} from "react-icons/fa";

const SERVICES = [
  {
    Icon: FaLaptopCode,
    title: "Desarrollo Web",
    description:
      "Proyectos a medida: landing pages, e-commerce, apps web y funcionalidades específicas, con foco en performance y conversión.",
    color: "var(--accent-1)",
    tags: ["React", "Next.js", "Pagos"],
  },
  {
    Icon: FaPaintBrush,
    title: "Diseño UX / UI",
    description:
      "Investigación, prototipado y diseño visual centrado en la experiencia del usuario para maximizar usabilidad y resultados.",
    color: "var(--accent-2)",
    tags: ["Figma", "Prototipado", "Design System"],
  },
  {
    Icon: FaServer,
    title: "Hosting & Mantenimiento",
    description:
      "Deploy, backups y monitoreo. Incluye asesoría sobre hosting y, como beneficio para primeros clientes, <strong>1 mes de dominio gratis</strong> (configuración incluida).",
    color: "var(--accent-3)",
    tags: ["Deploy", "Backups", "Soporte"],
  },
  {
    Icon: FaShareAlt,
    title: "Presencia inicial en redes",
    description:
      "Puesta en marcha de redes: configuración de perfiles, banners y piezas (posts/stories) iniciales, highlights y una primera publicación lista para publicar. No es mantenimiento: es el kit de arranque.",
    color: "var(--accent-1)",
    tags: ["Banners", "Stories", "Primera publicación"],
  },
  {
    Icon: FaIdBadge,
    title: "Branding & Material de lanzamiento",
    description:
      "Creación de logo (si hace falta), piezas promocionales y flyers digitales/print para acompañar el lanzamiento y la comunicación inicial.",
    color: "var(--accent-2)",
    tags: ["Logo", "Flyers", "Banners"],
  },
  {
    Icon: FaUsersCog,
    title: "Contratación de talento",
    description:
      "Si el proyecto lo requiere, incorporamos desarrolladores y diseñadores por tiempo limitado (incluible en el presupuesto). Facilitamos la selección según stack y objetivos.",
    color: "var(--accent-3)",
    roles: ["Frontend", "Backend", "Fullstack", "UX/UI", "QA", "DevOps"],
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-[var(--neutral-100)]" id="services">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2
          className="text-3xl md:text-4xl font-heading font-bold text-center text-[var(--text-primary)] mb-12"
          data-aos="fade-up"
        >
          Nuestros Servicios
        </h2>

        {/* grid 6 items — centrado y uniforme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-stretch">
          {SERVICES.map((svc, idx) => {
            const ServiceIcon = svc.Icon;
            return (
              <article
                key={svc.title}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-2 flex flex-col h-full"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
                aria-labelledby={`service-${idx}-title`}
                role="article"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 flex items-center justify-center text-2xl"
                    style={{ color: svc.color }}
                    aria-hidden="true"
                  >
                    <ServiceIcon />
                  </div>

                  <h3
                    id={`service-${idx}-title`}
                    className="text-lg font-semibold text-[var(--text-primary)]"
                  >
                    {svc.title}
                  </h3>
                </div>

                <p
                  className="text-gray-600 mb-4 flex-1"
                  dangerouslySetInnerHTML={{ __html: svc.description }}
                />

                {/* tags or roles */}
                {svc.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {svc.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {svc.roles && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Roles disponibles:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {svc.roles.map((r) => (
                        <span
                          key={r}
                          className="text-xs px-2 py-1 rounded-md border border-gray-200 text-[var(--text-primary)]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium shadow-sm"
                    style={{ background: "var(--accent-1)" }}
                    aria-label={`Solicitar presupuesto para ${svc.title}`}
                  >
                    Solicitar presupuesto
                  </a>

                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-[var(--text-primary)] transition"
                    onClick={() => {
                      const el = document.querySelector("#contact");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    aria-label={`Más info sobre ${svc.title}`}
                  >
                    Más info →
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* nota general + CTA */}
        <div className="mt-10 max-w-3xl mx-auto text-center text-gray-600">
          <p className="mb-4">
            Podemos incluir en el presupuesto la contratación de talento y los
            servicios complementarios de lanzamiento (presencia inicial en
            redes, creación de logo y material promocional). Si querés
            continuidad en redes, te facilitamos la contratación de creadores de
            contenido freelance.
          </p>

          <a
            href="#contact"
            className="inline-block mt-2 px-6 py-3 rounded-full text-white font-semibold shadow-sm transform transition hover:scale-105"
            style={{ background: "var(--accent-1)" }}
            data-aos="zoom-in"
          >
            Contactanos para un paquete a medida
          </a>
        </div>
      </div>
    </section>
  );
}
