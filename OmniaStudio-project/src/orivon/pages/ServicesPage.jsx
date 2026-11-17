import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { FiArrowRight, FiUploadCloud, FiSmartphone, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { SERVICES, SERVICE_DETAIL } from '../servicesData.js';
import { TopRow, Line } from '../components/Reveal.jsx';
import ServiceVisual from '../components/ServiceVisual.jsx';
import Footer from '../sections/Footer.jsx';

const INCLUDED = [
  { icon: FiUploadCloud, t: 'Publicación en servidores', d: 'Nos encargamos de subir tu proyecto a los servidores y dejarlo en línea. No tenés que contratar a nadie más para publicarlo.' },
  { icon: FiSmartphone, t: 'Adaptado a cada pantalla', d: 'Todo lo que hacemos se diseña y se prueba en celular, tablet y escritorio.' },
  { icon: FiCheckCircle, t: 'Revisión antes de lanzar', d: 'Probamos cada flujo antes de publicar y lo revisamos en vivo con vos.' },
  { icon: FiTrendingUp, t: 'Preparado para crecer', d: 'Construimos con una base ordenada para sumar funciones cuando las necesites.' },
];

/** /servicios — cada disciplina en detalle, con su mini interfaz y un acceso directo para iniciar ese proyecto. */
export default function Services() {
  return (
    <div className="sv2">
      <header className="wrap sv2Hd">
        <TopRow left="Servicios / Qué hacemos" right="Cinco disciplinas, un solo equipo" />
        <h1 className="disp sv2H1">
          <Line i={0}>Lo que</Line>
          <Line i={1}>construimos <span className="ser">para vos.</span></Line>
        </h1>
        <div className="sv2Intro">
          <p data-aos="o-blur" data-aos-delay="200">Diseño, desarrollo y tecnología en un mismo estudio. Elegí una disciplina para ver qué incluye, cómo trabajamos y empezar tu proyecto.</p>
          <nav className="sv2Index" aria-label="Servicios" data-aos="o-blur" data-aos-delay="300">
            {SERVICES.map((s, n) => (
              <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                <span className="num">0{n + 1}</span>{s.short}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {SERVICES.map((s, n) => {
        const d = SERVICE_DETAIL[s.id];
        return (
          <section key={s.id} id={s.id} className={clsx('sv2Sec', n % 2 && 'alt')} aria-labelledby={`sv2-${s.id}`}>
            <div className="wrap sv2Grid">
              <div className="sv2Side">
                <div className="sv2Head" data-aos="o-blur">
                  <p className="sv2N num">0{n + 1}</p>
                  <h2 className="disp sv2Name" id={`sv2-${s.id}`}>{s.name}</h2>
                </div>
                <p className="sv2Lead" data-aos="o-blur" data-aos-delay="100">{d.intro}</p>
                <div className="sv2Vis" data-aos="o-clip"><ServiceVisual id={s.id} /></div>
                <Link className="btn btnOrange sv2Cta" to={`/iniciar-proyecto?servicio=${s.id}`}>Iniciar un proyecto de {s.short} <FiArrowRight aria-hidden="true" /></Link>
              </div>
              <div className="sv2Main">
                <p className="lab sv2Lab">Qué incluye</p>
                <ul className="sv2Feats">
                  {d.features.map((f, k) => (
                    <li key={f.t} data-aos="o-blur" data-aos-delay={Math.round(60 * Math.sqrt(k) * 1.4)}>
                      <span className="num">{String(k + 1).padStart(2, '0')}</span>
                      <div><h3>{f.t}</h3><p>{f.d}</p></div>
                    </li>
                  ))}
                </ul>
                <div className="sv2Exp" data-aos="o-blur">
                  <p className="lab">Cómo trabajamos</p>
                  <p>{d.experience}</p>
                </div>
                <ul className="tags sv2Tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
          </section>
        );
      })}

      <section className="sv2Inc" aria-labelledby="inc-title">
        <div className="wrap">
          <TopRow left="Incluido en todos los proyectos" right="Sin costos ocultos de publicación" />
          <h2 className="disp sv2IncH" id="inc-title"><Line>Del diseño <span className="ser">al servidor.</span></Line></h2>
          <div className="sv2IncGrid">
            {INCLUDED.map(({ icon, t, d }, k) => (
              <div className="sv2IncItem" key={t} data-aos="o-blur" data-aos-delay={k * 70}>
                {icon({ 'aria-hidden': true })}
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="close" aria-label="Iniciar un proyecto">
        <Link to="/iniciar-proyecto">
          <span className="disp">¿Cuál es <span className="ser">tu proyecto?</span></span>
          <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h56M46 2l10 10-10 10" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
        </Link>
      </section>
      <Footer />
    </div>
  );
}
