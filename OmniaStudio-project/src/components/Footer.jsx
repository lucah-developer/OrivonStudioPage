import logo from "../assets/LogoApaisado.svg";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-bg via-accent-2/35 to-accent-1/30 overflow-hidden">
      {/* Gradient de transición desde el contact hacia el footer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700">
        {/* Logo y descripción */}
        <div className="flex flex-col gap-3">
          <img src={logo} className="h-full " />
          <p className="text-gray-600">
            Desarrollo de sitios web modernos y aplicaciones personalizadas, con
            diseño atractivo y funcionalidad completa.
          </p>
        </div>

        {/* Links internos */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-[var(--text-primary)]">
            Secciones
          </h4>
          <a
            href="#contact"
            className="hover:text-[var(--accent-1)] transition"
          >
            Contacto
          </a>
          <a
            href="#services"
            className="hover:text-[var(--accent-1)] transition"
          >
            Servicios
          </a>
          <a
            href="/portfolio"
            className="hover:text-[var(--accent-1)] transition"
          >
            Portfolio
          </a>
          <a href="#about" className="hover:text-[var(--accent-1)] transition">
            Nosotros
          </a>
        </div>

        {/* Contacto y redes */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-[var(--text-primary)]">Contacto</h4>
          <a
            href="mailto:info@orivonstudio.com"
            className="hover:text-[var(--accent-1)] transition"
          >
            orivonstudio2022@gmail.com
          </a>
          <a
            href="https://wa.me/5492604309716"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-1)] transition"
          >
            WhatsApp: +54 9 260 4309716
          </a>

          <div className="flex gap-4 mt-2">
            <a
              href="https://www.instagram.com/orivonstudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-1)] transition"
            >
              Instagram
            </a>
            {/* <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-1)] transition"
            >
              LinkedIn
            </a> */}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        © {new Date().getFullYear()} Orivon Studio. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
