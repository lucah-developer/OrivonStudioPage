import { useRef, useState } from 'react';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { TESTIMONIALS } from '../data.js';
import { TopRow, Line } from '../components/Reveal.jsx';
import { gsap, useGsap } from '../lib/gsap.js';

function Quote({ t, on }) {
  return (
    <figure className={clsx('q', on && 'on')}>
      <blockquote className="qt" aria-label={t.text}>
        {t.text.split(' ').map((w, i) => (
          <span className="w" key={i} aria-hidden="true"><span style={{ animationDelay: `${Math.round(38 * Math.sqrt(i) * 3)}ms` }}>{w}</span></span>
        ))}
      </blockquote>
      <figcaption className="who">
        <span className={clsx('avatar', t.mark && 'avatarMark')} aria-hidden="true">{t.logo ? <img src={t.logo} alt="" loading="lazy" /> : 'FOTO'}</span>
        <p>
          {t.href ? <a href={t.href} target="_blank" rel="noreferrer">{t.person}</a> : t.person}
          <small>{t.role}</small>
        </p>
      </figcaption>
    </figure>
  );
}

export default function Voices() {
  const pin = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const st = useRef(null);
  const [q, setQ] = useState(0);
  const n = TESTIMONIALS.length;

  // Desktop: la sección se fija y el scroll vertical mueve la pista horizontal 1:1.
  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      // Pasos con pausas de lectura: cada cita se queda quieta un tramo y luego la pista se desplaza.
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: pin.current, start: 'top top', end: () => `+=${window.innerHeight * 0.74 * n}`,
          pin: true, scrub: 0.5, anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(bar.current, { scaleX: self.progress });
            const i = Math.min(n - 1, Math.floor(self.progress * n));
            setQ((prev) => (prev === i ? prev : i));
          },
        },
      });
      for (let i = 1; i < n; i += 1) tl.to({}, { duration: 0.6 }).to(track.current, { xPercent: (-100 * i) / n, duration: 1 });
      tl.to({}, { duration: 0.6 });
      const tween = tl;
      st.current = tween.scrollTrigger;
    });
  });

  const jump = (i) => {
    setQ(i);
    const s = st.current;
    if (s) window.scrollTo({ top: s.start + (s.end - s.start) * ((i * 1.6 + 0.3) / (0.6 * n + (n - 1))), behavior: 'smooth' });
  };

  return (
    <section className="tsS" id="opiniones" aria-labelledby="ts-title">
      <div className="tsPin" ref={pin}>
        <div className="wrap">
          <TopRow left="Voices / 07" right="Lo que dicen nuestros clientes" />
          <div className="tsGrid">
            <div className="tsL">
              <h2 className="disp tsH" id="ts-title">
                <Line i={0}>En sus</Line>
                <Line i={1}><span className="ser">palabras.</span></Line>
              </h2>
              <div className="tsNav" role="tablist" aria-label="Ir a un testimonio" data-aos="o-blur">
                {TESTIMONIALS.map((t, i) => (
                  <button key={i} className={clsx('tsBtn', i === q && 'on')} type="button" role="tab" aria-selected={i === q} onClick={() => jump(i)}>
                    <span className="num">0{i + 1}</span>
                    <span><b>{t.client}</b><small>{t.project}</small></span>
                  </button>
                ))}
              </div>
              <p className="tsHint lab"><i aria-hidden="true" />Seguí scrolleando para leer</p>
            </div>

            <div className="tsR">
              <p className="qmark" aria-hidden="true">“</p>
              <div className="tsView desk" aria-live="polite">
                <div className="track" ref={track} style={{ width: `${n * 100}%` }}>
                  {TESTIMONIALS.map((t, i) => <Quote key={i} t={t} on={i === q} />)}
                </div>
              </div>
              <div className="tsFoot desk" aria-hidden="true">
                <p className="lab num">0{q + 1} / 0{n}</p>
                <div className="tsBar"><i ref={bar} /></div>
              </div>
              {/* Mobile: deslizable con Swiper, sin fijar la sección. */}
              <Swiper className="tsSwiper mob" modules={[Pagination, A11y]} spaceBetween={24} slidesPerView={1.06} pagination={{ clickable: true }} onSlideChange={(sw) => setQ(sw.activeIndex)}>
                {TESTIMONIALS.map((t, i) => <SwiperSlide key={i}><Quote t={t} on={i === q} /></SwiperSlide>)}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
