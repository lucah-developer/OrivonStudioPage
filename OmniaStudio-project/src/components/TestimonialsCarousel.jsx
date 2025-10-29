import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Tourist from "../assets/Testimonials/Tourist.png";
import Oasis from "../assets/Testimonials/Oasis.jpg";
import Turnify from "../assets/Testimonials/turnify.png";
import Nosense from "../assets/Testimonials/NoSenseLogo.png";
import Pulsomarkt from "../assets/Testimonials/Pulsomarkt.png";

const TESTIMONIALS = [
  {
    logo: Tourist,
    client: "Tourist",
    sector: "Reservaciones Turísticas",
    quote:
      "Desarrollaron una plataforma de reservas clara y confiable, mejorando notablemente la gestión de actividades y la experiencia de nuestros visitantes.",
  },
  {
    logo: Oasis,
    client: "Gym Oasis",
    sector: "CRM administrativo para gimnasio",
    quote:
      "Implementaron un CRM con notificaciones automáticas y funcionalidades de administración que optimizaron nuestros procesos diarios y la retención de alumnos.",
  },
  {
    logo: Turnify,
    client: "Peluquería Style",
    sector: "App de reservas automáticas",
    quote:
      "La app permitió a nuestros clientes reservar turnos por WhatsApp y reduce la carga administrativa; el sistema es intuitivo y estable.",
  },
  {
    logo: Nosense,
    client: "No Sense Indumentary",
    sector: "E-commerce de indumentaria deportiva",
    quote:
      "Crearon una tienda online atractiva y fácil de usar que incrementó nuestras ventas y facilitó el manejo del catálogo y talles.",
  },
  {
    logo: Pulsomarkt,
    client: "Pulsomarkt",
    sector: "Landing Page (cliente exterior)",
    quote:
      "Diseñaron una landing efectiva para captar leads en el exterior; diseño y performance alineados a nuestros objetivos de marketing.",
  },
];

export default function TestimonialsCarousel({
  className = "w-full max-w-md",
  delay = 4000,
}) {
  // Respeta preferencia de reducir movimiento (si es true, deshabilitamos autoplay)
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const autoplayPlugin = prefersReducedMotion
    ? []
    : [Autoplay({ delay, stopOnInteraction: true })];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, autoplayPlugin);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className={`${className}`}>
      <div className="embla overflow-hidden rounded-2xl  border-2 border-bg">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container flex">
            {TESTIMONIALS?.map((t, i) => (
              <div
                key={i}
                className="embla__slide min-w-full px-4 py-6"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${TESTIMONIALS.length}`}
              >
                <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
                  {/* logo arriba */}
                  <div className="flex justify-center mb-4">
                    {/* si la imagen no existe, queda un placeholder (iniciales) */}
                    {t.logo ? (
                      <img
                        src={t?.logo}
                        alt={`${t?.client} logo`}
                        className="w-20 h-20 object-contain rounded-md "
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-[var(--text-primary)] font-semibold">
                        {t?.client
                          ?.split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </div>

                  {/* quote */}
                  <blockquote className="text-gray-800 leading-relaxed mb-4 flex-1">
                    “{t.quote}”
                  </blockquote>

                  {/* client + sector + controls */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {t.client}
                      </p>
                      <p className="text-xs text-gray-400">{t.sector}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={scrollPrev}
                        aria-label="Previous testimonial"
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                      >
                        <FiChevronLeft />
                      </button>
                      <button
                        onClick={scrollNext}
                        aria-label="Next testimonial"
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            aria-label={`Ir al testimonio ${idx + 1}`}
            className={`w-2 h-2 rounded-full transition-transform transform ${
              selectedIndex === idx
                ? "scale-125 bg-[var(--accent-1)]"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
