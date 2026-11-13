import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopRow } from '../components/Reveal.jsx';
import { gsap, useGsap } from '../lib/gsap.js';

export default function Cta() {
  const root = useRef(null);
  // Las cuatro líneas convergen en horizontal con el scroll: impares desde la izquierda, pares desde la derecha.
  useGsap(() => {
    gsap.utils.toArray('.ctaLine').forEach((el, i) => {
      gsap.fromTo(el, { xPercent: i % 2 ? 14 : -14, opacity: 0.25 }, {
        xPercent: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: true },
      });
    });
  });
  return (
    <section className="ctaS" ref={root} aria-labelledby="cta-title">
      <div className="wrap">
        <TopRow left="08 / Let’s build something meaningful" right="Una invitación a comenzar" />
        <h2 className="disp ctaH" id="cta-title">
          <span className="ctaLine">¿Tenés una</span>
          <span className="ctaLine l2">idea?</span>
          <span className="ctaLine">Hagámosla</span>
          <span className="ctaLine l4"><span className="ser">realidad.</span></span>
        </h2>
        <p className="ctaP" data-aos="o-blur">Contanos qué querés construir. Una marca, un sitio, una plataforma o un proceso para automatizar: empezamos por una conversación.</p>
      </div>
      <Link className="ctaBtn" to="/iniciar-proyecto">
        <span>Iniciar un proyecto</span>
        <svg viewBox="0 0 60 24" aria-hidden="true"><path d="M0 12h56M46 2l10 10-10 10" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
      </Link>
    </section>
  );
}
