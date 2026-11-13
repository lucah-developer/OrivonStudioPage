import clsx from 'clsx';

/** Línea de titular revelada con máscara. Los pasos de 110 ms forman una ola, no una cola. */
export function Line({ children, i = 0, className }) {
  return (
    <span className={clsx('mask', className)}>
      <span data-aos="o-rise" data-aos-delay={i * 110}>{children}</span>
    </span>
  );
}

/** Fila superior de cada sección: la regla se dibuja y las etiquetas entran después. */
export function TopRow({ left, right, tone }) {
  return (
    <div className="toprow" data-aos="o-line" style={tone ? { color: tone } : undefined}>
      <p className="lab" data-aos="o-slide" data-aos-delay="150">{left}</p>
      {right && <p className="lab muted" data-aos="o-slide" data-aos-delay="260">{right}</p>}
    </div>
  );
}

export const Arrow = ({ size = 22, dir = 'right' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M2 11h17M12 4l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
