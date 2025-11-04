// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Process from "./components/Process";
import About from "./components/About";
import Contact from "./components/Contact";
import Portfolio from "./components/Portfolio";
import Footer from "./components/Footer";

export default function App() {
  return (
    // Wrapper principal: previene scroll horizontal inesperado
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Services />
              <Process />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* <- Ojo: quité el Navbar duplicado que tenías aquí */}
        <Route
          path="/portfolio"
          element={
            <>
              <Portfolio />
            </>
          }
        />
      </Routes>
    </div>
  );
}
