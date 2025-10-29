import React from "react";
import { FaLaptopCode, FaPaintBrush, FaServer } from "react-icons/fa";

const SERVICES = [
  {
    Icon: FaLaptopCode,
    title: "Desarrollo Web",
    description: "Sitios modernos, rápidos y optimizados para convertir.",
    color: "var(--accent-1)",
  },
  {
    Icon: FaPaintBrush,
    title: "Diseño UX/UI",
    description: "Interfaces limpias, intuitivas y centradas en el usuario.",
    color: "var(--accent-2)",
  },
  {
    Icon: FaServer,
    title: "Hosting & Mantenimiento",
    description: "Todo listo para que tu web funcione sin interrupciones.",
    color: "var(--accent-3)",
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-[var(--neutral-100)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center text-[var(--text-primary)] mb-12"
          data-aos="fade-up"
        >
          Nuestros Servicios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map(({ Icon: ServiceIcon, title, description, color }) => (
            <div
              key={title}
              className="p-6 rounded-xl bg-white shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition"
              data-aos="fade-up"
            >
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full mb-4 text-white text-2xl"
                style={{ background: color }}
              >
                <ServiceIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
