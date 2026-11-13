import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { PRINCIPLES } from '../data.js';
import { TopRow } from '../components/Reveal.jsx';
import Footer from '../sections/Footer.jsx';
import Ribbon from '../components/Ribbon.jsx';
import { gsap, ScrollTrigger, useGsap } from '../lib/gsap.js';

const BASE = import.meta.env.BASE_URL;

const CAPS = [
  { t: 'Experiencias web', d: 'Sitios y landings con dirección de arte, motion y 3D. Hechos para comunicar y para convertir.', g: 'web' },
  { t: 'Agentes inteligentes', d: 'IA integrada a tu operación: agentes que responden, atienden y automatizan tareas repetitivas.', g: 'ai' },
  { t: 'Plataformas', d: 'CRM, dashboards, reservas e integraciones. Sistemas a medida que ordenan cómo trabaja tu negocio.', g: 'platform' },
  { t: 'Apps', d: 'Aplicaciones diseñadas y desarrolladas a medida, del primer boceto a la publicación.', g: 'app' },
  { t: 'E-commerce', d: 'Tiendas y catálogos digitales pensados para que comprar sea simple.', g: 'shop' },
  { t: 'Identidad', d: 'Marcas, sistemas visuales y dirección creativa para que todo lo anterior hable el mismo idioma.', g: 'brand' },
];

const MANIFESTO = 'Creemos que la tecnología tiene que sentirse simple. Por eso cada proyecto empieza por entender el negocio y termina en algo que la gente quiere usar: una web que comunica, una plataforma que ordena, una app que acompaña, un agente que trabaja por vos.';

function Glyph({ g }) {
  if (g === 'ai') return (
    <svg className="cg cgAi" viewBox="0 0 160 160" aria-hidden="true">
      {[[20, 30], [140, 30], [20, 130], [140, 130], [80, 14], [80, 146]].map(([x, y], i) => <g key={i}><line x1="80" y1="80" x2={x} y2={y} /><circle cx={x} cy={y} r="7" style={{ animationDelay: `${i * 0.25}s` }} /></g>)}
      <circle className="hot" cx="80" cy="80" r="16" />
    </svg>
  );
  if (g === 'platform') return (
    <svg className="cg cgBars" viewBox="0 0 160 160" aria-hidden="true">
      <rect x="4" y="4" width="152" height="152" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} className="b" x={20 + i * 26} y="40" width="16" height="100" style={{ animationDelay: `${i * 0.18}s` }} />)}
    </svg>
  );
  if (g === 'app') return (
    <svg className="cg cgApp" viewBox="0 0 160 160" aria-hidden="true">
      <rect x="45" y="6" width="70" height="148" rx="0" />
      <line x1="45" y1="28" x2="115" y2="28" />
      <rect className="hot s" x="55" y="40" width="50" height="34" />
      <rect className="s2" x="55" y="84" width="50" height="10" /><rect className="s2" x="55" y="102" width="34" height="10" />
    </svg>
  );
  if (g === 'shop') return (
    <svg className="cg cgGrid" viewBox="0 0 160 160" aria-hidden="true">
      {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} className={r === 1 && c === 1 ? 'hot' : ''} x={8 + c * 50} y={8 + r * 50} width="44" height="44" style={{ animationDelay: `${(r * 3 + c) * 0.12}s` }} />))}
    </svg>
  );
  if (g === 'brand') return (
    <svg className="cg cgBrand" viewBox="0 0 160 160" aria-hidden="true">
      <rect x="4" y="4" width="152" height="152" /><line x1="4" y1="80" x2="156" y2="80" /><line x1="80" y1="4" x2="80" y2="156" />
      <circle cx="80" cy="80" r="52" /><rect className="hot" x="68" y="68" width="24" height="24" />
    </svg>
  );
  return (
    <svg className="cg cgWeb" viewBox="0 0 160 160" aria-hidden="true">
      <rect x="4" y="16" width="152" height="128" /><line x1="4" y1="38" x2="156" y2="38" />
      <rect className="hot s" x="20" y="54" width="70" height="12" /><rect className="s2" x="20" y="76" width="110" height="8" /><rect className="s2" x="20" y="92" width="90" height="8" />
      <rect className="s3" x="20" y="112" width="40" height="18" />
    </svg>
  );
}

export default function About() {
  const root = useRef(null);
  const magnet = useRef(null);

  useGsap(() => {
    // 1 · Entrada única de la página: letras del titular desde abajo, ola de izquierda a derecha.
    gsap.from('.abChar', { yPercent: 110, rotate: 8, duration: 1.1, ease: 'expo.out', stagger: { each: 0.028, ease: 'power2.in' }, delay: 0.15 });
    gsap.from('.abHeroMeta > *', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.7 });

    // Las líneas del titular se separan con el scroll y se inclinan según la velocidad.
    gsap.utils.toArray('.abHl').forEach((el, i) => {
      gsap.to(el, { xPercent: i % 2 ? 10 : -10, ease: 'none', scrollTrigger: { trigger: '.abHero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    const skew = gsap.quickTo('.abHero h1', 'skewY', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({ trigger: '.abHero', start: 'top bottom', end: 'bottom top', onUpdate: (s) => skew(gsap.utils.clamp(-5, 5, s.getVelocity() / -400)) });

    // Contador de años
    const yr = { v: 0 };
    gsap.to(yr, { v: 3, duration: 1.6, ease: 'expo.out', delay: 0.9, onUpdate: () => { const el = document.querySelector('.abYears b'); if (el) el.textContent = `+${Math.round(yr.v)}`; } });

    // 2 · Zoom de máscara: un recorte chico se abre a pantalla completa y gira el isotipo.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 701px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.abZoom', start: 'top top', end: '+=140%', scrub: 0.6, pin: true, anticipatePin: 1 } });
      tl.fromTo('.abZoomPanel', { clipPath: 'inset(32% 36% 32% 36%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 })
        .fromTo('.abZoomLogo', { scale: 0.55, rotate: -30 }, { scale: 1, rotate: 0, ease: 'power2.out', duration: 1 }, 0)
        .from('.abZoomTxt .zl', { yPercent: 110, stagger: 0.12, duration: 0.5, ease: 'expo.out' }, 0.65);

      // 4 · Capacidades: la pista horizontal avanza con el scroll vertical.
      const track = document.querySelector('.capTrack');
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.abCaps', start: 'top top', end: () => `+=${dist()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => {
            gsap.set('.capBar i', { scaleX: s.progress });
            const n = Math.min(CAPS.length, Math.floor(s.progress * CAPS.length) + 1);
            const c = document.querySelector('.capCount'); if (c) c.textContent = `0${n} / 0${CAPS.length}`;
          },
        },
      });
    });

    // 3 · Manifiesto: cada palabra se enciende al leerla.
    gsap.fromTo('.mw', { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '.abManifesto', start: 'top 75%', end: 'bottom 45%', scrub: true } });

    // 6 · Principios apilados: cada bloque se fija y el anterior se hunde.
    gsap.utils.toArray('.stackCard').forEach((card, i, all) => {
      if (i === all.length - 1) return;
      gsap.to(card, { scale: 0.92, filter: 'brightness(0.72)', ease: 'none', scrollTrigger: { trigger: all[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } });
    });

    // 7 · Botón magnético del cierre.
    const area = document.querySelector('.abEnd');
    const xTo = gsap.quickTo(magnet.current, 'x', { duration: 0.6, ease: 'expo.out' });
    const yTo = gsap.quickTo(magnet.current, 'y', { duration: 0.6, ease: 'expo.out' });
    const move = (e) => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const r = magnet.current.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const leave = () => { xTo(0); yTo(0); };
    area.addEventListener('pointermove', move); area.addEventListener('pointerleave', leave);
    return () => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave); };
  });

  const chars = (text) => text.split('').map((c, i) => <span className="abCw" key={i}><span className="abChar">{c === ' ' ? ' ' : c}</span></span>);

  return (
    <div className="ab" ref={root}>
      {/* HERO */}
      <header className="abHero wrap">
        <TopRow left="Sobre nosotros / Orivon Studio" right="Estudio digital independiente · Argentina" />
        <h1 className="disp abH1" aria-label="Somos Orivon. Construimos experiencias.">
          <span className="abHl" aria-hidden="true">{chars('Somos Orivon.')}</span>
          <span className="abHl abHlS ser" aria-hidden="true">{chars('construimos')}</span>
          <span className="abHl" aria-hidden="true">{chars('experiencias.')}</span>
        </h1>
        <div className="abHeroMeta">
          <p className="abYears"><b>+3</b><span>años creando experiencias digitales</span></p>
          <p className="abLead">Diseñamos y desarrollamos experiencias web, plataformas a medida, apps y agentes inteligentes para marcas que quieren diferenciarse y crecer.</p>
          <p className="abScroll lab"><i aria-hidden="true" />Scrolleá</p>
        </div>
      </header>

      {/* ZOOM */}
      <section className="abZoom" aria-label="Una marca, un equipo, todo el proceso">
        <div className="abZoomPanel">
          <img className="abZoomLogo" src={`${BASE}orivon-icon.webp`} alt="" width="720" height="758" />
          <p className="abZoomTxt disp">
            <span className="mask"><span className="zl">Una marca.</span></span>
            <span className="mask"><span className="zl">Un equipo.</span></span>
            <span className="mask"><span className="zl ser">todo el proceso.</span></span>
          </p>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section className="abManifesto wrap" aria-label="Cómo pensamos">
        <TopRow left="01 / Cómo pensamos" right="Diseño + tecnología" />
        <p className="abMani">{MANIFESTO.split(' ').map((w, i) => <span className="mw" key={i}>{w} </span>)}</p>
      </section>

      {/* CAPACIDADES */}
      <section className="abCaps" aria-labelledby="caps-title">
        <div className="capHead wrap">
          <p className="lab" id="caps-title">02 / Lo que construimos</p>
          <p className="lab num capCount">01 / 0{CAPS.length}</p>
        </div>
        <div className="capTrack">
          <div className="capIntro">
            <p className="disp">De la idea<br />al <span className="ser">producto.</span></p>
            <p>Seis formas de llevar un negocio a lo digital, hechas por el mismo equipo.</p>
          </div>
          {CAPS.map((c, i) => (
            <article className="cap" key={c.t}>
              <span className="capN">0{i + 1}</span>
              <Glyph g={c.g} />
              <h3 className="disp">{c.t}</h3>
              <p>{c.d}</p>
            </article>
          ))}
        </div>
        <div className="capBar wrap" aria-hidden="true"><i /></div>
      </section>

      {/* MARQUESINA */}
      <div className="abMarquee" aria-hidden="true">
        <Ribbon tone="orange" items={CAPS.map((c) => c.t)} speed={24} className="rbBig" />
      </div>

      {/* PRINCIPIOS APILADOS */}
      <section className="abStack wrap" aria-labelledby="pr-title">
        <TopRow left="03 / Principios" right="Cómo decidimos" />
        <h2 className="sr" id="pr-title">Principios</h2>
        <div className="stackList">
          {PRINCIPLES.map((p, i) => (
            <article className={`stackCard sc${i}`} key={p.name} style={{ top: `${96 + i * 28}px` }}>
              <span className="scN">0{i + 1}</span>
              <h3 className="disp">{p.name}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CIERRE MAGNÉTICO */}
      <section className="abEnd" aria-label="Iniciar un proyecto">
        <p className="disp abEndH">¿Trabajamos <span className="ser">juntos?</span></p>
        <Link ref={magnet} className="magnet" to="/iniciar-proyecto">Iniciar un proyecto <FiArrowRight aria-hidden="true" /></Link>
      </section>
      <Footer />
    </div>
  );
}
