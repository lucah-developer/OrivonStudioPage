import React from "react";
import { FaTools, FaCloud, FaLaptopCode } from "react-icons/fa"; // íconos modernos
import icono from "../assets/Icono.png";

export default function Hero() {
  return (
    <section className="pt-32 pb-24 bg-[var(--bg)] overflow-hidden h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Texto */}
        <div className="flex-1 text-center lg:text-left" data-aos="fade-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Construimos tu{" "}
            <span className="text-[var(--accent-2)]">presencia digital</span> —
            completa
          </h1>

          <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Branding, diseño UX/UI, desarrollo y hosting. Todo entregado listo
            para convertir visitantes en clientes fieles.
          </p>

          {/* Botones */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center px-7 py-3.5 text-white font-semibold rounded-full overflow-hidden transition-all duration-300"
              style={{ background: "var(--accent-1)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Solicitar presupuesto</span>
            </a>

            <a
              href="#portfolio"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-medium border border-gray-300 text-[var(--text-primary)] hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Ver trabajos
            </a>
          </div>

          {/* Etiquetas pequeñas con íconos */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
            {/* Mantenimiento & Hosting */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-white"
                style={{ background: "var(--accent-3)" }}
              >
                <FaTools className="text-lg" />
              </div>
              <span>Mantenimiento & Hosting</span>
            </div>

            {/* Diseño & Desarrollo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-white"
                style={{ background: "var(--accent-2)" }}
              >
                <FaLaptopCode className="text-lg" />
              </div>
              <span>Diseño & Desarrollo</span>
            </div>
          </div>
        </div>

        {/* Imagen grande */}
        <div
          className="w-full lg:w-[48%] flex justify-center"
          data-aos="fade-left"
        >
          <img
            src={icono}
            alt="Omnia icon"
            className="w-[85%] md:w-[90%] lg:w-full max-w-[520px] drop-shadow-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
