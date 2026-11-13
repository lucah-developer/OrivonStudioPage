import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { PRINCIPLES } from '../data.js';
import { Link } from 'react-router-dom';
import { TopRow, Line, Arrow } from '../components/Reveal.jsx';
import { gsap, ScrollTrigger, useGsap, reducedMotion } from '../lib/gsap.js';

const WORD = 'DEL CAOS';
// Desplazamiento de cada letra en caos máximo: x, y (em), rotación (deg), ancho (wdth de Anybody).
const OFFS = [[-0.42, 0.28, -14, -40], [0.18, -0.36, 9, 30], [-0.12, 0.44, -6, -25], [0, 0, 0, 0], [0.36, -0.18, 18, 45], [-0.3, -0.4, -11, -35], [0.4, 0.32, 12, 20], [-0.22, -0.3, -20, -45]];

export default function Studio() {
  const word = useRef(null);
  const scroll = useRef(reducedMotion() ? 0 : 1.4);
  const [nz, setNz] = useState(0);
  const nzRef = useRef(0);

  // Escribe transform directamente en cada letra (nada de variables CSS heredadas).
  const apply = useCallback((duration) => {
    const el = word.current;
    if (!el) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    const k = scroll.current + nzRef.current * 0.12;
    el.querySelectorAll('.nl').forEach((l, i) => {
      const [x, y, r, w] = OFFS[i];
      gsap.to(l, {
        x: x * fs * k, y: y * fs * k, rotate: r * k,
        fontVariationSettings: `'wdth' ${Math.max(50, Math.min(150, 128 + w * k))}`,
        duration, ease: 'expo.out', overwrite: 'auto',
      });
    });
  }, []);

  useGsap(() => {
    apply(0);
    ScrollTrigger.create({
      trigger: word.current, start: 'top bottom', end: 'top 30%', scrub: true,
      onUpdate: (self) => { scroll.current = 1.4 * (1 - self.progress); apply(0.4); },
    });
  });

  const setLevel = (v) => { nzRef.current = v; setNz(v); apply(0.7); };
  const txt = nz === 0 ? 'Caos 0% · Claridad 100%' : `Caos ${nz * 10}%`;

  return (
    <section className="stS" id="estudio" aria-labelledby="st-title">
      <div className="wrap">
        <TopRow left="Studio / 06" right="Quiénes somos y cómo pensamos" />
        <h2 className="disp stH1" id="st-title" aria-label="Del caos a la claridad.">
          <span className="noise" ref={word} aria-hidden="true">
            {WORD.split('').map((c, i) => <span key={i} className={clsx('nl', c === ' ' && 'sp')}>{c === ' ' ? ' ' : c}</span>)}
          </span>
          <Line i={1} className="stLine2"><span className="ser" aria-hidden="true">a la claridad.</span></Line>
        </h2>
        <div className="nzCtl" data-aos="o-blur">
          <label className="lab" htmlFor="nz-range">Nivel de caos</label>
          <input id="nz-range" type="range" min="0" max="10" step="1" value={nz} onChange={(e) => setLevel(Number(e.target.value))} aria-valuetext={txt} />
          <output className="lab num" htmlFor="nz-range">{txt}</output>
          <button className="nzBtn" type="button" onClick={() => setLevel(0)}>Ordenar</button>
        </div>

        <div className="stGrid">
          <div className="stBlock" data-aos="o-clip">
            <p className="lab muted">Declaración</p>
            <blockquote data-aos="o-blur" data-aos-delay="250">Orivon combina creatividad, diseño y desarrollo tecnológico para construir soluciones digitales <em>con propósito.</em></blockquote>
            <div className="dots" aria-hidden="true"><i className="bgO" /><i className="bgT" /><i className="bgV" /></div>
          </div>
          <div className="stCols">
            <div className="stCol" data-aos="o-blur">
              <h4>El estudio</h4>
              <p>Somos un estudio digital independiente. Trabajamos de punta a punta: desde la identidad de una marca hasta el sistema que la hace funcionar.</p>
            </div>
            <div className="stCol" data-aos="o-blur" data-aos-delay="100">
              <h4>Nuestro enfoque</h4>
              <p>Antes de agregar, quitamos. Cada proyecto empieza por entender qué es esencial y termina cuando todo lo que queda tiene una razón de estar.</p>
            </div>
            <div className="dxt" data-aos="o-blur" data-aos-delay="180">
              <div>
                <h4>Diseño × Tecnología</h4>
                <p>No son dos departamentos. El diseño define cómo se siente un producto; la tecnología, cómo responde. Orivon trabaja en la intersección.</p>
              </div>
              <svg viewBox="0 0 300 160" role="img" aria-label="Diagrama: diseño y tecnología se superponen; Orivon está en la intersección">
                <rect x="10" y="20" width="170" height="120" /><rect x="120" y="20" width="170" height="120" />
                <rect className="mid" x="120" y="20" width="60" height="120" />
                <text x="22" y="40">DISEÑO</text><text x="278" y="40" textAnchor="end">TECNOLOGÍA</text>
                <text className="wt" x="150" y="84" textAnchor="middle">ORI</text><text className="wt" x="150" y="98" textAnchor="middle">VON</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="stMore" data-aos="o-blur">
          <p>Conocé cómo pensamos, qué hacemos y cómo trabajamos.</p>
          <Link className="lnkBig" to="/estudio">Sobre nosotros <Arrow /></Link>
        </div>

        <div className="prin">
          {PRINCIPLES.map((p, i) => (
            <div className="pr" key={p.name} data-aos="o-blur" data-aos-delay={[0, 80, 140, 180][i]}>
              <span className="num">0{i + 1}</span><h5>{p.name}</h5><p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
