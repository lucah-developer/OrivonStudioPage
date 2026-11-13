import { Link, NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <header className="ov ovNav" data-site-nav>
      <div className="nav">
      <Link to="/" className="navLogo" aria-label="Orivon Studio, inicio">
        <img src={`${import.meta.env.BASE_URL}orivon-logo.png`} alt="" width="118" height="44" />
      </Link>
      <nav className="navLinks" aria-label="Principal">
        <NavLink to="/proyectos" className={({ isActive }) => (isActive ? 'cur' : undefined)}>Proyectos</NavLink>
        <Link to="/#servicios">Servicios</Link>
        <NavLink to="/estudio" className={({ isActive }) => (isActive ? 'cur' : undefined)}>Estudio</NavLink>
        <Link to="/#contacto">Contacto</Link>
        <NavLink to="/iniciar-proyecto" className={({ isActive }) => (isActive ? 'navCta on' : 'navCta')}>Iniciar proyecto</NavLink>
      </nav>
      </div>
    </header>
  );
}
