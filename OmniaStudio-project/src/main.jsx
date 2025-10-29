import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import AOS from "aos";
// import "aos/dist/aos.css";

AOS.init({ duration: 700, once: true }); // configurá como prefieras

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
