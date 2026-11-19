import test from 'node:test';
import assert from 'node:assert/strict';
import { nextStep, previousStep } from '../src/lib/journey.js';
import { escapeHtml, normalizeSingleLine, validateApplication } from '../src/lib/validation.js';

const valid = {
  fullName: 'Ada Lovelace', email: 'ada@example.com', background: 'yes',
  level: 'Beginner', experience: 'Python',
  motivation: 'I want to learn practical AI with classmates.',
  objectives: 'I hope to build a small ML project with a team.',
  agreed: true,
};

test('the journey can only advance by one screen at a time', () => {
  assert.equal(nextStep(0, false), 1);
  assert.equal(nextStep(1, false), 2);
  assert.equal(nextStep(2, false), 2);
  assert.equal(nextStep(2, true), 3);
  assert.equal(nextStep(3, true), 3);
  assert.equal(previousStep(3), 2);
  assert.equal(previousStep(0), 0);
  assert.equal(nextStep(99, true), 0);
});

test('valid application accepted', () => {
  assert.deepEqual(validateApplication(valid), {});
});

test('reject incomplete or malformed application', () => {
  const errors = validateApplication({ ...valid, fullName: 'X', email: 'bad\n@example.com', motivation: 'short', agreed: false, level: 'Other' });
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.level);
  assert.ok(errors.motivation);
  assert.ok(errors.agreed);
});

test('does not require a level for complete beginners', () => {
  assert.deepEqual(validateApplication({ ...valid, background: 'no', level: '' }), {});
});

test('reject over-long values even if custom browser maxLength was bypassed', () => {
  const errors = validateApplication({ ...valid, objectives: 'a'.repeat(1001), experience: 'x'.repeat(181) });
  assert.ok(errors.objectives);
  assert.ok(errors.experience);
});

test('escape applicant-controlled HTML and remove header newlines', () => {
  assert.equal(escapeHtml('<img src="x" onerror=\'test\'>&'), '&lt;img src=&quot;x&quot; onerror=&#39;test&#39;&gt;&amp;');
  assert.equal(normalizeSingleLine('a\r\nb', 20), 'a b');
});
