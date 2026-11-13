// Estructura del diseño fase 2 con los datos reales del estudio (proyectos, testimonios y contacto).
import { PROJECTS as CASES } from '../components/site/projectData';
import touristMark from '../assets/Testimonials/Tourist.png';
import oasisMark from '../assets/Testimonials/Oasis.jpg';
import nosenseMark from '../assets/Testimonials/NoSenseLogo.png';
import pulsoMark from '../assets/Testimonials/Pulsomarkt.png';

export const CONTACT = {
  email: 'orivonstudio2022@gmail.com',
  phone: '+54 9 260 430 9716',
  phoneHref: 'tel:+5492604309716',
  instagram: 'https://www.instagram.com/orivonstudio/',
  instagramHandle: '@orivonstudio',
  whatsapp: 'https://wa.me/5492604309716',
};

export const SERVICES = [
  {
    id: 'brand',
    name: 'Brand & Digital Design',
    short: 'Brand',
    desc: 'Identidad visual, diseño de interfaces, dirección creativa, sistemas gráficos y motion design.',
    tags: ['Identidad', 'UI', 'Dirección creativa', 'Motion'],
  },
  {
    id: 'web',
    name: 'Web Design & Development',
    short: 'Web',
    desc: 'Diseño y desarrollo de sitios web, landing pages y experiencias digitales profesionales.',
    tags: ['Sitios web', 'Landing pages', 'Frontend', 'Performance'],
  },
  {
    id: 'platform',
    name: 'Custom Platforms',
    short: 'Plataformas',
    desc: 'CRM, dashboards, plataformas personalizadas, sistemas de reservas e integraciones.',
    tags: ['CRM', 'Dashboards', 'Reservas', 'Integraciones'],
  },
  {
    id: 'shop',
    name: 'E-Commerce',
    short: 'E-Commerce',
    desc: 'Tiendas online, catálogos digitales, experiencias de compra y soluciones comerciales.',
    tags: ['Tiendas', 'Catálogos', 'Checkout', 'Conversión'],
  },
  {
    id: 'ai',
    name: 'AI & Automation',
    short: 'IA & Automatización',
    desc: 'Agentes inteligentes, integración de modelos de lenguaje y automatización de procesos digitales.',
    tags: ['Agentes', 'LLM', 'Automatización'],
  },
];

export const STAGES = [
  { name: 'Discover', desc: 'Comprender el negocio, las necesidades y los objetivos del proyecto.', meta: 'Escuchar · Entender', code: 'DIS' },
  { name: 'Strategy', desc: 'Definir la dirección, las prioridades y la arquitectura de la solución.', meta: 'Dirección · Arquitectura', code: 'STR' },
  { name: 'Design', desc: 'Diseñar la experiencia, la identidad y la interfaz.', meta: 'Experiencia · Interfaz', code: 'DSG' },
  { name: 'Development', desc: 'Construir, integrar y validar el producto digital.', meta: 'Construir · Validar', code: 'DEV' },
  { name: 'Launch', desc: 'Publicar, revisar y preparar la evolución del proyecto.', meta: 'Publicar · Evolucionar', code: 'LCH' },
];

export const PRINCIPLES = [
  { name: 'Clarity', desc: 'La claridad por encima del ruido.' },
  { name: 'Intention', desc: 'Cada decisión visual y técnica tiene un propósito.' },
  { name: 'Craft', desc: 'Atención al detalle, desde la primera idea hasta el producto final.' },
  { name: 'Evolution', desc: 'Construimos soluciones preparadas para crecer.' },
];

export const TESTIMONIALS = [
  { client: 'Tourist', project: 'Reservaciones turísticas', person: 'Tourist', role: 'San Rafael', logo: touristMark, text: 'Desarrollaron una plataforma de reservas clara y confiable, mejorando notablemente la gestión de actividades y la experiencia de nuestros visitantes.' },
  { client: 'Gym Oasis', project: 'CRM para gimnasio', person: 'Gym Oasis', role: 'Administración', logo: oasisMark, text: 'Implementaron un CRM con notificaciones automáticas y funcionalidades de administración que optimizaron nuestros procesos diarios y la retención de alumnos.' },
  { client: 'Red Brillante', project: 'Productos y servicios', person: 'Red Brillante', role: 'San Rafael', logo: '/red-brillante-mark.png?v=2', mark: true, href: 'https://redbrillante.com/', text: 'Supieron entender las necesidades de nuestra empresa y adaptar los dos negocios en una sola web, grandes animaciones y una estructura genial. Fueron rápidos en el desarrollo y muy bien predispuestos a aclarar dudas y realizar cambios.' },
  { client: 'NoSense', project: 'E-commerce', person: 'No Sense Indumentary', role: 'Indumentaria', logo: nosenseMark, text: 'Crearon una tienda online atractiva y fácil de usar que incrementó nuestras ventas y facilitó el manejo del catálogo y talles.' },
  { client: 'Pulsomarkt', project: 'Landing', person: 'Pulsomarkt', role: 'Captación', logo: pulsoMark, text: 'Diseñaron una landing efectiva para captar leads en el exterior; diseño y performance alineados a nuestros objetivos de marketing.' },
];

// Disciplina (id de SERVICES) de cada caso real.
const DISCIPLINE = { tourist: 'platform', 'gym-oasis': 'platform', 'red-brillante': 'platform', clinicflow: 'app', rigio: 'app', nosense: 'shop', ddec: 'web', pulsomarkt: 'web' };

const EXTRA_DISCIPLINES = [{ id: 'app', name: 'App', short: 'App' }];

export const PROJECTS = CASES.map((c, i) => ({
  slug: c.slug,
  name: c.name,
  client: c.client,
  year: c.year,
  d: DISCIPLINE[c.slug] || 'web',
  category: c.category,
  summary: c.summary,
  points: c.points,
  traits: c.traits,
  images: c.images,
  cover: c.cover,
  video: c.video,
  fit: c.fit,
  href: c.href,
  featured: i === 0,
}));

// Capacidades declaradas en el schema de index.html (knowsAbout)
export const KNOWS = ['Diseño web', 'Desarrollo web', 'Experiencias 3D', 'UX', 'Motion design'];

export const serviceById = Object.fromEntries([...SERVICES, ...EXTRA_DISCIPLINES].map((s) => [s.id, s]));
