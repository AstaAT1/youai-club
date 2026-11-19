import emailjs from '@emailjs/browser';
import {
  FIELD_LIMITS, escapeHtml, normalizeParagraph, normalizeSingleLine, validateApplication,
} from './validation.js';

const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim(),
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim(),
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim(),
};

export const isEmailConfigured = Object.values(emailConfig).every(
  (value) => Boolean(value && !value.startsWith('your_'))
);

export async function sendApplication(form) {
  if (!isEmailConfigured) {
    throw new Error('EmailJS is not configured. Add your three EmailJS values to the .env file, then restart Vite.');
  }
  if (Object.keys(validateApplication(form)).length) {
    throw new Error('Please review your application fields.');
  }

  const safe = (text) => escapeHtml(text);
  return emailjs.send(
    emailConfig.serviceId,
    emailConfig.templateId,
    {
      full_name: safe(normalizeSingleLine(form.fullName, FIELD_LIMITS.fullName)),
      email: safe(normalizeSingleLine(form.email, FIELD_LIMITS.email)),
      reply_to: normalizeSingleLine(form.email, FIELD_LIMITS.email),
      has_background: form.background === 'yes' ? 'Yes' : 'No',
      background_level: form.background === 'yes' ? form.level : 'No previous background',
      background_details: form.background === 'yes' ? safe(normalizeSingleLine(form.experience, FIELD_LIMITS.experience) || 'Not provided') : 'Not applicable',
      motivation: safe(normalizeParagraph(form.motivation, FIELD_LIMITS.motivation)),
      objectives: safe(normalizeParagraph(form.objectives, FIELD_LIMITS.objectives)),
      submitted_at: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Casablanca' }) + ' (Casablanca)',
      club_name: 'YouAI — YouCode Safi',
    },
    {
      publicKey: emailConfig.publicKey,
      blockHeadless: true,
      limitRate: { id: 'youai-application', throttle: 60_000 },
    }
  );
}
