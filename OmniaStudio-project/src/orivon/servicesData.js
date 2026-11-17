// Detalle de cada servicio para /servicios (zip orivon-servicios). SERVICES vive en data.js.
export { SERVICES, serviceById } from './data.js';

/**
 * Detalle de cada servicio para /servicios y el Hero.
 * hero: palabra que rota en el titular. features: qué incluye. experience: cómo es trabajar en ese servicio.
 */
export const SERVICE_DETAIL = {
  web: {
    hero: 'sitios web.',
    intro: 'Sitios y landing pages diseñados a medida y desarrollados por el mismo equipo. Pensados para comunicar quién sos, convencer y convertir visitas en consultas.',
    features: [
      { t: 'Diseño a medida', d: 'Nada de plantillas: cada sitio parte de tu marca, tu público y lo que necesitás que pase cuando alguien entra.' },
      { t: 'Landing pages', d: 'Páginas enfocadas en una sola acción, para campañas, lanzamientos o captación de clientes.' },
      { t: 'Motion y 3D', d: 'Animaciones e interacciones que hacen memorable la experiencia, sin sacrificar la velocidad de carga.' },
      { t: 'Adaptado a cada pantalla', d: 'Diseño pensado para celular, tablet y escritorio desde el primer boceto.' },
      { t: 'Rendimiento', d: 'Código liviano y optimizado para que el sitio cargue rápido y se mantenga ágil.' },
      { t: 'Publicación incluida', d: 'Subimos el proyecto a los servidores y lo dejamos en línea, listo para recibir visitas.' },
    ],
    experience: 'Empezamos por entender tu negocio y qué tiene que lograr el sitio. Diseñamos la estructura y la identidad visual, la validás, y recién ahí la desarrollamos. Al final la publicamos y la revisamos en vivo con vos.',
  },
  shop: {
    hero: 'tiendas online.',
    intro: 'Tiendas y catálogos digitales para vender todos los días. Con el carrito, los cobros y los pedidos resueltos para que comprar sea simple para tus clientes y fácil de gestionar para vos.',
    features: [
      { t: 'Pedidos por WhatsApp', d: 'El cliente arma su carrito y envía el pedido directo a tu WhatsApp, con el detalle de productos y cantidades.' },
      { t: 'Pagos con Mercado Pago o Stripe', d: 'Pasarela de pago integrada para cobrar con tarjeta y recibir transferencias dentro de la plataforma.' },
      { t: 'Catálogo digital', d: 'Productos, variantes y precios organizados para que encontrar y elegir sea rápido.' },
      { t: 'Experiencia de compra', d: 'Fichas de producto, carrito y checkout diseñados para que nadie abandone a mitad de camino.' },
      { t: 'Gestión simple', d: 'Una estructura pensada para que puedas cargar y actualizar productos sin depender de nadie.' },
      { t: 'Publicación incluida', d: 'Subimos la tienda a los servidores y la dejamos funcionando, con los pagos configurados.' },
    ],
    experience: 'Definimos juntos cómo vendés hoy: por WhatsApp, con pagos online o ambos. Diseñamos el catálogo y el recorrido de compra, integramos la forma de cobro que elijas, probamos cada paso del pedido y publicamos la tienda.',
  },
  ai: {
    hero: 'agentes de IA.',
    intro: 'Agentes inteligentes y automatizaciones que se ocupan del trabajo repetitivo: responden, ordenan y ejecutan tareas para que tu equipo se concentre en lo importante.',
    features: [
      { t: 'Agentes inteligentes', d: 'Asistentes que entienden lo que se les pide y responden con la información de tu negocio.' },
      { t: 'Modelos de lenguaje integrados', d: 'Conectamos modelos de lenguaje a tus herramientas para que trabajen con tus datos reales.' },
      { t: 'Automatización de procesos', d: 'Tareas repetitivas que pasan a resolverse solas: cargar datos, avisar, derivar, registrar.' },
      { t: 'Integración con tus sistemas', d: 'El agente se conecta con tu plataforma, tu web o tus planillas, en lugar de funcionar aislado.' },
      { t: 'Supervisión', d: 'Definimos qué puede hacer solo y qué necesita aprobación de una persona.' },
      { t: 'Publicación incluida', d: 'Lo dejamos funcionando en los servidores y conectado a los canales que uses.' },
    ],
    experience: 'Relevamos qué tareas consumen más tiempo y cuáles tienen reglas claras. Diseñamos cómo va a trabajar el agente, lo entrenamos con la información de tu negocio, lo probamos con casos reales y lo ponemos en marcha.',
  },
  platform: {
    hero: 'plataformas.',
    intro: 'Sistemas a medida para ordenar cómo trabaja tu negocio: clientes, reservas, datos y procesos en un solo lugar, diseñado alrededor de tu forma de trabajar.',
    features: [
      { t: 'CRM', d: 'Tus clientes, contactos y oportunidades organizados y con historial.' },
      { t: 'Dashboards', d: 'Los números de tu negocio en tiempo real, visibles de un vistazo.' },
      { t: 'Sistemas de reservas', d: 'Turnos, agendas y disponibilidad que se gestionan solos.' },
      { t: 'Integraciones', d: 'Conectamos la plataforma con las herramientas que ya usás.' },
      { t: 'Plataformas a medida', d: 'Cuando nada de lo que existe encaja, construimos el sistema que tu operación necesita.' },
      { t: 'Publicación incluida', d: 'Desplegamos la plataforma en los servidores y la dejamos lista para que tu equipo la use.' },
    ],
    experience: 'Mapeamos tus procesos actuales y dónde se traban. Diseñamos la arquitectura y las pantallas, construimos por etapas para que veas avances reales y la publicamos lista para usar.',
  },
  brand: {
    hero: 'marcas.',
    intro: 'Identidades visuales y sistemas de diseño que hacen que todo lo que tu marca toca —web, redes, productos— hable el mismo idioma.',
    features: [
      { t: 'Identidad visual', d: 'Logo, colores, tipografías y el criterio para usarlos.' },
      { t: 'Diseño de interfaces', d: 'Pantallas y componentes para webs, apps y plataformas.' },
      { t: 'Dirección creativa', d: 'Una mirada que ordena todas las piezas para que la marca sea reconocible.' },
      { t: 'Sistemas gráficos', d: 'Reglas y piezas reutilizables para crecer sin perder coherencia.' },
      { t: 'Motion design', d: 'La marca en movimiento: animaciones para web, redes y presentaciones.' },
      { t: 'Entrega lista para usar', d: 'Archivos organizados y una guía para que cualquiera pueda aplicarla.' },
    ],
    experience: 'Investigamos tu mercado y lo que te diferencia. Exploramos direcciones visuales, elegimos una con vos y la desarrollamos hasta un sistema completo, con todo lo necesario para aplicarla.',
  },
};

// Orden en el que rotan los servicios en el Hero
export const HERO_ORDER = ['web', 'shop', 'ai', 'platform', 'brand'];

