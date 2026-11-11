// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { startSmoothScroll } from "./smoothScroll";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const openAtHero = () => {
  if (!location.hash) window.scrollTo(0, 0);
};

openAtHero();
window.addEventListener("pageshow", openAtHero);

AOS.init({ duration: 700, once: true });
startSmoothScroll();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
