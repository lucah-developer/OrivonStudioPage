// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AOS from "aos";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CursorDot from "./components/site/CursorDot";
import { scrollToElement } from "./smoothScroll.js";
import HomePage from "./components/site/HomePage";
import BeadLab from "./components/site/BeadLab";
import Nav from "./orivon/components/Nav";
import Projects from "./orivon/pages/Projects";
import About from "./orivon/pages/About";
import StartProject from "./orivon/pages/StartProject";
import ServicesPage from "./orivon/pages/ServicesPage";
import NotFound from "./orivon/pages/NotFound";
import { applyRouteMeta } from "./orivon/seo.js";
import "./orivon/styles/orivon.scoped.css";
import "./orivon/styles/services.scoped.css";
import "./orivon/styles/orivon.overrides.css";

function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyRouteMeta(pathname);
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
      if (id) scrollToElement(document.getElementById(id));
      else if (typeof window.__orivonScrollTo === "function") window.__orivonScrollTo(0);
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
          <Route path="/proyectos/:slug" element={page(<Projects />)} />
          <Route path="/servicios" element={page(<ServicesPage />)} />
          <Route path="/estudio" element={page(<About />)} />
          <Route path="/iniciar-proyecto" element={page(<StartProject />)} />
          <Route path="/portfolio" element={<Navigate to="/proyectos" replace />} />
          <Route path="/dev/beads" element={<BeadLab />} />
          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </main>
    </div>
  );
}
