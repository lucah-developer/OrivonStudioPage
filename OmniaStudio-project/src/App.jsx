// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AOS from "aos";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CursorDot from "./components/site/CursorDot";
import HomePage from "./components/site/HomePage";
import BeadLab from "./components/site/BeadLab";
import Nav from "./orivon/components/Nav";
import Projects from "./orivon/pages/Projects";
import About from "./orivon/pages/About";
import StartProject from "./orivon/pages/StartProject";
import "./orivon/styles/orivon.scoped.css";
import "./orivon/styles/orivon.overrides.css";

const SITE = "Orivon Studio";
const META = {
  "/": {
    title: "Orivon Studio — Diseño, desarrollo y dirección creativa",
    description: "Orivon Studio diseña y desarrolla marcas, sitios y productos digitales. Dirección creativa, diseño y desarrollo a medida.",
  },
  "/proyectos": {
    title: `Proyectos — ${SITE}`,
    description: "Proyectos de Orivon Studio: reservas, CRM, tiendas, landings y plataformas diseñadas y desarrolladas a medida.",
  },
  "/estudio": {
    title: `Estudio — ${SITE}`,
    description: "Somos Orivon: un estudio digital independiente que diseña y desarrolla experiencias web, plataformas, apps y agentes inteligentes.",
  },
  "/iniciar-proyecto": {
    title: `Iniciar proyecto — ${SITE}`,
    description: "Contanos tu idea: marca, sitio, plataforma, e-commerce o automatización. Te respondemos por email.",
  },
};

function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/dev")) {
      document.title = "Superficie de esferas — Orivon";
      return;
    }
    const meta = META[pathname] || META["/"];
    const url = `${location.origin}${pathname}`;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  }, [pathname]);

  return null;
}

/** Anclas (/#servicios) y refresco de AOS/ScrollTrigger al cambiar de página. */
function RouteScroll() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    const id = hash.replace("#", "");
    const t = setTimeout(() => {
      AOS.refreshHard();
      ScrollTrigger.refresh();
      // Después del refresh: ScrollTrigger restaura la posición previa al recalcular.
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    }, 60);
    return () => clearTimeout(t);
  }, [pathname, hash, search]);

  return null;
}

const page = (el) => <div className="ov">{el}</div>;

export default function App() {
  const { pathname } = useLocation();
  const lab = pathname.startsWith("/dev");

  return (
    <div className="min-h-screen" style={{ overflowX: "clip" }}>
      <PageMeta />
      <RouteScroll />
      {!lab && <CursorDot />}
      {!lab && (
        <div className="ov">
          <a className="skip" href="#contenido">Saltar al contenido</a>
        </div>
      )}
      {!lab && <Nav />}

      <main id="contenido">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/proyectos" element={page(<Projects />)} />
          <Route path="/estudio" element={page(<About />)} />
          <Route path="/iniciar-proyecto" element={page(<StartProject />)} />
          <Route path="/portfolio" element={<Navigate to="/proyectos" replace />} />
          <Route path="/dev/beads" element={<BeadLab />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}
