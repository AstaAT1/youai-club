# YouAI — YouCode Safi club registration (v2)

A polished, mobile-friendly **single-page, four-screen** application experience. It uses **React 19, Vite, Tailwind CSS v4, Motion, Lucide, and EmailJS**. The website's visible text is **English**. Uses the supplied official-style YouAI skull / pirate logos.

## Run locally

Install **Node.js 20.19+ (or 22.12+)** and npm:

```bash
npm install
cp .env.example .env
npm run dev
```

Open the development URL (usually `http://localhost:5173`). You can walk through all four screens without setting up an email account, but **form submission requires EmailJS configuration**.

## 1. Configure EmailJS

Registration emails must arrive at: **kun443756@gmail.com**.

1. Sign in at <https://dashboard.emailjs.com/>.
2. Create / connect an **Email Service**. Copy the `Service ID`.
3. Create an **Email Template**. Set **To Email** to `kun443756@gmail.com` as a **fixed value**. Do not use a visitor-controlled variable in the recipient field.
4. Set **Reply To** to `{{reply_to}}`; **Subject** to the fixed phrase `New YouAI membership application`.
5. Paste `emailjs-template.html` into the template **HTML editor** (or copy the fields into your EmailJS template). Copy its `Template ID`.
6. Get your **Public Key** from the EmailJS account page.
7. Copy the following values into `.env`:

```dotenv
VITE_EMAILJS_SERVICE_ID=service_XXXXXXXX
VITE_EMAILJS_TEMPLATE_ID=template_XXXXXXXX
VITE_EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXXXX

# Optional CAPTCHA (see next section):
VITE_RECAPTCHA_SITE_KEY=
```

8. **Restart** `npm run dev` after changing `.env`.
9. Send a test application and check the EmailJS message history, inbox and spam folder.

**Important:** Variables prefixed with `VITE_` are **visible in the browser bundle**. The three EmailJS identifiers and reCAPTCHA **site key** are public identifiers, not private keys. Never put Gmail passwords, EmailJS private keys, reCAPTCHA secret keys, or account tokens in this project.

## 2. Strong anti-spam protection: enable reCAPTCHA v2 before publishing

**Recommended for public launch.** EmailJS documents support for **Google reCAPTCHA version 2** (the checkbox variant).

1. Register the site's domain in Google's [reCAPTCHA console](https://www.google.com/recaptcha/admin) and choose **reCAPTCHA v2 — "I'm not a robot" checkbox**.
2. Add the public Google **site key** as `VITE_RECAPTCHA_SITE_KEY` in `.env`.
3. In EmailJS, open the relevant **email template → Settings → Enable reCAPTCHA V2 verification** and enter the Google **secret key there**. The secret key must **never** be in client-side code or a `VITE_` variable.
4. Restart/redeploy the application. The form will now render the CAPTCHA widget and pass its `g-recaptcha-response` token to EmailJS.
5. Check that both a legitimate completed CAPTCHA and a CAPTCHA-free request behave as expected. The latter should be rejected **by EmailJS**, not just the browser.

**Do not switch on CAPTCHA verification inside EmailJS without also entering a working site key in `.env`; otherwise every submission will fail.** Likewise, just adding a site key in the website does not provide server-side validation unless you turn it on in the EmailJS template.

Docs: <https://www.emailjs.com/docs/user-guide/adding-captcha-verification/>

## 3. Other EmailJS dashboard protection

- If available on your plan, configure a domain origin allowlist for your **exact production website domain**; note EmailJS's **Free tier does not currently include domain allowlisting**, so do not assume this feature is available on all plans.
- Configure any offered IP-based anti-abuse limits. This project adds a 60-second browser SDK throttle and a **5-minute browser-local post-success cooldown**; both can be bypassed by a determined attacker and **are not real server rate limits**.
- Turn on EmailJS account **MFA / 2FA** and use a strong unique password.
- Use a **dedicated mail service or club account** if possible, rather than publishing personal SMTP credentials.
- Review EmailJS usage and quota regularly. Never treat the public key as a secret.

See <https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/> and <https://www.emailjs.com/docs/sdk/options/>.

## 4. How the registration flow works

1. **Welcome to YouAI** — an animated logo, identity and introduction.
2. **Discover** — who the club is, how members learn and build together.
3. **Community Rules** — respect, share knowledge, collaborate, stay curious, integrity and participation. **Visitors must check the rules acceptance checkbox** to proceed.
4. **Apply** — name, email, AI/programming background (yes/no), level if applicable, optional previous experience, motivation, objectives and privacy consent.

The progress component is **read-only**: no clickable future-step navigation. The `App` state transitions only move **one adjacent step** forward, and the rules gate prevents proceeding to the form without agreement. Users can move backward one step to review earlier material.

On submission, the form checks lengths, email format, full name, conditional level, privacy consent and a hidden anti-bot field, then submits via EmailJS. **The success screen appears only when EmailJS responds successfully**. EmailJS acknowledgement does not guarantee final delivery to the inbox — verify using the dashboard.

These navigation/validation restrictions are **UX controls**. Someone running custom browser code can bypass client-side checks. If you need **enforced eligibility rules, secure rate limits, audit trails or guaranteed delivery**, deploy a backend or serverless function and validate there. CAPTCHA verification performed by EmailJS is the main service-side anti-bot control in this architecture.

## 5. Privacy and handling applications

- The site does **not** create its own applications database.
- Applicants' responses go through **EmailJS** and the selected email provider; these third-party services and mailboxes may retain their own copies.
- The local cooldown stores **only a timestamp** in `localStorage` (key `youai-last-sent`), not the applicant's name or answers.
- Do not use application data outside reviewing membership requests and responding to applicants. Manage retained email applications securely, restrict who can access the club mailbox, and delete them when no longer necessary.
- Before public launch, consider publishing a short formal privacy notice identifying the data controller and contact email, actual retention policy, and the services involved.

## 6. Development and deployment

```bash
npm test
npm run build
npm run preview
```

`npm test` checks adjacent-step navigation, acceptance gates, validation and HTML-escaping utilities. Build output is `dist/` and can be hosted on Netlify / Cloudflare Pages / Vercel (set environment variables in host settings **before** building). `public/_headers` supplies a baseline of security response headers on **Netlify and Cloudflare Pages**; on other hosts configure headers in that platform.

### Main files

- `src/App.jsx` — the four screens, onboarding and form UI
- `src/lib/journey.js` — one-at-a-time step transitions
- `src/lib/validation.js` — field normalization and validation
- `src/lib/email.js` — EmailJS setup, payload and SDK throttle
- `src/components/ProgressNav.jsx` — non-clickable progress bar
- `src/components/Recaptcha.jsx` — optional reCAPTCHA v2 checkbox
- `src/styles.css` — club colors, responsive UI and animations
- `emailjs-template.html` — copy into EmailJS's HTML email template
- `public/youai-symbol.png` and `public/youai-wordmark.png` — supplied visual identity

Keep the club contact inbox configured in **EmailJS** rather than accepting recipient information from users.
