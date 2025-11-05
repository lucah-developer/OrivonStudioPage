import React from "react";
import {
  FaComments,
  FaFileInvoiceDollar,
  FaUsers,
  FaMoneyBillWave,
  FaServer,
  FaBullhorn,
} from "react-icons/fa";

const STEPS = [
  {
    Icon: FaComments,
    title: "Meeting inicial",
    description:
      "Reunión para definir objetivos, público y funcionalidades; tomamos notas precisas para que el presupuesto sea lo más certero posible.",
    color: "var(--accent-1)",
  },
  {
    Icon: FaFileInvoiceDollar,
    title: "Presupuesto a medida",
    description:
      "Propuesta detallada según alcance (landing, e-commerce, app, integraciones). Incluye opciones claras para ajustar alcance y coste.",
    color: "var(--accent-2)",
  },
  {
    Icon: FaUsers,
    title: "Asignación de equipo",
    description:
      "Asignamos desarrolladores y diseñadores con experiencia específica (p. ej. e-commerce + SEO) para maximizar resultados según el proyecto.",
    color: "var(--accent-3)",
  },
  {
    Icon: FaMoneyBillWave,
    title: "Aprobación y primer pago",
    description:
      "Presentamos fecha estimada. Tras la aprobación se solicita una señal (variable según tamaño). Normalmente trabajamos en 2 pagos (señal + entrega).",
    color: "var(--accent-1)",
  },
  {
    Icon: FaServer,
    title: "Desarrollo y entrega",
    description:
      "Desarrollo con entregas parciales y comunicación constante. Al finalizar, asesoramos sobre hosting y dejamos opciones de dominio: primer cliente recibe 1 mes de dominio gratis (configuración incluida).",
    color: "var(--accent-2)",
  },
  {
    Icon: FaBullhorn,
    title: "Servicios complementarios",
    description:
      "Ofrecemos puesta en marcha de redes (banners, primera publicación, stories destacadas), creación de logo y flyers; y facilitamos la contratación de creadores de contenido si querés continuidad.",
    color: "var(--accent-3)",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2
          className="text-3xl md:text-4xl font-heading font-bold text-center text-[var(--text-primary)] mb-10"
          data-aos="fade-up"
        >
          Cómo trabajamos
        </h2>

        {/* grid: 1 col mobile, 2 cols md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STEPS.map(({ Icon: StepIcon, title, description, color }, i) => (
            <article
              key={title}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-6 md:p-8 min-h-[240px] flex flex-col md:flex-row gap-6"
              data-aos="fade-up"
              data-aos-delay={i * 80}
              aria-labelledby={`step-${i + 1}-title`}
              role="article"
            >
              {/* left column: número pequeño + icon */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
                <span className="text-xs text-gray-400">Paso {i + 1}</span>

                <div
                  className="w-12 h-12 rounded-md flex items-center justify-center text-2xl"
                  style={{ color }}
                  aria-hidden="true"
                >
                  <StepIcon />
                </div>
              </div>

              {/* right column: contenido */}
              <div className="flex-1 flex flex-col">
                <h3
                  id={`step-${i + 1}-title`}
                  className="text-xl font-semibold text-[var(--text-primary)] mb-2"
                >
                  {title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-400">Detalle</span>
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-300 hover:text-[var(--accent-2)]"
                    style={{ color: "var(--accent-1)" }}
                    aria-label={`Solicitar presupuesto después de ${title}`}
                  >
                    Solicitar presupuesto
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* summary + CTA */}
        <div className="mt-10 max-w-3xl mx-auto text-center text-gray-600">
          <p className="mb-4">
            Trabajamos con transparencia: definimos alcance y entregables desde
            el inicio, ofrecemos modalidades de pago flexibles y priorizamos la
            calidad contratando especialistas cuando el proyecto lo requiere.
            Además, proveemos servicios de lanzamiento y facilitamos la
            contratación de creadores de contenido freelance si querés
            continuidad.
          </p>

          <a
            href="#contact"
            className="inline-block mt-2 px-6 py-3 rounded-full text-white font-semibold shadow-sm transform transition hover:scale-105"
            style={{ background: "var(--accent-1)" }}
            data-aos="zoom-in"
          >
            Empezar proyecto
          </a>
        </div>
      </div>
    </section>
  );
}
