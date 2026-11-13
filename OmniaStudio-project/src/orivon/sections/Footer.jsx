import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone, FiArrowUp } from 'react-icons/fi';
import { CONTACT } from '../data.js';

export default function Footer() {
  return (
    <footer className="ftS">
      <div className="wrap">
        <div className="ftTop">
          <div className="ftBrand" data-aos="o-blur">
            <div className="ftLogo">
              <img src={`${import.meta.env.BASE_URL}orivon-icon-sm.png`} alt="" width="56" height="59" />
              <span>Orivon<br />Studio</span>
            </div>
            <p>Independent digital studio. Diseño con estilo, tecnología con propósito.</p>
          </div>
          <nav className="ftCol" aria-label="Pie de página" data-aos="o-blur" data-aos-delay="60">
            <h6>Navegación</h6>
            <Link to="/proyectos">Proyectos</Link><Link to="/#servicios">Servicios</Link><Link to="/estudio">Estudio</Link><Link to="/iniciar-proyecto">Iniciar proyecto</Link>
          </nav>
          <div className="ftCol" data-aos="o-blur" data-aos-delay="110">
            <h6>Contacto</h6>
            <a href={`mailto:${CONTACT.email}`}><FiMail aria-hidden="true" /> Email</a>
            <a href={CONTACT.phoneHref}><FiPhone aria-hidden="true" /> {CONTACT.phone}</a>
          </div>
          <div className="ftCol" data-aos="o-blur" data-aos-delay="150">
            <h6>Redes</h6>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer"><FiInstagram aria-hidden="true" /> Instagram</a>
          </div>
        </div>
        <p className="ftWord" aria-hidden="true"><span data-aos="o-rise" data-aos-duration="1200">Orivon<sup>studio</sup></span></p>
        <div className="ftBar">
          <span>© {new Date().getFullYear()} Orivon Studio. Diseño &amp; desarrollo.</span>
          <div className="dots" aria-hidden="true"><i className="bgT" /><i className="bgO" /><i className="bgV" /></div>
          <button type="button" className="toTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Volver arriba <FiArrowUp aria-hidden="true" /></button>
        </div>
      </div>
    </footer>
  );
}
