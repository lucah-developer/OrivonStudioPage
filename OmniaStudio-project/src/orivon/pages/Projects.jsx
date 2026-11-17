import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { FiGrid, FiList } from 'react-icons/fi';
import { PROJECTS, SERVICES, serviceById } from '../data.js';
import { TopRow, Line, Arrow } from '../components/Reveal.jsx';
import Footer from '../sections/Footer.jsx';
import { scrollToElement } from '../../smoothScroll.js';
import NotFound from './NotFound.jsx';

const SPANS = ['sA', 'sB', 'sC', 'sD', 'sD', 'sE', 'sA'];
const TONES = ['deep', 'sand', 'navy', 'sand', 'deep', 'navy', 'sand'];

function Ph({ tone, label, n, img, fit, video, alt = '' }) {
  return (
    <div className={clsx('ph', tone, (img || video) && 'hasImg')}>
      {video ? (
        <video className="phImg phVideo" src={video} poster={img || undefined} muted loop playsInline autoPlay aria-label={alt || undefined} />
      ) : img ? (
        <img className={clsx('phImg', fit === 'contain' && 'contain')} src={img} alt={alt} loading="lazy" />
      ) : null}
      <div className="phRow"><span className="lab">{label}</span><i className="dot" /></div>
      <div className="phRow"><b>{n}</b></div>
    </div>
  );
}

function Case({ slug, children, ...rest }) {
  return (
    <Link to={`/proyectos/${slug}#detalle`} {...rest} data-cursor="view" data-cursor-label="Ver detalle">
      {children}
    </Link>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('gal');
  const { slug: routeSlug } = useParams();
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const querySlug = params.get('proyecto');
  const requested = routeSlug || querySlug;
  const known = PROJECTS.find((p) => p.slug === requested);
  const [gallery, setGallery] = useState(false);
  const [shot, setShot] = useState(0);
  const opened = useRef(false);
  const detail = known || PROJECTS.find((p) => p.featured) || PROJECTS[0];
  const matches = useMemo(
    () => PROJECTS.filter((p) => filter === 'all' || (p.ds || [p.d]).includes(filter)),
    [filter],
  );
  const shown = matches.filter((p) => p.slug !== detail.slug);
  const fname = filter === 'all' ? 'Todas las disciplinas' : serviceById[filter].name;
  const num = (p) => String(PROJECTS.indexOf(p) + 1).padStart(2, '0');
  const disciplineLabel = (p) => {
    const ids = p.ds?.length ? p.ds : [p.d];
    return ids.map((id) => serviceById[id]?.[ids.length > 1 ? 'short' : 'name']).filter(Boolean).join(' · ');
  };
  const listKey = `${filter}-${view}-${detail.slug}`;

  useEffect(() => {
    if (querySlug && PROJECTS.some((p) => p.slug === querySlug)) {
      navigate(`/proyectos/${querySlug}${hash || '#detalle'}`, { replace: true });
    }
  }, [querySlug, hash, navigate]);

  useEffect(() => {
    setGallery(false);
    setShot(0);
  }, [detail.slug]);

  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      return undefined;
    }
    const frame = requestAnimationFrame(() => scrollToElement(document.getElementById('detalle')));
    return () => cancelAnimationFrame(frame);
  }, [detail.slug]);

  const shots = detail.images?.length ? detail.images : [];
  const showShots = !detail.href && shots.length > 0;

  useEffect(() => {
    if (!gallery) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setGallery(false);
      if (event.key === 'ArrowRight') setShot((index) => (index + 1) % shots.length);
      if (event.key === 'ArrowLeft') setShot((index) => (index - 1 + shots.length) % shots.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gallery, shots.length]);

  if (routeSlug && !known) return <NotFound />;

  return (
    <div className="pj">
      <header className="pjHd">
        <div className="wrap">
          <TopRow left="Archivo / Proyectos" right="Nuestro trabajo habla por nosotros" />
          <div className="pjHdGrid">
            <h1 className="disp pjH1">
              <Line i={0}>Proyectos.</Line>
              <Line i={1}><span className="ser">el archivo completo</span></Line>
            </h1>
            <p className="pjLead" data-aos="o-blur" data-aos-delay="250">Marcas, sitios, plataformas, tiendas y automatizaciones. Filtrá por disciplina o cambiá a la vista índice para recorrer todo de un vistazo.</p>
          </div>

          <article className="feat" id="detalle">
            <div className="featImg">
              <Ph tone="navy" label={disciplineLabel(detail)} n={num(detail)} img={detail.cover} fit={detail.fit} video={detail.video} alt={detail.name} />
            </div>
            <div className="featMeta">
              <h2 className="disp">{detail.name}</h2>
              <div className="featCopy">
                <p className="featKicker">{detail.client} · {detail.year} · {disciplineLabel(detail)}{detail.traits?.length ? ` · ${detail.traits.join(' · ')}` : ''}</p>
                <p>{detail.summary}</p>
                {detail.points?.length > 0 && (
                  <ul>
                    {detail.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                )}
              </div>
              {detail.href ? (
                <a className="go" href={detail.href} target="_blank" rel="noreferrer" aria-label={`Abrir el sitio de ${detail.name}`}>
                  <Arrow />
                </a>
              ) : showShots ? (
                <button type="button" className="featShots" onClick={() => { setShot(0); setGallery(true); }}>
                  Ver imágenes
                </button>
              ) : null}
            </div>
          </article>
        </div>
      </header>

      <section className="wrap" aria-label="Listado de proyectos">
        <div className="bar" id="lista">
          <div className="chips" role="group" aria-label="Filtrar por disciplina">
            {[{ id: 'all', short: 'Todos' }, ...SERVICES, { id: 'app', short: 'App' }].map((s) => {
              const count = s.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => (p.ds || [p.d]).includes(s.id)).length;
              return (
                <button key={s.id} type="button" className={clsx('chip', filter === s.id && 'sel')} aria-pressed={filter === s.id} onClick={() => setFilter(s.id)}>
                  {s.short} <sup>{count}</sup>
                </button>
              );
            })}
          </div>
          <div className="views" role="group" aria-label="Vista">
            <button type="button" className={clsx('vbtn', view === 'gal' && 'sel')} aria-pressed={view === 'gal'} onClick={() => setView('gal')}><FiGrid aria-hidden="true" /> Galería</button>
            <button type="button" className={clsx('vbtn', view === 'idx' && 'sel')} aria-pressed={view === 'idx'} onClick={() => setView('idx')}><FiList aria-hidden="true" /> Índice</button>
          </div>
        </div>
        <div className="status" aria-live="polite">
          <p className="lab">{shown.length ? `Mostrando ${shown.length} ${shown.length === 1 ? 'proyecto' : 'proyectos'}` : matches.length ? 'El proyecto de esta disciplina está en el detalle de arriba' : 'Sin resultados'}</p>
          <p className="lab">{fname}</p>
        </div>

        {matches.length === 0 && (
          <div className="empty">
            <p>Todavía no hay proyectos publicados en {fname}.</p>
            <button className="lnk" type="button" onClick={() => setFilter('all')}>Ver todos los proyectos</button>
          </div>
        )}

        {shown.length > 0 && view === 'gal' && (
          <div className="gal" key={listKey}>
            {shown.map((p, i) => (
              <Case key={p.slug} slug={p.slug} className={clsx('card', shown.length === 1 ? 'sE' : SPANS[i % SPANS.length])} style={{ animationDelay: `${Math.round(70 * Math.sqrt(i) * 1.4)}ms` }}>
                <div className="cImg"><Ph tone={TONES[i % TONES.length]} label={disciplineLabel(p)} n={num(p)} img={p.cover} fit={p.fit} video={p.video} /></div>
                <div className="cMeta">
                  <span className="num">{num(p)}</span>
                  <div><h3>{p.name}</h3><p>{p.client} · {p.year}</p></div>
                  <span className="go" aria-hidden="true"><Arrow size={18} /></span>
                </div>
              </Case>
            ))}
          </div>
        )}

        {shown.length > 0 && view === 'idx' && (
          <div className="idx" key={listKey} role="table" aria-label="Índice de proyectos">
            <div className="ihead" role="row">
              <span className="lab" role="columnheader">N.º</span><span className="lab" role="columnheader">Proyecto</span>
              <span className="lab hideM" role="columnheader">Cliente</span><span className="lab hideT hideM" role="columnheader">Disciplina</span>
              <span className="lab hideM" role="columnheader">Año</span><span />
            </div>
            {shown.map((p, i) => (
              <Case key={p.slug} slug={p.slug} className="irow" role="row" style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}>
                <span className="num" role="cell">{num(p)}</span>
                <span className="iName" role="cell">{p.name}</span>
                <span className="hideM" role="cell">{p.client}</span>
                <span className="hideT hideM" role="cell">{disciplineLabel(p)}</span>
                <span className="num hideM" role="cell">{p.year}</span>
                <span className="iArw"><Arrow /></span>
              </Case>
            ))}
          </div>
        )}
      </section>

      <section className="close" aria-label="Iniciar un proyecto">
        <Link to="/iniciar-proyecto">
          <span className="disp">¿El próximo es <span className="ser">el tuyo?</span></span>
          <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h56M46 2l10 10-10 10" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
        </Link>
      </section>
      <Footer />
      {gallery && showShots && (
        <div className="shotBox" role="dialog" aria-modal="true" aria-label={`Imágenes de ${detail.name}`}>
          <button type="button" className="shotClose" onClick={() => setGallery(false)}>Cerrar</button>
          <img src={shots[shot]} alt={`${detail.name}, imagen ${shot + 1} de ${shots.length}`} />
          <div className="shotNav">
            <button type="button" onClick={() => setShot((index) => (index - 1 + shots.length) % shots.length)} disabled={shots.length < 2}>Anterior</button>
            <span>{String(shot + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => setShot((index) => (index + 1) % shots.length)} disabled={shots.length < 2}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}
