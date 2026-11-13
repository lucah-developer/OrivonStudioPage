import { useRef } from 'react';
import clsx from 'clsx';
import { gsap, ScrollTrigger, useGsap } from '../lib/gsap.js';

/**
 * Cinta en movimiento continuo que reacciona a la velocidad y dirección del scroll.
 * - tone: 'navy' | 'orange' | 'cream'
 * - reverse: corre en sentido contrario
 * - tilt: inclinación en grados (para el cruce de cintas)
 */
export default function Ribbon({ items, tone = 'navy', reverse = false, tilt = 0, speed = 28, className }) {
  const track = useRef(null);
  const band = useRef(null);

  useGsap(() => {
    const loop = gsap.fromTo(track.current, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, ease: 'none', duration: speed, repeat: -1 });
    ScrollTrigger.create({
      trigger: band.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (s) => {
        const v = gsap.utils.clamp(-5, 5, s.getVelocity() / 260);
        const base = s.direction;
        gsap.to(loop, { timeScale: v || base, duration: 0.3, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: base, duration: 1.2 }) });
      },
    });
  }, [reverse, speed]);

  const row = (k) => (
    <span className="rbRow" key={k} aria-hidden={k > 0 ? 'true' : undefined}>
      {items.map((it) => (
        <span className="rbItem" key={`${k}-${it}`}>{it}<i aria-hidden="true" /></span>
      ))}
    </span>
  );

  return (
    <div ref={band} className={clsx('ribbon', `rb-${tone}`, className)} style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}>
      <div className="rbTrack" ref={track}>{[0, 1].map(row)}</div>
    </div>
  );
}
