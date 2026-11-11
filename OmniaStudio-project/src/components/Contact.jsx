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
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="section-head">
          <h2>Contacto.</h2>
          <p className="kicker">Presupuesto</p>
        </div>
        <p>Contanos el proyecto. Respondemos con una propuesta a medida.</p>

        <form onSubmit={handleSubmit} noValidate>
          {status && (
            <div className={`alert wide ${status.type === "success" ? "alert--ok" : "alert--bad"}`} role="alert">
              {status.text}
            </div>
          )}

          <label>
            Nombre y apellido *
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email *
            <input name="email" value={form.email} onChange={handleChange} type="email" required />
          </label>
          <label>
            Empresa / Proyecto
            <input name="company" value={form.company} onChange={handleChange} />
          </label>
          <label>
            Tipo de proyecto *
            <select name="projectType" value={form.projectType} onChange={handleChange} required>
              <option value="">Seleccioná...</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="wide">
            Mensaje / Brief
            <textarea name="message" value={form.message} onChange={handleChange} rows={5} />
          </label>
          <div className="contact__actions wide">
            <button className="btn btn--night" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>
            <a className="btn" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
