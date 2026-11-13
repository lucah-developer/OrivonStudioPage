import { CONTACT } from '../data.js';
import { TopRow, Line } from '../components/Reveal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';

export default function Contact() {
  return (
    <section className="coS" id="contacto" aria-labelledby="co-title">
      <div className="wrap">
        <TopRow left="Contact / 09" right="Nuevos proyectos" />
        <div className="coGrid">
          <div className="coL">
            <h2 className="disp coH1" id="co-title"><Line>Hablemos.</Line></h2>
            <p className="lead" data-aos="o-blur" data-aos-delay="150">Contanos en qué estás pensando: el contexto, el objetivo y los tiempos. Con eso alcanza para empezar.</p>
            <dl className="coInfo">
              <div data-aos="o-blur"><dt>Email</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
              <div data-aos="o-blur" data-aos-delay="80"><dt>Teléfono</dt><dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd></div>
              <div data-aos="o-blur" data-aos-delay="140"><dt>Instagram</dt><dd><a href={CONTACT.instagram} target="_blank" rel="noreferrer">{CONTACT.instagramHandle}</a></dd></div>
            </dl>
          </div>
          <div className="coR" data-aos="o-blur">
            <ProjectForm />
          </div>
        </div>
      </div>
    </section>
  );
}
