import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  return (
    <header className="ov ovNav" data-site-nav>
      <div className="nav">
      <Link to="/" className="navLogo" aria-label="Orivon Studio, inicio">
        <img src={`${import.meta.env.BASE_URL}orivon-logo.png`} alt="" width="118" height="44" />
      </Link>
      <button
        type="button"
        className="navToggle"
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Cerrar' : 'Menú'}
      </button>
      <nav id="nav-menu" className={open ? 'navLinks is-open' : 'navLinks'} aria-label="Principal">
        <NavLink to="/proyectos" className={({ isActive }) => (isActive ? 'cur' : undefined)}>Proyectos</NavLink>
        <NavLink to="/servicios" className={({ isActive }) => (isActive ? 'cur' : undefined)}>Servicios</NavLink>
        <NavLink to="/estudio" className={({ isActive }) => (isActive ? 'cur' : undefined)}>Estudio</NavLink>
        <Link to="/#contacto">Contacto</Link>
        <NavLink to="/iniciar-proyecto" className={({ isActive }) => (isActive ? 'navCta on' : 'navCta')}>Iniciar proyecto</NavLink>
      </nav>
      </div>
    </header>
  );
}
