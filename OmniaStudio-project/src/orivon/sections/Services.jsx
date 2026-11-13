import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../data.js';
import { TopRow, Line, Arrow } from '../components/Reveal.jsx';
import { gsap, useGsap } from '../lib/gsap.js';

const GLYPHS = [
  <><rect x="1" y="1" width="50" height="50" /><line x1="1" y1="26" x2="51" y2="26" /><line x1="26" y1="1" x2="26" y2="51" /><circle cx="26" cy="26" r="17" /><rect className="hot" x="22" y="22" width="8" height="8" /></>,
  <><rect x="1" y="5" width="50" height="42" /><line x1="1" y1="14" x2="51" y2="14" /><line x1="8" y1="24" x2="34" y2="24" /><line x1="8" y1="31" x2="26" y2="31" /><rect className="hot" x="8" y="37" width="12" height="4" /></>,
  <><rect x="1" y="1" width="22" height="22" /><rect x="29" y="1" width="22" height="14" /><rect x="29" y="21" width="22" height="30" /><rect x="1" y="29" width="22" height="22" /><rect className="hot" x="33" y="38" width="6" height="9" /><rect className="hot" x="41" y="31" width="6" height="16" /></>,
  <><rect x="1" y="1" width="14" height="14" /><rect x="19" y="1" width="14" height="14" /><rect x="37" y="1" width="14" height="14" /><rect x="1" y="19" width="14" height="14" /><rect className="hot" x="19" y="19" width="14" height="14" /><rect x="37" y="19" width="14" height="14" /><line x1="1" y1="44" x2="51" y2="44" /></>,
  <><circle cx="6" cy="8" r="4" /><circle cx="6" cy="44" r="4" /><circle cx="46" cy="8" r="4" /><circle cx="46" cy="44" r="4" /><line x1="9" y1="11" x2="22" y2="23" /><line x1="9" y1="41" x2="22" y2="29" /><line x1="43" y1="11" x2="30" y2="23" /><line x1="43" y1="41" x2="30" y2="29" /><circle className="hot" cx="26" cy="26" r="6" /></>,
];
const PATHS = ['M0 10 C 160 10, 220 85, 340 85', 'M0 47 C 160 47, 220 85, 340 85', 'M0 85 L 340 85', 'M0 123 C 160 123, 220 85, 340 85', 'M0 160 C 160 160, 220 85, 340 85'];

/** Nombre con "letter roll": cada letra rueda a su copia naranja con un retraso que se acorta (ola, no metrónomo). */
function RollName({ text }) {
  let k = 0;
  return (
    <span className="roll" aria-hidden="true">
      {text.split(' ').map((w, wi) => (
        <span className="wd" key={wi}>
          {w.split('').map((c, ci) => {
            const delay = Math.round(110 * Math.sqrt(k++));
            return (
              <span className="ch" key={ci}>
                <span style={{ transitionDelay: `${delay}ms` }}>{c}</span>
                <span style={{ transitionDelay: `${delay}ms` }}>{c}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export default function Services() {
  const root = useRef(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      // Momento firma: el plano navy se abre a todo el ancho al salir de Selected Work.
      gsap.fromTo(root.current, { clipPath: 'inset(0% 5% 0% 5%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 15%', scrub: true },
      });
    });
    // El diagrama de convergencia se dibuja línea por línea y aterriza el núcleo.
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.conv', start: 'top 85%', once: true } });
    tl.fromTo('.conv path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'expo.out', stagger: { each: 0.09, ease: 'power2.in' } })
      .fromTo('.conv .core', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.55');
  });

  return (
    <section className="svcS" id="servicios" ref={root} aria-labelledby="svc-title">
      <div className="wrap">
        <TopRow left="Services / 04" right="Qué podemos hacer" />
        <div className="svcHead">
          <h2 className="disp svcH1" id="svc-title">
            <Line i={0}>One studio.</Line>
            <Line i={1}>Multiple</Line>
            <Line i={2}><span className="ser">disciplines.</span></Line>
          </h2>
          <div className="svcAside">
            <svg className="conv" viewBox="0 0 380 170" aria-hidden="true">
              {PATHS.map((d, i) => <path key={i} className={`c${i + 1}`} d={d} pathLength="1" />)}
              <circle className="core" cx="352" cy="85" r="12" />
            </svg>
            <p data-aos="o-blur" data-aos-delay="200">Orivon combina diseño, desarrollo y tecnología en un mismo equipo. Cinco disciplinas que convergen en una sola solución digital, sin intermediarios entre la idea y el producto.</p>
          </div>
        </div>

        <div className="svcList">
          {SERVICES.map((s, i) => (
            <article key={s.id} className={`svc s${i + 1}`} data-aos="o-up" data-aos-delay={[0, 60, 110, 150, 180][i]}>
              <span className="num svcNum">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="svcName" aria-label={s.name}><RollName text={s.name} /></h3>
              <div className="svcBody">
                <p className="svcDesc">{s.desc}</p>
                <div className="svcMore"><div>
                  <svg className="glyph" viewBox="0 0 52 52" aria-hidden="true">{GLYPHS[i]}</svg>
                  <ul className="tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </div></div>
              </div>
              <Link className="go" to={`/iniciar-proyecto?servicio=${s.id}`} aria-label={`Iniciar un proyecto de ${s.name}`}><Arrow /></Link>
            </article>
          ))}
        </div>
        <div className="svcHint" data-aos="o-blur">
          <p className="lab">↳ Elegí una disciplina para iniciar tu proyecto</p>
          <p className="lab">Un solo equipo · De la identidad al producto</p>
        </div>
      </div>
    </section>
  );
}
