import React from "react";
import { FaTools, FaLaptopCode } from "react-icons/fa"; // íconos modernos
import icono from "../assets/Icono.png";

export default function Hero() {
  return (
    <section
      id="hero"
      className="pt-24 pb-20 bg-[var(--bg)] overflow-hidden min-h-[calc(100vh-6rem)]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        {/* Texto */}
        <div className="flex-1 text-center md:text-left" data-aos="fade-right">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Construimos tu{" "}
            <span className="text-[var(--accent-2)]">presencia digital</span> —
            completa
          </h1>

          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
            Branding, diseño UX/UI, desarrollo y hosting. Todo entregado listo
            para convertir visitantes en clientes fieles.
          </p>

          {/* Botones */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full">
            <a
              href="#contact"
              aria-label="Solicitar presupuesto"
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-white font-semibold rounded-full overflow-hidden transition-all duration-300"
              style={{ background: "var(--accent-1)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Solicitar presupuesto</span>
            </a>

            <a
              href="#portfolio"
              aria-label="Ver trabajos"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 py-3.5 font-medium border border-gray-300 text-[var(--text-primary)] hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Ver trabajos
            </a>
          </div>

          {/* Etiquetas pequeñas con íconos */}
          <div className="mt-8 md:mt-10 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white"
                style={{ background: "var(--accent-3)" }}
              >
                <FaTools className="text-base" />
              </div>
              <span className="text-sm">Mantenimiento & Hosting</span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white"
                style={{ background: "var(--accent-2)" }}
              >
                <FaLaptopCode className="text-base" />
              </div>
              <span className="text-sm">Diseño & Desarrollo</span>
            </div>
          </div>
        </div>

        {/* Imagen grande */}
        <div
          className="w-full md:w-[48%] flex justify-center items-center"
          data-aos="fade-left"
        >
          <img
            src={icono}
            alt="Orivon icon"
            className="w-3/4 sm:w-2/3 md:w-[90%] lg:w-full max-w-[520px] drop-shadow-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
