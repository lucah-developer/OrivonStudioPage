import { CONTACT } from '../data.js';

/** Arma el mensaje de WhatsApp con lo que cargó la persona en el formulario. */
export function whatsappContactUrl(values) {
  const text = [
    'Hola, quiero iniciar un proyecto.',
    `Nombre: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Qué necesito: ${values.type}`,
    '',
    values.msg.trim(),
  ].join('\n');
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function openWhatsappContact(values) {
  const url = whatsappContactUrl(values);
  return window.open(url, '_blank', 'noopener,noreferrer');
}
