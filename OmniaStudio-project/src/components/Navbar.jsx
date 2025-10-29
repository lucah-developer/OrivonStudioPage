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

const NAV_LINKS = [
  { href: "#services", label: "Servicios", Icon: FiLayers },
  { href: "#portfolio", label: "Portfolio", Icon: FiGrid },
  { href: "#process", label: "Cómo trabajamos", Icon: FiSettings },
  { href: "#contact", label: "Contacto", Icon: FiMail },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur bg-white/70 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img
              src={icono}
              alt="Omnia Studio"
              className="h-full md:h-full w-auto object-contain"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={
                  // grupo para controlar pseudo-elementos before/after en tailwind
                  `relative group px-1 py-2 transition-colors duration-300
                   text-[var(--text-primary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)]/20 rounded`
                }
              >
                {/* texto que se vuelve gradiente al hover */}
                <span
                  className={`inline-block transition-all duration-300
                     group-hover:bg-gradient-to-r group-hover:from-[var(--accent-1)] group-hover:to-[var(--accent-2)]
                     group-hover:bg-clip-text group-hover:text-transparent`}
                >
                  {label}
                </span>

                {/* underline animada por after */}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 w-0
                     bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] rounded-full
                     transition-all duration-300 ease-out
                     group-hover:w-full`}
                  aria-hidden="true"
                />
              </a>
            ))}

            {/* CTA */}
            <a
              href="#contact"
              className="ml-4 relative inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-medium shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--accent-1)]/25"
              style={{ background: "var(--accent-1)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Solicitar presupuesto</span>
            </a>
          </nav>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-3">
            <a
              href="#contact"
              className="inline-block p-1 rounded-md"
              aria-label="Contacto"
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{ background: "var(--accent-1)" }}
              >
                <span className="text-white text-sm font-medium">Presu</span>
              </div>
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={open}
              className="p-2 rounded-md text-[var(--text-primary)]"
            >
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu + overlay */}
      <div className={`md:hidden`} aria-hidden={!open}>
        {/* overlay */}
        <div
          className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* panel */}
        <div
          ref={menuRef}
          className={`fixed right-0 top-0 w-full max-w-md h-full bg-[var(--neutral-100)]/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200">
            <img
              src={icono}
              alt="Omnia Studio"
              className="h-10 w-auto object-contain"
            />
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menu"
              className="p-2"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <a
                key={href}
                onClick={() => setOpen(false)}
                href={href}
                className="flex items-center gap-3 py-3 px-3 rounded-md hover:bg-white/60 transition"
              >
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                  {/* icono + pequeña animación al hover */}
                  {/* si no mandás Icon en el objeto, no hay problema */}
                  {Icon ? (
                    <Icon className="text-lg text-[var(--text-primary)]" />
                  ) : null}
                </span>
                <span className="text-base font-medium text-[var(--text-primary)]">
                  {label}
                </span>
              </a>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block text-center mx-2 relative inline-flex items-center justify-center px-5 py-3 rounded-full text-white font-semibold transform transition hover:scale-105"
                style={{ background: "var(--accent-1)" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Solicitar presupuesto</span>
              </a>
            </div>

            {/* social / extra links */}
            <div className="mt-6 px-3">
              <p className="text-xs text-gray-500">
                También podés escribirnos por:
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="mailto:info@tuemail.com"
                  className="text-sm text-[var(--text-primary)]"
                >
                  info@tuemail.com
                </a>
                <span className="text-sm text-gray-400">·</span>
                <a
                  href="https://wa.me/549xxxxxxxxx"
                  className="text-sm text-[var(--text-primary)]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
