import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/LogoApaisado.svg";

const LINKS = [
  ["Proyectos", "/#work"],
  ["Servicios", "/#services"],
  ["Estudio", "/#studio"],
  ["Contacto", "/#contact"],
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="studio">
      <nav className="studio-nav" data-site-nav aria-label="Principal">
        <Link to="/" className="studio-nav__brand" aria-label="Orivon Studio">
          <img src={logo} alt="Orivon Studio" />
        </Link>
        <div className="studio-nav__links">
          {LINKS.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
          <a className="studio-nav__cta" href="/#contact">
            Iniciar proyecto
          </a>
        </div>
        <button
          className="studio-nav__burger"
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      {open && (
        <div className="studio-menu">
          <div>
            {LINKS.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </div>
          <a className="btn" href="/#contact" onClick={() => setOpen(false)}>
            Iniciar proyecto
          </a>
          <span className="kicker">{pathname === "/portfolio" ? "Portfolio" : "Orivon Studio"}</span>
        </div>
      )}
    </header>
  );
}
