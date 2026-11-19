export const STEP_COUNT = 4;

// This app intentionally has no jump-to-step navigation. Forward movement is
// strictly adjacent and the rules gate must be accepted before the form.
export function nextStep(step, rulesAccepted) {
  if (!Number.isInteger(step) || step < 0 || step >= STEP_COUNT) return 0;
  if (step === 2 && !rulesAccepted) return 2;
  return Math.min(step + 1, STEP_COUNT - 1);
}

export function previousStep(step) {
  if (!Number.isInteger(step) || step < 0 || step >= STEP_COUNT) return 0;
  return Math.max(step - 1, 0);
}
