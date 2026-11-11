// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import CursorDot from "./components/site/CursorDot";
import SiteNav from "./components/site/SiteNav";
import SiteFooter from "./components/site/SiteFooter";
import HomePage from "./components/site/HomePage";

const HOME_DESCRIPTION =
  "Orivon Studio diseña y desarrolla marcas, sitios y productos digitales. Dirección creativa, diseño y desarrollo a medida.";

const PORTFOLIO_DESCRIPTION =
  "Portfolio de Orivon Studios: landings, e-commerce, aplicaciones y experiencias digitales diseñadas y desarrolladas a medida.";

function PageMeta() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const home = pathname === "/";
    const url = `${location.origin}${pathname}`;
    document.title = home
      ? "Orivon Studio — Diseño, desarrollo y dirección creativa"
      : "Portfolio — Orivon Studios";
    document.querySelector('meta[name="description"]')?.setAttribute("content", home ? HOME_DESCRIPTION : PORTFOLIO_DESCRIPTION);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", home ? HOME_DESCRIPTION : PORTFOLIO_DESCRIPTION);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <PageMeta />
      <CursorDot />
      <SiteNav />

      <Routes>
        <Route path="/" element={<main><HomePage /><SiteFooter /></main>} />
        <Route path="/portfolio" element={<main><Portfolio /><SiteFooter /></main>} />
      </Routes>
    </div>
  );
}
