// These checks are for UX and basic abuse reduction only. Browser validation is
// always bypassable. Keep EmailJS template verification enabled for public use.
export const FIELD_LIMITS = Object.freeze({
  fullName: 100,
  email: 254,
  experience: 180,
  motivation: 1000,
  objectives: 1000,
});

export function normalizeSingleLine(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function normalizeParagraph(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength);
}

// Restrict HTML metacharacters in untrusted template values; avoid interpreting
// applicant-written HTML as formatted HTML in the club's notification emails.
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
}

export function validateApplication(form) {
  const errors = {};
  const name = normalizeSingleLine(form.fullName, FIELD_LIMITS.fullName);
  const email = normalizeSingleLine(form.email, FIELD_LIMITS.email);
  const motivation = normalizeParagraph(form.motivation, FIELD_LIMITS.motivation);
  const objectives = normalizeParagraph(form.objectives, FIELD_LIMITS.objectives);

  if (name.length < 3 || !/\S+\s+\S+/.test(name) || String(form.fullName).length > FIELD_LIMITS.fullName) {
    errors.fullName = 'Please enter your first and last name (3–100 characters).';
  }
  if (email.length > FIELD_LIMITS.email || String(form.email).length > FIELD_LIMITS.email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!['yes', 'no'].includes(form.background)) errors.background = 'Please select an option.';
  if (form.background === 'yes' && !['Beginner', 'Intermediate', 'Advanced'].includes(form.level)) {
    errors.level = 'Please select your current level.';
  }
  if (form.background === 'yes' && String(form.experience).length > FIELD_LIMITS.experience) {
    errors.experience = 'Please keep your experience under 180 characters.';
  }
  if (motivation.length < 20 || String(form.motivation).length > FIELD_LIMITS.motivation) {
    errors.motivation = 'Please write between 20 and 1000 characters.';
  }
  if (objectives.length < 20 || String(form.objectives).length > FIELD_LIMITS.objectives) {
    errors.objectives = 'Please write between 20 and 1000 characters.';
  }
  if (form.agreed !== true) errors.agreed = 'Please confirm your consent before submitting.';
  return errors;
}
