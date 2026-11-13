import emailjs from '@emailjs/browser';

// Misma integración de EmailJS que ya usaba el sitio (IDs, template y nombres de campos).
const SERVICE_ID = 'service_r5sxqkl';
const TEMPLATE_ID = 'template_2bmx2jv';
const PUBLIC_KEY = 'd7XuVC7rlvoQ-olEC';

export async function sendContact(values) {
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    name: values.name,
    email: values.email,
    company: '',
    projectType: values.type,
    budget: '',
    message: values.msg,
  }, PUBLIC_KEY);
}
