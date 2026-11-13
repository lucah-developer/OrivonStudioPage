import { useState } from 'react';
import clsx from 'clsx';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { CONTACT, SERVICES } from '../data.js';
import { sendContact } from '../lib/contact.js';

const TYPES = [...SERVICES.map((s) => ({ id: s.id, label: s.short })), { id: 'other', label: 'Otro' }];
const labelOf = (id) => TYPES.find((t) => t.id === id)?.label ?? '';
const EMPTY = (type) => ({ type, name: '', email: '', msg: '' });

function validate(f) {
  const e = {};
  if (!f.type) e.type = 'Elegí una opción.';
  if (!f.name.trim()) e.name = 'Escribí tu nombre.';
  if (!f.email.trim()) e.email = 'Escribí tu email para poder responderte.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Revisá el email: parece que falta algo.';
  if (f.msg.trim().length < 10) e.msg = 'Contanos tu idea en una o dos frases.';
  return e;
}

/**
 * Formulario de proyecto (sección Contacto y /iniciar-proyecto).
 * Cuatro preguntas, todas necesarias: qué necesitás, nombre, email y la idea.
 */
export default function ProjectForm({ initialType = '', onTypeChange }) {
  const [f, setF] = useState(EMPTY(initialType));
  const [err, setErr] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed

  const set = (k) => (e) => {
    const v = typeof e === 'string' ? e : e.target.value;
    setF((p) => ({ ...p, [k]: v }));
    setErr((p) => { const n = { ...p }; delete n[k]; return n; });
    if (k === 'type') onTypeChange?.(v);
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate(f);
    setErr(v);
    if (Object.keys(v).length) {
      document.getElementById(`c-${Object.keys(v)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      await sendContact({ ...f, type: labelOf(f.type) });
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'sent') {
    return (
      <div className="ok" role="status">
        <div className="okMark" aria-hidden="true"><FiCheck size={28} /></div>
        <p className="disp">Mensaje <span className="ser">enviado.</span></p>
        <p>Gracias, {f.name}. Te respondemos a {f.email}.</p>
        <button className="lnk" type="button" onClick={() => { setF(EMPTY(initialType)); setStatus('idle'); onTypeChange?.(initialType); }}>Escribir otro mensaje</button>
      </div>
    );
  }

  const aria = (k) => ({ 'aria-invalid': err[k] ? true : undefined, 'aria-describedby': err[k] ? `c-${k}-e` : undefined });

  return (
    <form className="form" noValidate onSubmit={submit} aria-label="Contanos tu proyecto">
      {status === 'failed' && <p className="sum" role="alert">No se pudo enviar. Probá de nuevo o escribinos a {CONTACT.email}.</p>}

      <fieldset className={clsx('fld', err.type && 'bad')}>
        <legend className="q">¿Qué necesitás?</legend>
        <div className="chips" id="c-type" tabIndex={-1}>
          {TYPES.map((t) => (
            <button key={t.id} type="button" className={clsx('chip', f.type === t.id && 'sel')} aria-pressed={f.type === t.id} onClick={() => set('type')(t.id)}>{t.label}</button>
          ))}
        </div>
        {err.type && <p className="err" id="c-type-e">{err.type}</p>}
      </fieldset>

      <div className="f2">
        <div className={clsx('fld', err.name && 'bad')}>
          <label className="q" htmlFor="c-name">Tu nombre</label>
          <input id="c-name" autoComplete="name" value={f.name} onChange={set('name')} {...aria('name')} />
          <span className="fbar" />
          {err.name && <p className="err" id="c-name-e">{err.name}</p>}
        </div>
        <div className={clsx('fld', err.email && 'bad')}>
          <label className="q" htmlFor="c-email">Tu email</label>
          <input id="c-email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set('email')} {...aria('email')} />
          <span className="fbar" />
          {err.email && <p className="err" id="c-email-e">{err.email}</p>}
        </div>
      </div>

      <div className={clsx('fld', err.msg && 'bad')}>
        <label className="q" htmlFor="c-msg">Tu idea</label>
        <p className="hint" id="c-msg-h">Qué querés lograr y, si lo sabés, para cuándo.</p>
        <textarea id="c-msg" rows={4} value={f.msg} onChange={set('msg')} aria-invalid={err.msg ? true : undefined} aria-describedby={err.msg ? 'c-msg-h c-msg-e' : 'c-msg-h'} />
        <span className="fbar" />
        {err.msg && <p className="err" id="c-msg-e">{err.msg}</p>}
      </div>

      <div className="send">
        <small>Solo usamos tus datos para responderte.</small>
        <button className="sbtn" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Enviando' : 'Enviar'} <FiArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
