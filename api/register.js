export const config = { maxDuration: 30 };

// Vercel Function: keeps Google Script URL on the server, away from the frontend.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(scriptUrl)) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  if (!String(req.headers['content-type'] || '').includes('application/json')) {
    return res.status(415).json({ success: false, message: 'JSON required' });
  }

  const data = req.body;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  const read = (key) => typeof data[key] === 'string' ? data[key].trim() : '';
  const fullName = read('fullName');
  const email = read('email');
  const background = read('background');
  const level = read('level');
  const experience = read('experience');
  const motivation = read('motivation');
  const objectives = read('objectives');

  if (read('website')) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }
  const valid =
    fullName.length >= 3 && fullName.length <= 100 && /\S+\s+\S+/.test(fullName) &&
    email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) &&
    ['yes', 'no'].includes(background) &&
    (background !== 'yes' || ['Beginner', 'Intermediate', 'Advanced'].includes(level)) &&
    experience.length <= 180 &&
    motivation.length >= 20 && motivation.length <= 1000 &&
    objectives.length >= 20 && objectives.length <= 1000 &&
    data.agreed === true;

  if (!valid) {
    return res.status(400).json({ success: false, message: 'Please review your application details.' });
  }

  const payload = {
    full_name: fullName,
    email,
    has_background: background === 'yes' ? 'Yes' : 'No',
    background_level: background === 'yes' ? level : 'No previous background',
    background_details: background === 'yes' ? (experience || 'Not provided') : 'Not applicable',
    motivation,
    objectives,
    website: '',
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
    });
    const result = await response.json();
    // A duplicate is a handled validation result, not a Sheets outage.
    if (result?.error === 'already_registered') {
      return res.status(409).json({
        success: false,
        message: 'This email already has an application. Please contact the YouAI team if you need to update it.',
      });
    }
    if (!response.ok || result.success !== true) {
      console.error('Google Sheets registration rejected:', result?.error || response.status);
      return res.status(502).json({ success: false, message: 'Could not save application to Google Sheets.' });
    }
    return res.status(200).json({ success: true, message: 'Application saved.' });
  } catch (error) {
    console.error('Registration service error:', error?.message);
    return res.status(502).json({ success: false, message: 'The registration service is temporarily unavailable.' });
  }
}
