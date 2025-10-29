import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        {/* luego Services, Portfolio, Contact */}
      </main>
    </>
  );
}
