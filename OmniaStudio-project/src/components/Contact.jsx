import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_r5sxqkl";
const TEMPLATE_ID = "template_2bmx2jv";
const PUBLIC_KEY = "d7XuVC7rlvoQ-olEC";

const PROJECT_TYPES = [
  "Landing page",
  "E-commerce",
  "App personalizada",
  "CRM / Administración",
  "Redes / Branding",
  "Otro",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!form.name.trim() || !form.email.trim() || !form.projectType.trim()) {
      setStatus({
        type: "error",
        text: "Por favor completá los campos obligatorios.",
      });
      return false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setStatus({ type: "error", text: "Ingresá un correo válido." });
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const templateParams = {
        name: form.name,
        email: form.email,
        company: form.company,
        projectType: form.projectType,
        budget: form.budget,
        message: form.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setStatus({
        type: "success",
        text: "¡Gracias! Tu solicitud fue enviada. Te contactamos pronto.",
      });
      setForm({
        name: "",
        email: "",
        company: "",
        projectType: "",
        budget: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: "Ocurrió un error al enviar. Intentá de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Genera el link de WhatsApp con mensaje predefinido
  const whatsappLink = `https://wa.me/5492604309716?text=Hola!%20Me%20comunico%20desde%20Orivon%20Studio%20para%20solicitar%20un%20presupuesto%20de%20${encodeURIComponent(
    form.projectType || "un proyecto web"
  )}%20`;

  return (
    <section id="contact" className="relative py-20 bg-bg overflow-hidden">
      {/* Gradient sutil desde abajo hacia arriba */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        // style={{
        //   background:
        //     "linear-gradient(to top, rgba(124, 58, 237, 0.2), rgba(255, 154, 42, 0.2), rgba(250, 242, 232, 0))",
        //   zIndex: 0,
        // }}
      ></div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-8 z-10">
        <h2
          className="text-3xl font-heading font-bold text-center text-[var(--text-primary)] mb-6"
          data-aos="fade-up"
        >
          Solicitar presupuesto
        </h2>

        <p
          className="text-center text-gray-600 mb-8"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          Contanos brevemente tu proyecto y te respondemos con una propuesta a
          medida. También podés pedir paquetes o solicitar que incluyamos
          servicios complementarios (redes, branding, contratación de talento).
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--neutral-100)] p-6 rounded-2xl shadow-sm relative z-10"
          data-aos="fade-up"
          data-aos-delay="140"
          noValidate
        >
          {status && (
            <div
              className={`mb-4 px-4 py-3 rounded-md text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
              role="alert"
            >
              {status.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Nombre y apellido *</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)]/20"
                required
              />
            </label>

            {/* Email */}
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Email *</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="mt-2 px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)]/20"
                required
              />
            </label>

            {/* Empresa / Proyecto */}
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Empresa / Proyecto</span>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="mt-2 px-3 py-2 rounded-md border border-gray-200 bg-white"
              />
            </label>

            {/* Tipo de proyecto */}
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Tipo de proyecto *</span>
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                className="mt-2 px-3 py-2 rounded-md border border-gray-200 bg-white"
                required
              >
                <option value="">Seleccioná...</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            {/* Mensaje */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm text-gray-600">Mensaje / Brief</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="mt-2 px-3 py-2 rounded-md border border-gray-200 bg-white"
              />
            </label>
          </div>

          {/* Botones */}
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-sm transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{ background: "var(--accent-1)" }}
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-500 text-white font-semibold shadow-sm transition hover:bg-green-600"
            >
              📱 Contactar por WhatsApp
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
