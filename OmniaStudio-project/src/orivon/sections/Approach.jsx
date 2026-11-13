import { useState } from 'react';
import clsx from 'clsx';
import { STAGES } from '../data.js';
import { TopRow, Line } from '../components/Reveal.jsx';
import { ScrollTrigger, useGsap } from '../lib/gsap.js';

export default function Approach() {
  const [s, setS] = useState(0);

  // El scroll natural define la etapa activa (sin pin largo: el panel es sticky solo dentro de la sección).
  useGsap(() => {
    document.querySelectorAll('[data-stage]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => self.isActive && setS(Number(el.dataset.stage)),
      });
    });
  });

  const go = (i) => {
    setS(i);
    document.querySelector(`[data-stage="${i}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const seg = (i) => (i < s ? 'done' : i === s ? 'cur' : '');

  return (
    <section className="apS" id="metodo" aria-labelledby="ap-title">
      <div className="wrap">
        <TopRow left="Approach / 05" right="Cómo lo hacemos" />
        <div className="apHead">
          <h2 className="disp apH1" id="ap-title">
            <Line i={0}>From idea</Line>
            <Line i={1}>to <span className="ser">experience.</span></Line>
          </h2>
          <p className="apIntro" data-aos="o-blur" data-aos-delay="200">Un proceso en cinco etapas, con decisiones explícitas en cada paso. Sabés siempre en qué punto está tu proyecto y qué viene después.</p>
        </div>

        <div className="apGrid">
          <aside className="apPin" aria-hidden="true">
            <div className="apPinTop"><p className="lab">Etapa activa</p><p className="lab num">0{s + 1} / 05</p></div>
            <p className="apBig">
              <span>0</span>
              <span className="odo"><span style={{ transform: `translateY(${-s * 0.8}em)` }}>{STAGES.map((_, i) => <b key={i}>{i + 1}</b>)}</span></span>
              <small>/05</small>
            </p>
            <div className="apNow"><h3>{STAGES[s].name}</h3><p className="lab teal">{(s + 1) * 20}% del proceso</p></div>
            <div className="segs">{STAGES.map((_, i) => <i key={i} className={clsx('seg', seg(i))} />)}</div>
            <svg className="diag" viewBox="0 0 520 120">
              <line x1="20" y1="20" x2="500" y2="20" /><line x1="20" y1="100" x2="500" y2="100" />
              <line className="trk" x1="30" y1="60" x2="490" y2="60" />
              {[30, 145, 260, 375, 490].map((x, i) => (
                <g key={x}>
                  <line x1={x} y1="20" x2={x} y2="100" />
                  <circle className={seg(i)} cx={x} cy="60" r="8" />
                  <text x={x} y="14" textAnchor="middle">{STAGES[i].code}</text>
                </g>
              ))}
            </svg>
          </aside>

          <ol className="apList">
            <li className="apMob" aria-hidden="true">
              <p className="lab num">0{s + 1} / 05 — {STAGES[s].name}</p>
              <div className="segs">{STAGES.map((_, i) => <i key={i} className={clsx('seg', seg(i))} />)}</div>
            </li>
            {STAGES.map((st, i) => (
              <li key={st.name} className={clsx('stage', i === s && 'on')} data-stage={i}>
                <button className="stBtn" type="button" onClick={() => go(i)} aria-current={i === s ? 'step' : undefined}>
                  <span className="num">0{i + 1}</span><span className="disp">{st.name}</span>
                </button>
                <p data-aos="o-blur">{st.desc}</p>
                <div className="stMeta"><i /><span className="lab">{st.meta}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
