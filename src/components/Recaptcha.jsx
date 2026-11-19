import { useEffect, useRef, useState } from 'react';

let loaderPromise;
function loadRecaptcha() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser required'));
  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-youai-recaptcha]');
      if (existing && window.grecaptcha) {
        window.grecaptcha.ready(() => resolve(window.grecaptcha));
        return;
      }
      const script = existing || document.createElement('script');
      if (!existing) {
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.youaiRecaptcha = 'true';
      }
      script.addEventListener('load', () => {
        if (window.grecaptcha) window.grecaptcha.ready(() => resolve(window.grecaptcha));
        else reject(new Error('CAPTCHA unavailable'));
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('CAPTCHA could not load')), { once: true });
      if (!existing) document.head.appendChild(script);
    }).catch((error) => { loaderPromise = undefined; throw error; });
  }
  return loaderPromise;
}

// Google reCAPTCHA v2 checkbox, supported by EmailJS template verification.
export default function Recaptcha({ siteKey, onChange, resetSignal }) {
  const elementRef = useRef(null);
  const widgetRef = useRef(null);
  const callbackRef = useRef(onChange);
  const [loadError, setLoadError] = useState(false);
  callbackRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    if (!siteKey) return undefined;
    loadRecaptcha().then((api) => {
      if (cancelled || !elementRef.current || widgetRef.current !== null) return;
      widgetRef.current = api.render(elementRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token) => callbackRef.current(token),
        'expired-callback': () => callbackRef.current(''),
        'error-callback': () => callbackRef.current(''),
      });
    }).catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, [siteKey]);

  useEffect(() => {
    if (widgetRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetRef.current);
      callbackRef.current('');
    }
  }, [resetSignal]);

  if (!siteKey) return null;
  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-semibold text-slate-200">Human verification <span className="text-cyan-300">*</span></p>
      <div ref={elementRef} className="min-h-[78px] max-w-full overflow-x-auto" />
      {loadError && <p role="alert" className="mt-2 text-xs text-rose-300">Verification could not load. Check your connection and reload the page.</p>}
    </div>
  );
}
