import logo from "../../assets/LogoApaisado.svg";

export default function SiteFooter() {
  return (
    <footer className="studio">
      <div className="site-footer wrap">
        <div>
          <img src={logo} alt="Orivon Studio" />
          <p>Diseño, desarrollo y dirección para marcas que necesitan una presencia clara.</p>
        </div>
        <nav aria-label="Pie">
          <a href="/#work">Work</a>
          <a href="/#services">Services</a>
          <a href="/#studio">Studio</a>
          <a href="/portfolio">Portfolio</a>
        </nav>
        <div className="reach">
          <a href="mailto:orivonstudio2022@gmail.com">orivonstudio2022@gmail.com</a>
          <a href="https://wa.me/5492604309716" target="_blank" rel="noopener noreferrer">
            +54 9 260 4309716
          </a>
          <a href="https://www.instagram.com/orivonstudio/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <small>© {new Date().getFullYear()} Orivon Studio</small>
        </div>
      </div>
    </footer>
  );
}
