import nosense from "../assets/NoSense/NoSense.png";
import { imagesgym } from "../assets/GymOasis/index";
import { imagesddec } from "../assets/DDEC/index";

export const PROJECTS = [
  {
    name: "NoSense",
    category: "E-commerce",
    description: "Tienda de indumentaria urbana con catálogo, variantes y pedido por WhatsApp.",
    cover: nosense,
    destination: "/portfolio",
  },
  {
    name: "Pulsomarkt",
    category: "Landing",
    description: "Landing de conversión con selector de idioma y una pieza comercial clara.",
    cover: "/Pulso.jpg",
    destination: "https://pulsomarkt.com/",
  },
  {
    name: "Gym Oasis",
    category: "CRM",
    description: "Administración para gimnasios: socios, pagos y estados en un solo panel.",
    cover: imagesgym.uno,
    destination: "/portfolio",
  },
  {
    name: "Red Brillante",
    category: "Plataformas",
    description: "Dos plataformas: distribuidora de limpieza y EPP, y servicios de facility.",
    cover: "/RedBrillante.png",
    destination: "https://redbrillante.com/",
  },
  {
    name: "ClinicFlow",
    category: "App",
    description: "App SaaS para la gestión clínica: turnos, pacientes y automatización.",
    cover: "/ClinicFlowCover.jpg",
    destination: "https://www.clinicflowapp.com.ar/login",
  },
  {
    name: "Rigio",
    category: "App",
    description: "Comparación de productos tecnológicos con un asistente que orienta la compra.",
    cover: "/Rigio.jpg",
    destination: "/portfolio",
  },
  {
    name: "Tourist",
    category: "Turismo",
    description: "Reservas turísticas con excursiones, alquileres y tickets para San Rafael.",
    cover: "/TouristLanding.png",
    destination: "https://www.tourist.com.ar/",
  },
  {
    name: "D.D.E.C",
    category: "Constructora",
    description: "Sitio de obra con servicios, proyectos construidos y contacto directo.",
    cover: imagesddec.uno,
    destination: "/portfolio",
  },
];
