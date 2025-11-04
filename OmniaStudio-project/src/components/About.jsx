import React from "react";
import { FaClock, FaGlobe, FaUsers, FaTools } from "react-icons/fa";
import TestimonialsCarousel from "./TestimonialsCarousel";

export default function About() {
  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-gradient-to-b from-[var(--bg)] to-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div
          className="relative overflow-hidden rounded-3xl p-1"
          aria-hidden="true"
        >
          {/* subtle border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-1)]/10 via-transparent to-[var(--accent-2)]/10 blur-lg opacity-40 rounded-3xl"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center p-6 md:p-10 lg:p-14">
              {/* Texto principal */}
              <div data-aos="fade-right" className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-[var(--text-primary)] mb-4">
                  Sobre Nosotros
                </h2>

                <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
                  Somos un equipo en crecimiento con más de{" "}
                  <strong>3 años</strong> construyendo experiencias digitales a
                  medida. Diseñamos y desarrollamos soluciones que van desde
                  landing pages y e-commerce hasta aplicaciones web con
                  funcionalidades personalizadas, siempre pensadas para resolver
                  necesidades reales de negocio.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
                  Trabajamos de forma cercana con cada cliente: comenzamos por
                  un meeting donde recopilamos objetivos, público y requisitos;
                  luego proponemos una solución a medida y un presupuesto acorde
                  a la complejidad. Sumamos especialistas (dev, diseño, QA)
                  según escala del proyecto.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                      style={{ background: "var(--accent-1)" }}
                    >
                      <FaClock />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        Plazos claros
                      </p>
                      <p className="text-sm text-gray-500">
                        Inicio inmediato tras aprobación y comunicación
                        constante.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                      style={{ background: "var(--accent-2)" }}
                    >
                      <FaUsers />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        Equipo flexible
                      </p>
                      <p className="text-sm text-gray-500">
                        Sumamos talento según necesidad para máxima
                        profesionalidad.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                      style={{ background: "var(--accent-3)" }}
                    >
                      <FaGlobe />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        Experiencia internacional
                      </p>
                      <p className="text-sm text-gray-500">
                        Proyectos y colaboraciones fuera del país que enriquecen
                        nuestro enfoque.
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                      style={{ background: "var(--accent-1)" }}
                    >
                      <FaTools />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        Soporte & mantenimiento
                      </p>
                      <p className="text-sm text-gray-500">
                        Acompañamos el proyecto después de la entrega cuando el
                        cliente lo necesita.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <a
                    href="#contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold shadow-sm transform transition hover:scale-105"
                    style={{ background: "var(--accent-1)" }}
                    data-aos="zoom-in"
                  >
                    Solicitar presupuesto
                  </a>

                  <a
                    href="#process"
                    className="w-full sm:w-auto text-center sm:text-left text-sm font-medium text-[var(--text-primary)] underline-offset-4 hover:underline"
                    data-aos="zoom-in"
                    data-aos-delay="120"
                  >
                    Cómo trabajamos →
                  </a>
                </div>
              </div>

              {/* Tarjeta lateral moderna con stats / timeline */}
              <div
                data-aos="fade-left"
                className="flex justify-center lg:justify-end"
              >
                <div className="w-full max-w-md">
                  {/* Asegurá que TestimonialsCarousel sea responsive */}
                  <TestimonialsCarousel />
                </div>
              </div>
            </div>{" "}
            {/* grid */}
          </div>{" "}
          {/* card */}
        </div>{" "}
        {/* relative outer */}
      </div>
    </section>
  );
}
