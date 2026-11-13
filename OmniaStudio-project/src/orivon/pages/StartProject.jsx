import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONTACT, serviceById } from '../data.js';
import { TopRow, Line } from '../components/Reveal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import Footer from '../sections/Footer.jsx';

/** /iniciar-proyecto?servicio=web — el servicio clickeado llega preseleccionado. */
export default function StartProject() {
  const [params] = useSearchParams();
  const fromUrl = params.get('servicio');
  const initial = fromUrl && (serviceById[fromUrl] || fromUrl === 'other') ? fromUrl : '';
  const [type, setType] = useState(initial);
  const svc = serviceById[type];

  return (
    <div className="sp">
      <header className="wrap spHd">
        <TopRow left="Iniciar proyecto" right="Te respondemos por email" />
        <h1 className="disp spH1">
          <Line i={0}>Contanos</Line>
          <Line i={1}><span className="ser">tu idea.</span></Line>
        </h1>
      </header>

      <div className="wrap spGrid">
        <aside className="spAside" aria-live="polite">
          <div className="spCard" key={type || 'none'}>
            <p className="lab muted">{svc ? 'Elegiste' : 'Paso 1'}</p>
            <p className="spSvc">{svc ? svc.name : type === 'other' ? 'Otro proyecto' : 'Elegí qué necesitás'}</p>
            <p className="spDesc">{svc ? svc.desc : 'Podés cambiarlo cuando quieras. Si no encaja en ninguna opción, elegí “Otro”.'}</p>
          </div>
          <p className="spAlt">¿Preferís escribirnos directo? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
        </aside>
        <div className="spMain" data-aos="o-blur" data-aos-delay="200">
          <ProjectForm initialType={initial} onTypeChange={setType} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
