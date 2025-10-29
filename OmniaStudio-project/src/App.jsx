import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Process from "./components/Process";
import About from "./components/About";
import Contact from "./components/Contact";
import Portfolio from "./components/Portfolio";

export default function App() {
  return (
    <>
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
            </>
          }
        />
        <Route
          path="/portfolio"
          element={
            <>
              <Navbar />
              <Portfolio />
            </>
          }
        />
      </Routes>
    </>
  );
}
