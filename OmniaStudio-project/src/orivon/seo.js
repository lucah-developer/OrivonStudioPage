import { PROJECTS, SERVICES, CONTACT, serviceById } from "./data.js";

export const SITE = "Orivon Studio";
export const SITE_ORIGIN = "https://www.orivonstudio.com.ar";

const ROBOTS_INDEX = "index, follow, max-image-preview:large";

export const PAGES = {
  "/": {
    title: "Orivon Studio — Diseño, desarrollo y dirección creativa",
    description:
      "Estudio de diseño y desarrollo web. Marcas, sitios, plataformas, e-commerce y automatización, con dirección creativa y criterio técnico.",
  },
  "/proyectos": {
    title: `Proyectos — ${SITE}`,
    description:
      "Proyectos de Orivon Studio: reservas, CRM, tiendas, landings y plataformas diseñadas y desarrolladas a medida.",
  },
  "/servicios": {
    title: `Servicios — ${SITE}`,
    description:
      "Brand, web, plataformas a medida, e-commerce e IA: qué incluye cada servicio de Orivon Studio y cómo trabajamos.",
  },
  "/estudio": {
    title: `Estudio — ${SITE}`,
    description:
      "Somos Orivon: un estudio digital independiente que diseña y desarrolla experiencias web, plataformas, apps y agentes inteligentes.",
  },
  "/iniciar-proyecto": {
    title: `Iniciar proyecto — ${SITE}`,
    description:
      "Contanos tu idea: marca, sitio, plataforma, e-commerce o automatización. Te respondemos por WhatsApp.",
  },
};

const CRUMBS = {
  "/proyectos": "Proyectos",
  "/servicios": "Servicios",
  "/estudio": "Estudio",
  "/iniciar-proyecto": "Iniciar proyecto",
};

function setMeta(selector, value) {
  document.querySelector(selector)?.setAttribute(selector.includes("canonical") ? "href" : "content", value);
}

function clip(text, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function absolute(path) {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}

function organization() {
  const home = absolute("/");
  return {
    "@type": "ProfessionalService",
    "@id": `${home}#organization`,
    name: SITE,
    url: home,
    image: `${SITE_ORIGIN}/icon-512.png`,
    logo: `${SITE_ORIGIN}/favicon.svg`,
    description: PAGES["/"].description,
    email: CONTACT.email,
    telephone: "+54-9-260-430-9716",
    areaServed: "AR",
    address: { "@type": "PostalAddress", addressCountry: "AR" },
    sameAs: [CONTACT.instagram, CONTACT.tiktok],
    knowsAbout: ["Diseño web", "Desarrollo web", "Identidad de marca", "E-commerce", "Plataformas a medida", "Automatización"],
  };
}

function writeJsonLd(nodes) {
  const home = absolute("/");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: SITE,
        inLanguage: "es-AR",
        publisher: { "@id": `${home}#organization` },
      },
      ...nodes,
    ],
  };
  let script = document.getElementById("orivon-ld");
  if (!script) {
    script = document.createElement("script");
    script.id = "orivon-ld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

function resolve(pathname) {
  if (pathname.startsWith("/dev")) {
    return {
      index: false,
      robots: "noindex, nofollow",
      title: "Superficie de esferas — Orivon",
      description: PAGES["/"].description,
      path: pathname,
    };
  }

  const projectMatch = pathname.match(/^\/proyectos\/([^/]+)$/);
  if (projectMatch) {
    const project = PROJECTS.find((item) => item.slug === projectMatch[1]);
    if (!project) return { index: false, missing: true, path: pathname };
    const disciplines = (project.ds || [project.d])
      .map((id) => serviceById[id]?.name)
      .filter(Boolean);
    return {
      index: true,
      title: `${project.name} — ${SITE}`,
      description: clip(project.summary),
      path: `/proyectos/${project.slug}`,
      crumbs: [
        { name: "Inicio", path: "/" },
        { name: "Proyectos", path: "/proyectos" },
        { name: project.name, path: `/proyectos/${project.slug}` },
      ],
      extra: [
        {
          "@type": "CreativeWork",
          name: project.name,
          description: project.summary,
          dateCreated: project.year,
          url: absolute(`/proyectos/${project.slug}`),
          creator: { "@id": `${absolute("/")}#organization` },
          about: disciplines,
        },
      ],
    };
  }

  if (pathname === "/proyectos") {
    return {
      index: true,
      ...PAGES["/proyectos"],
      path: "/proyectos",
      crumbs: [
        { name: "Inicio", path: "/" },
        { name: "Proyectos", path: "/proyectos" },
      ],
      extra: [
        {
          "@type": "ItemList",
          itemListElement: PROJECTS.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absolute(`/proyectos/${project.slug}`),
            name: project.name,
          })),
        },
      ],
    };
  }

  if (pathname === "/servicios") {
    return {
      index: true,
      ...PAGES["/servicios"],
      path: "/servicios",
      crumbs: [
        { name: "Inicio", path: "/" },
        { name: "Servicios", path: "/servicios" },
      ],
      extra: [
        {
          "@type": "ItemList",
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: service.name,
              description: service.desc,
              provider: { "@id": `${absolute("/")}#organization` },
            },
          })),
        },
      ],
    };
  }

  const page = PAGES[pathname];
  if (!page) return { index: false, missing: true, path: pathname };
  const crumbs = [{ name: "Inicio", path: "/" }];
  if (CRUMBS[pathname]) crumbs.push({ name: CRUMBS[pathname], path: pathname });
  return { index: true, ...page, path: pathname, crumbs };
}

export function applyRouteMeta(pathname) {
  const meta = resolve(pathname);
  const title = meta.missing ? `Página no encontrada — ${SITE}` : meta.title;
  const description = meta.missing
    ? "Esa dirección no existe en Orivon Studio. Volvé al inicio, a proyectos o a servicios."
    : meta.description;
  const robots = meta.index ? ROBOTS_INDEX : meta.robots || "noindex, follow";
  const url = absolute(meta.path);

  document.title = title;
  setMeta('meta[name="description"]', description);
  setMeta('meta[name="robots"]', robots);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[property="og:type"]', "website");
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('link[rel="canonical"]', url);

  const pageNode = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${absolute("/")}#website` },
    about: { "@id": `${absolute("/")}#organization` },
    inLanguage: "es-AR",
  };
  const nodes = [pageNode];
  if (meta.crumbs) nodes.push(breadcrumb(meta.crumbs));
  if (meta.extra) nodes.push(...meta.extra);
  writeJsonLd(nodes);
}
