import clsx from 'clsx';
import { FiCheck, FiShoppingBag, FiSend } from 'react-icons/fi';

/**
 * Mini interfaces animadas, una por servicio. Se usan en el Hero y en /servicios.
 * Las animaciones arrancan cuando el contenedor tiene la clase "on" (así se reinician al cambiar de servicio).
 * Todo es HTML + CSS: liviano, nítido y sin imágenes.
 */
function Web() {
  return (
    <div className="svBrowser">
      <div className="svBar"><i /><i /><i /><span>orivon.studio</span></div>
      <div className="svPage">
        <span className="svA svH" />
        <span className="svA svH2" />
        <span className="svA svImg" />
        <div className="svA svRow"><span /><span /><span /></div>
        <span className="svA svBtn" />
      </div>
    </div>
  );
}

function Shop() {
  return (
    <div className="svShop">
      <div className="svShopTop"><b>Tienda</b><span className="svCart"><FiShoppingBag aria-hidden="true" /><em>3</em></span></div>
      <div className="svProducts">
        {[0, 1, 2].map((i) => (
          <div className="svProd" key={i} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
            <span className="svPimg" /><span className="svPline" /><span className="svPprice" />
            <span className="svAdd">+</span>
          </div>
        ))}
      </div>
      <div className="svCheckout">
        <span className="svPay">Pagar</span>
        <span className="svChip">Mercado Pago</span>
        <span className="svChip">Stripe</span>
        <span className="svChip svWsp">Pedido por WhatsApp</span>
      </div>
    </div>
  );
}

function Ai() {
  return (
    <div className="svChat">
      <div className="svMsg svUser">¿Tienen turno para el jueves?</div>
      <div className="svMsg svBot svTyping"><i /><i /><i /></div>
      <div className="svMsg svBot svAnswer">Sí, hay 10:30 y 16:00. ¿Te reservo uno?</div>
      <div className="svDone"><FiCheck aria-hidden="true" /> Turno reservado y agenda actualizada</div>
      <div className="svInput"><span>Escribí un mensaje</span><FiSend aria-hidden="true" /></div>
    </div>
  );
}

function Platform() {
  return (
    <div className="svDash">
      <div className="svKpis">
        <div><small>Clientes</small><b /></div>
        <div><small>Reservas</small><b /></div>
        <div className="hot"><small>Hoy</small><b /></div>
      </div>
      <div className="svChart">
        {[46, 70, 38, 82, 58, 92, 66].map((h, i) => <span key={i} style={{ '--h': `${h}%`, animationDelay: `${0.1 + i * 0.07}s` }} />)}
      </div>
      <div className="svTable">{[0, 1, 2].map((i) => <div key={i} style={{ animationDelay: `${0.6 + i * 0.1}s` }}><span /><span /><em /></div>)}</div>
    </div>
  );
}

function Brand({ icon }) {
  return (
    <div className="svBrand">
      <div className="svGrid">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <rect x="1" y="1" width="198" height="198" /><line x1="100" y1="0" x2="100" y2="200" /><line x1="0" y1="100" x2="200" y2="100" />
          <circle className="svC1" cx="100" cy="100" r="78" /><circle className="svC2" cx="100" cy="100" r="40" />
        </svg>
        {icon && <img src={icon} alt="" />}
      </div>
      <div className="svSwatches"><i style={{ background: '#0B2C4A' }} /><i style={{ background: '#FF9A2A' }} /><i style={{ background: '#00A78E' }} /><i style={{ background: '#7C3AED' }} /><i style={{ background: '#FAF2E8' }} /></div>
      <div className="svType"><b>Aa</b><span>Archivo · Instrument Serif · Manrope</span></div>
    </div>
  );
}

export default function ServiceVisual({ id, on = true, className }) {
  const icon = `${import.meta.env.BASE_URL}orivon-icon-sm.png`;
  return (
    <div className={clsx('sv', `sv-${id}`, on && 'on', className)} aria-hidden="true">
      {id === 'web' && <Web />}
      {id === 'shop' && <Shop />}
      {id === 'ai' && <Ai />}
      {id === 'platform' && <Platform />}
      {id === 'brand' && <Brand icon={icon} />}
    </div>
  );
}
