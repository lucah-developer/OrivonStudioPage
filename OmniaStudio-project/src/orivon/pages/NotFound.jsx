import { Link } from "react-router-dom";
import Footer from "../sections/Footer.jsx";

export default function NotFound() {
  return (
    <div className="pj">
      <header className="pjHd">
        <div className="wrap">
          <h1 className="disp pjH1">Esta página no existe.</h1>
          <p className="pjLead">
            La dirección no está en el sitio. <Link to="/">Volver al inicio</Link>
            {" · "}
            <Link to="/proyectos">Ver proyectos</Link>
          </p>
        </div>
      </header>
      <Footer />
    </div>
  );
}
