import React, { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiX,
  FiLayers,
  FiGrid,
  FiSettings,
  FiMail,
} from "react-icons/fi";
import icono from "../assets/LogoApaisado.svg";
import logo from "../assets/Icono.png";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { href: "/#services", label: "Servicios", Icon: FiLayers },
  { href: "/portfolio", label: "Portfolio", Icon: FiGrid },
  { href: "/#process", label: "Cómo trabajamos", Icon: FiSettings },
  { href: "/#contact", label: "Contacto", Icon: FiMail },
];

export default function Navbar() {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSiteNav, setShowSiteNav] = useState(() => location.pathname !== "/");

  // Función para manejar navegación con anclas
  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setOpen(false);

    const [path, hash] = href.split("#");

    if (path && location.pathname !== path) {
      navigate(path, { replace: true });
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  // Inyectar estilos para ocultar scrollbar (si no los tenés)
  useEffect(() => {
    const id = "orivon-no-scrollbar-style";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = `
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // En el inicio el hero cinematográfico ocupa la barra superior.
  // El navbar fijo entra cuando el usuario empieza a bajar.
  useEffect(() => {
    if (!isHome) {
      setShowSiteNav(true);
      return undefined;
    }

    const onScroll = () => {
      const stage = document.getElementById("orivon-logo-stage");
      const journey = Number(stage?.dataset.journey || 0);
      if (journey > 0.04) {
        setShowSiteNav(journey > 0.6);
        return;
      }
      const hero = document.getElementById("hero");
      const limit = hero ? hero.offsetHeight * 0.72 : window.innerHeight * 0.72;
      setShowSiteNav(window.scrollY > limit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Detectar scroll: uso IntersectionObserver con #hero si existe
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (hero && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => setScrolled(!entries[0].isIntersecting),
        { root: null, threshold: 0.01 }
      );
      io.observe(hero);
      return () => io.disconnect();
    } else {
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape y click fuera para cerrar el panel
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      window.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const cinematic = isHome && !showSiteNav;

  return (
    <>
      <header
        data-site-nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          cinematic
            ? "is-cinematic bg-transparent"
            : scrolled || isHome
              ? "backdrop-blur-sm bg-white/95 shadow-md"
              : "bg-transparent"
        }`}
        aria-expanded={open}
      >
        <div className={`mx-auto px-6 md:px-10 ${cinematic ? "max-w-[1440px]" : "max-w-7xl md:px-8"}`}>
          <div className={`flex items-center h-16 md:h-20 ${cinematic ? "md:grid md:grid-cols-[1fr_auto_1fr]" : "justify-between"}`}>
            <a href="/" className={`flex items-center gap-3 ${cinematic ? "justify-self-start" : ""}`}>
              {cinematic ? (
                <span className="font-heading text-[0.82rem] md:text-sm font-medium tracking-[0.22em] text-[#FAF2E8]">
                  ORIVON STUDIO
                </span>
              ) : (
                <img
                  src={icono}
                  alt="Orivon Studio"
                  className="h-full w-auto object-contain"
                />
              )}
            </a>

            <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${cinematic ? "justify-self-center" : ""}`}>
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleAnchorClick(e, href)}
                  className={`relative group px-1 py-2 transition-colors duration-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)]/30 ${
                    cinematic ? "text-[#FAF2E8]/80 hover:text-[#FAF2E8]" : "text-[var(--text-primary)]"
                  }`}
                >
                  <span
                    className={`inline-block transition-all duration-300 ${
                      cinematic
                        ? ""
                        : "group-hover:bg-gradient-to-r group-hover:from-[var(--accent-1)] group-hover:to-[var(--accent-2)] group-hover:bg-clip-text group-hover:text-transparent"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px w-0 rounded-full transition-all duration-300 ease-out group-hover:w-full ${
                      cinematic ? "bg-[#00A78E]" : "h-0.5 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)]"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              ))}

              {!cinematic && (
                <a
                  href="/#contact"
                  onClick={(e) => handleAnchorClick(e, "/#contact")}
                  className="ml-4 relative inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--accent-1)]/25"
                  style={{ background: "var(--accent-1)" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Solicitar presupuesto</span>
                </a>
              )}
            </nav>

            {cinematic && (
              <a
                href="/#contact"
                onClick={(e) => handleAnchorClick(e, "/#contact")}
                className="hidden md:inline-flex justify-self-end items-center px-4 py-2 rounded-full bg-[#FAF2E8] text-[#071525] text-sm font-medium tracking-wide transition duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF2E8]/70"
              >
                Hablemos ↗
              </a>
            )}

            <div className={`md:hidden flex items-center gap-3 ${cinematic ? "ml-auto" : ""}`}>
              <a
                href="#contact"
                onClick={(e) => handleAnchorClick(e, "/#contact")}
                className="inline-block rounded-full"
                aria-label={cinematic ? "Hablemos" : "Contacto"}
              >
                <div
                  className={`h-9 px-3 flex items-center justify-center ${cinematic ? "rounded-full bg-[#FAF2E8]" : "rounded-md"}`}
                  style={cinematic ? undefined : { background: "var(--accent-1)" }}
                >
                  <span className={`text-sm font-medium ${cinematic ? "text-[#071525]" : "text-white"}`}>
                    {cinematic ? "Hablemos" : "Presupuesto"}
                  </span>
                </div>
              </a>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Abrir menú"
                aria-expanded={open}
                className={`p-2 rounded-md ${cinematic ? "text-[#FAF2E8]" : "text-[var(--text-primary)]"}`}
              >
                {open ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          MENU MÓVIL FUERA DEL HEADER
         ========================= */}
      <div
        className="md:hidden"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        {/* overlay */}
        <div
          className={`fixed inset-0 bg-black/60 transition-opacity duration-300 z-40 ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* panel principal */}
        <div
          ref={panelRef}
          className={`fixed inset-0 z-50 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full w-full bg-[var(--neutral-100)] shadow-2xl">
            <div className="px-3  flex items-center justify-between border-b border-gray-200">
              <img
                src={logo}
                alt="Orivon Studio"
                className="h-20 w-auto object-contain"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menu"
                className="p-2"
              >
                <FiX size={20} />
              </button>
            </div>

            <nav className="px-6 py-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6">
              {NAV_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleAnchorClick(e, href)}
                  className="flex items-center gap-4 py-3 px-2 rounded-md w-full text-left hover:bg-white/60 transition"
                >
                  {Icon && (
                    <Icon className="text-2xl text-[var(--text-primary)]" />
                  )}
                  <span className="text-lg font-semibold text-[var(--text-primary)]">
                    {label}
                  </span>
                </a>
              ))}

              <div className="w-full mt-2">
                <a
                  href="/#contact"
                  onClick={(e) => handleAnchorClick(e, "/#contact")}
                  className="block w-full text-center px-6 py-3 rounded-full text-white font-semibold transform transition hover:scale-105"
                  style={{ background: "var(--accent-1)" }}
                >
                  <span className="relative z-10">Solicitar presupuesto</span>
                </a>
              </div>

              <div className="w-full border-t border-gray-200 pt-4 mt-4 text-sm text-gray-600">
                <p className="mb-2">También podés escribirnos por:</p>
                <div className="flex items-center gap-3">
                  <a
                    href="mailto:info@orivonstudio.com"
                    className="text-[var(--text-primary)]"
                  >
                    orivonstudio@gmail.com
                  </a>
                  <span className="text-gray-400">·</span>
                  <a
                    href="https://wa.me/5492604309716"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-primary)]"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-auto pb-8">
                <div className="flex gap-4 mt-4">
                  <a
                    href="https://www.instagram.com/orivonstudio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-primary)]"
                  >
                    Instagram
                  </a>
                  {/* <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-primary)]"
                  >
                    LinkedIn
                  </a> */}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
