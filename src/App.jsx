import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, ArrowUpRight, BookOpen, Check,
  CheckCircle2, CircleAlert, Code2, Compass, Heart,
  Lightbulb, LoaderCircle, Mail, ShieldCheck,
  Sparkles, Users, Zap,
} from 'lucide-react';
import AmbientBackground from './components/AmbientBackground.jsx';
import ProgressNav from './components/ProgressNav.jsx';
import { validateApplication } from './lib/validation.js';
import { nextStep, previousStep } from './lib/journey.js';

const INITIAL_FORM = {
  fullName: '', email: '', background: '', level: '', experience: '',
  motivation: '', objectives: '', agreed: false, website: '',
};

const PILLARS = [
  { number: '01', icon: BookOpen, title: 'Learn without limits.', text: 'Explore artificial intelligence together, from foundational concepts to practical applications.', tag: 'EXPLORE' },
  { number: '02', icon: Code2, title: 'Build what matters.', text: 'Turn curiosity into real projects, meaningful experiments, and hands-on experience.', tag: 'CREATE' },
  { number: '03', icon: Users, title: 'Grow as a crew.', text: 'Connect with motivated peers, exchange ideas, and push each other further.', tag: 'CONNECT' },
];

const VALUES = [
  { number: '01', icon: Heart, title: 'Respect comes first', text: 'Treat every member with kindness. Different backgrounds, ideas, and skill levels are always welcome.' },
  { number: '02', icon: Lightbulb, title: 'Share the knowledge', text: 'If you learn something useful, pass it on. We grow faster when we help each other.' },
  { number: '03', icon: Users, title: 'Collaborate, don’t compete', text: 'Listen, support your teammates, and celebrate collective progress over individual ego.' },
  { number: '04', icon: Compass, title: 'Stay curious', text: 'Ask questions. Try things. Make mistakes. A beginner’s question can spark a great idea.' },
  { number: '05', icon: ShieldCheck, title: 'Build with integrity', text: 'Be honest about your work, respect privacy, give credit, and use AI responsibly.' },
  { number: '06', icon: Zap, title: 'Bring your energy', text: 'Participate when you can, communicate clearly, and take initiative to make the community better.' },
];

function SectionLabel({ children, number }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] font-semibold tracking-[0.22em] text-cyan-300 sm:text-[11px]">
      <span className="h-[6px] w-[6px] rounded-full bg-cyan-300 shadow-[0_0_14px_#22e1e8]" />
      {number && <span className="text-cyan-300/60">{number} /</span>}
      <span>{children}</span>
    </div>
  );
}

function PrimaryButton({ children, onClick, type = 'button', disabled, loading, className = '' }) {
  return (
    <button type={type} disabled={disabled || loading} onClick={onClick}
      className={`primary-button group inline-flex min-h-[54px] items-center justify-center gap-4 rounded-[11px] px-6 font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
      {loading ? <LoaderCircle size={17} className="animate-spin" /> : null}
      <span>{children}</span>
      {!loading && <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" size={18} strokeWidth={2.4} />}
    </button>
  );
}

function OutlineButton({ children, onClick, className = '' }) {
  return <button type="button" onClick={onClick} className={`outline-button inline-flex min-h-[52px] items-center justify-center gap-3 rounded-[11px] px-5 text-[13px] font-medium text-slate-300 transition-all hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${className}`}>{children}</button>;
}

function Welcome({ next, reduceMotion }) {
  return (
    <section className="relative mx-auto grid w-full max-w-[1192px] items-center gap-10 py-9 md:min-h-[580px] lg:grid-cols-[1.06fr_.94fr] lg:gap-6 lg:py-12" aria-labelledby="welcome-heading">
      <div className="relative z-10 max-w-[680px]">
        <SectionLabel number="01">THE NEXT GENERATION OF BUILDERS</SectionLabel>
        <h1 id="welcome-heading" className="hero-title mt-7 font-heading text-white">
          WELCOME<br />TO <span className="text-gradient-cyan">YOUAI.</span>
        </h1>
        <div className="mt-7 h-[2px] w-16 rounded-full bg-cyan-300" />
        <p className="mt-7 max-w-[465px] font-heading text-xl font-medium leading-[1.5] text-slate-200 sm:text-[24px]">Where curiosity meets intelligence.</p>
        <p className="mt-3 max-w-[465px] text-[14px] leading-7 text-slate-400 sm:text-[15px]">YouCode Safi's student AI community. A place to learn new skills, build real things, share ideas, and shape the future together.</p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <PrimaryButton onClick={next}>Explore the club</PrimaryButton>
          <span className="flex items-center gap-2 px-3 py-3 text-[12px] text-slate-500"><ShieldCheck size={16} className="text-cyan-300" /> A guided four-step journey</span>
        </div>
        <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.085] pt-5 font-mono text-[10px] tracking-[0.1em] text-slate-500">
          <span className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#30f2ce]" />OPEN TO CURIOUS MINDS</span>
          <span>YOUCODE · SAFI, MOROCCO</span>
        </div>
      </div>
      <div className="relative mx-auto flex h-[350px] w-full max-w-[550px] items-center justify-center sm:h-[480px] lg:h-[530px]" aria-hidden="true">
        <div className="hero-art-aura" />
        <div className="hero-orbit hero-orbit-outer" />
        <div className="hero-orbit hero-orbit-middle" />
        <div className="hero-orbit hero-orbit-inner" />
        <div className="hero-orbit-cross hero-orbit-cross-top">+</div>
        <div className="hero-orbit-cross hero-orbit-cross-right">+</div>
        <div className="hero-orbit-cross hero-orbit-cross-bottom">+</div>
        <motion.img
          initial={{ y: 8, opacity: 0, scale: .92 }} animate={{ y: reduceMotion ? 0 : [5, -7, 5], opacity: 1, scale: 1 }}
          transition={{ y: { repeat: Infinity, duration: 6, ease: 'easeInOut' }, opacity: { duration: .7 }, scale: { duration: .7 } }}
          className="relative z-10 w-[67%] max-w-[370px] drop-shadow-[0_0_50px_rgba(0,232,237,0.13)]"
          src="/youai-symbol.png" alt="" />
        <div className="floating-tag floating-tag-top"><span className="tag-dot" /> LEARN</div>
        <div className="floating-tag floating-tag-bottom"><span className="tag-dot" /> BUILD</div>
        <div className="floating-tag floating-tag-side"><span className="tag-dot" /> CONNECT</div>
        <div className="absolute bottom-[13px] right-[6px] z-20 hidden items-center gap-2 rounded-xl border border-cyan-300/20 bg-[#0c1626]/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex sm:right-[2px] sm:bottom-[32px]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/10"><Sparkles className="text-cyan-300" size={15} /></span>
          <span className="font-mono text-[9px] leading-4 tracking-[0.13em] text-slate-400">POWERED BY<br /><b className="text-white">CURIOSITY_</b></span>
        </div>
      </div>
    </section>
  );
}

function About({ next, back }) {
  return (
    <section className="mx-auto w-full max-w-[1192px] py-9 lg:py-11" aria-labelledby="about-heading">
      <div className="grid gap-7 lg:grid-cols-[1.02fr_.98fr] lg:items-end lg:gap-12">
        <div>
          <SectionLabel number="02">WHO WE ARE</SectionLabel>
          <h2 id="about-heading" className="section-title mt-6 font-heading">More than a club.<br /><span className="text-gradient-cyan">A place to build.</span></h2>
        </div>
        <div className="max-w-[470px] pb-2 lg:ml-auto">
          <p className="text-[15px] leading-8 text-slate-300">YouAI is a student-led artificial intelligence community at <strong className="font-semibold text-white">YouCode Safi</strong>, created for people who want to discover what AI can do — and learn how to build with it.</p>
          <p className="mt-3 text-[14px] leading-7 text-slate-400">Whether you're writing your first line of Python or exploring advanced ideas, there's room for you here.</p>
        </div>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PILLARS.map(({ icon: Icon, number, title, text, tag }) => (
          <article key={number} className="feature-card group relative overflow-hidden rounded-[17px] border border-white/[0.09] p-6 sm:p-7">
            <div className="mb-10 flex items-start justify-between gap-3">
              <span className="icon-tile flex h-[50px] w-[50px] items-center justify-center rounded-[13px] border border-cyan-300/15 bg-cyan-300/[0.075] text-cyan-300"><Icon size={23} strokeWidth={1.7} /></span>
              <span className="font-mono text-[11px] text-slate-600">/ {number}</span>
            </div>
            <h3 className="font-heading text-[23px] font-semibold leading-tight tracking-[-0.04em] text-white">{title}</h3>
            <p className="mt-3 min-h-[78px] max-w-[290px] text-[13px] leading-6 text-slate-400">{text}</p>
            <div className="mt-8 flex items-center justify-between border-t border-white/[0.075] pt-5">
              <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-cyan-300/85">{tag}</span>
              <ArrowUpRight size={17} className="text-slate-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-[14px] border border-cyan-400/15 bg-cyan-400/[0.035] p-5 sm:flex-row sm:items-center sm:px-7">
        <div className="flex items-start gap-4"><Sparkles className="mt-[3px] shrink-0 text-cyan-300" size={20} /><div><h3 className="font-heading text-[15px] font-semibold text-white">No experience? No problem.</h3><p className="mt-1 text-[13px] text-slate-400">Motivation and a willingness to learn are what matter here.</p></div></div>
        <span className="shrink-0 rounded-full border border-cyan-300/20 px-3 py-[7px] font-mono text-[9px] tracking-[.13em] text-cyan-300">ALL LEVELS WELCOME</span>
      </div>
      <div className="mt-8 flex flex-wrap gap-3"><PrimaryButton onClick={next}>Discover our values</PrimaryButton><OutlineButton onClick={back}><ArrowLeft size={16} /> Back</OutlineButton></div>
    </section>
  );
}

function Values({ next, back, accepted, onAcceptanceChange }) {
  return (
    <section className="mx-auto w-full max-w-[1192px] py-9 lg:py-11" aria-labelledby="values-heading">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><SectionLabel number="03">THE YOUAI CODE</SectionLabel><h2 id="values-heading" className="section-title mt-6 font-heading">Good people.<br /><span className="text-gradient-cyan">Great things.</span></h2></div>
        <p className="max-w-[330px] pb-2 text-[14px] leading-7 text-slate-400">A great community starts with shared values. Here's how we make YouAI a space worth being part of.</p>
      </div>
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, text, number }) => (
          <article key={number} className="value-card group rounded-[15px] border border-white/[0.08] p-5 sm:p-[23px]">
            <div className="mb-5 flex items-center justify-between"><Icon className="text-cyan-300" size={23} strokeWidth={1.6} /><span className="font-mono text-[10px] text-slate-600">{number}</span></div>
            <h3 className="font-heading text-[17px] font-semibold tracking-[-.025em] text-white">{title}</h3>
            <p className="mt-2 text-[12px] leading-[1.85] text-slate-400">{text}</p>
          </article>
        ))}
      </div>
      <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[.04] p-4 text-[13px] leading-6 text-slate-300">
        <input type="checkbox" id="rules-accepted" checked={accepted} onChange={(event) => onAcceptanceChange(event.target.checked)} className="agreement-check mt-[3px] h-[18px] w-[18px] shrink-0" />
        <span>I have read the YouAI community rules and agree to respect them.</span>
      </label>
      <p className="mt-2 text-xs text-slate-500">To continue to the application, please read and accept the rules.</p>
      <div className="mt-7 flex flex-wrap items-center gap-4"><PrimaryButton disabled={!accepted} onClick={next}>I agree — continue to application</PrimaryButton><OutlineButton onClick={back}><ArrowLeft size={16} /> Back</OutlineButton></div>
    </section>
  );
}

function FormField({ label, id, hint, required = false, error, children, end }) {
  return (
    <div className="min-w-0">
      <div className="mb-[9px] flex items-center justify-between gap-3"><label htmlFor={id} className="block text-[12px] font-semibold text-slate-200">{label} {required && <span className="text-cyan-300">*</span>}</label>{end}</div>
      {children}
      {error ? <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-300" id={`${id}-error`} role="alert"><CircleAlert size={12} />{error}</p> : hint ? <p className="mt-2 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}

function Application({ form, setForm, back, onSuccess }) {
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [done, setDone] = useState(false);
  const formRef = useRef(null);
  const sendLock = useRef(false);
  const formOpenedAt = useRef(Date.now());

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value, ...(field === 'background' && value === 'no' ? { level: '', experience: '' } : {}) }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (sendError) setSendError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending || done || sendLock.current) return;
    const found = validateApplication(form);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      const el = formRef.current?.querySelector(`[name="${first}"]`);
      el?.focus();
      return;
    }
    // These are local friction controls, not server-side anti-abuse guarantees.
    if (form.website) {
      setSendError('We could not verify this application. Please try again.');
      return;
    }
    if (Date.now() - formOpenedAt.current < 2500) {
      setSendError('Please review your answers before submitting.');
      return;
    }
    try {
      const lastSent = Number(window.localStorage.getItem('youai-last-sent') || 0);
      if (lastSent && Date.now() - lastSent < 5 * 60 * 1000) {
        setSendError('An application was recently submitted from this browser. Please try again later.');
        return;
      }
    } catch { /* Browser storage may be unavailable. */ }
    sendLock.current = true;
    setSending(true);
    setSendError('');
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Application could not be saved.');
      }
      try { window.localStorage.setItem('youai-last-sent', String(Date.now())); } catch { /* optional cooldown */ }
      setDone(true);
      onSuccess?.();
    } catch (error) {
      // Avoid logging the user's personal form answers in browser diagnostics.
      const message = error instanceof Error ? error.message : '';
      setSendError(message || 'We could not save your application. Please try again.');
    } finally {
      sendLock.current = false;
      setSending(false);
    }
  }

  if (done) return (
    <section className="mx-auto flex min-h-[570px] max-w-[770px] flex-col items-center justify-center py-12 text-center" aria-labelledby="success-heading">
      <motion.div initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} className="success-ring mb-8 flex h-[110px] w-[110px] items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10"><CheckCircle2 size={52} strokeWidth={1.3} className="text-cyan-300" /></motion.div>
      <SectionLabel number="04">TRANSMISSION COMPLETE</SectionLabel>
      <h2 id="success-heading" className="section-title mt-6 font-heading">You're on the radar,<br /><span className="text-gradient-cyan">{form.fullName.trim().split(/\s+/)[0]}.</span></h2>
      <p className="mt-5 max-w-[465px] text-[15px] leading-7 text-slate-400">Your application has been submitted to the YouAI team. We'll review it and reach out if there's a next step.</p>
      <div className="mt-8 flex items-center gap-3 rounded-[11px] border border-white/10 bg-white/[0.035] px-5 py-4 text-[12px] text-slate-300"><Mail size={16} className="text-cyan-300" /> Your application has been saved for the YouAI team to review.</div>
    </section>
  );

  return (
    <section className="mx-auto grid w-full max-w-[1192px] gap-9 py-9 lg:grid-cols-[.79fr_1.21fr] lg:gap-14 lg:py-11" aria-labelledby="apply-heading">
      <div className="lg:sticky lg:top-10 lg:self-start">
        <SectionLabel number="04">BECOME PART OF THE CREW</SectionLabel>
        <h2 id="apply-heading" className="section-title mt-6 font-heading">Your next chapter <span className="text-gradient-cyan">starts here.</span></h2>
        <p className="mt-5 max-w-[370px] text-[14px] leading-7 text-slate-400">There is no perfect background or perfect answer. Just tell us who you are, what drives you, and what you'd love to create.</p>
        <div className="mt-9 max-w-[360px] space-y-4 border-t border-white/[0.085] pt-6">
          <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/[.075] text-cyan-300"><Check size={16} /></span><div><p className="text-[12px] font-semibold text-white">Every skill level is welcome</p><p className="mt-1 text-[12px] leading-5 text-slate-500">Beginners and experienced builders can apply.</p></div></div>
          <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/[.075] text-cyan-300"><Mail size={15} /></span><div><p className="text-[12px] font-semibold text-white">Straight to our team</p><p className="mt-1 text-[12px] leading-5 text-slate-500">Your answers are saved privately in the club's application sheet.</p></div></div>
        </div>
        <div className="mt-8 hidden items-center gap-3 font-mono text-[10px] tracking-[0.12em] text-slate-600 lg:flex"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> YOUR IDEAS BELONG HERE</div>
      </div>
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="form-panel relative rounded-[21px] border border-white/[0.12] p-5 shadow-2xl shadow-black/20 sm:p-7 lg:p-8">
        <div className="mb-7 flex items-start justify-between gap-4 border-b border-white/[0.09] pb-5"><div><span className="font-mono text-[10px] tracking-[0.19em] text-cyan-300">MEMBERSHIP APPLICATION</span><h3 className="mt-2 font-heading text-[22px] font-semibold tracking-[-.035em] text-white">Tell us about yourself.</h3></div><span className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-2 font-mono text-[10px] text-slate-500">2026—27</span></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="fullName" label="Full name" required error={errors.fullName}>
            <input className={`form-input ${errors.fullName ? 'field-error' : ''}`} id="fullName" name="fullName" type="text" autoComplete="name" maxLength={100} placeholder="Your full name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? 'fullName-error' : undefined} />
          </FormField>
          <FormField id="email" label="Email address" required error={errors.email}>
            <input className={`form-input ${errors.email ? 'field-error' : ''}`} id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          </FormField>
        </div>
        <fieldset className="mt-6">
          <legend className="mb-3 text-[12px] font-semibold text-slate-200">Do you have a background in AI or programming? <span className="text-cyan-300">*</span></legend>
          <div className="grid grid-cols-2 gap-3">
            {[{ value: 'yes', label: 'Yes, I do', note: 'Some prior experience' }, { value: 'no', label: 'Not yet', note: 'Starting from scratch' }].map((item) => (
              <label key={item.value} className={`choice-card flex cursor-pointer items-start gap-3 rounded-[11px] border p-3.5 transition-all ${form.background === item.value ? 'choice-selected border-cyan-300/65 bg-cyan-300/[0.07]' : 'border-white/10 bg-[#0d1726] hover:border-white/25'}`}>
                <input type="radio" name="background" className="sr-only" value={item.value} checked={form.background === item.value} onChange={() => update('background', item.value)} />
                <span aria-hidden="true" className={`mt-[3px] flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border ${form.background === item.value ? 'border-cyan-300 bg-cyan-300' : 'border-slate-500'}`}>{form.background === item.value && <span className="h-[5px] w-[5px] rounded-full bg-[#031422]" />}</span>
                <span><span className="block text-[12px] font-semibold text-slate-100">{item.label}</span><span className="mt-1 block text-[10px] text-slate-500">{item.note}</span></span>
              </label>
            ))}
          </div>
          {errors.background && <p className="mt-2 text-[11px] text-rose-300" role="alert">{errors.background}</p>}
        </fieldset>
        <AnimatePresence initial={false}>
          {form.background === 'yes' && <motion.div key="background-details" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .24 }} className="overflow-hidden"><div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="level" className="mb-[9px] block text-[12px] font-semibold text-slate-200">Your current level <span className="text-cyan-300">*</span></label><select className={`form-input ${errors.level ? 'field-error' : ''}`} id="level" name="level" value={form.level} onChange={(e) => update('level', e.target.value)} aria-invalid={!!errors.level}><option value="">Choose your level</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select>{errors.level && <p className="mt-2 text-[11px] text-rose-300" role="alert">{errors.level}</p>}</div>
            <FormField id="experience" label="What have you explored?" error={errors.experience} hint="Optional — e.g. Python, ML, data, web dev"><input className={`form-input ${errors.experience ? 'field-error' : ''}`} id="experience" name="experience" type="text" value={form.experience} maxLength={180} placeholder="Python, ML, data..." onChange={(e) => update('experience', e.target.value)} /></FormField>
          </div></motion.div>}
        </AnimatePresence>
        <div className="mt-6">
          <FormField id="motivation" label="Why do you want to join YouAI?" required error={errors.motivation} end={<span className="font-mono text-[10px] text-slate-600">{form.motivation.length}/1000</span>}>
            <textarea id="motivation" name="motivation" className={`form-input form-textarea ${errors.motivation ? 'field-error' : ''}`} maxLength={1000} rows={3} placeholder="Tell us what inspires you about AI and this community..." value={form.motivation} onChange={(e) => update('motivation', e.target.value)} aria-invalid={!!errors.motivation} aria-describedby={errors.motivation ? 'motivation-error' : undefined} />
          </FormField>
        </div>
        <div className="mt-5">
          <FormField id="objectives" label="What do you hope to achieve in the club?" required error={errors.objectives} end={<span className="font-mono text-[10px] text-slate-600">{form.objectives.length}/1000</span>}>
            <textarea id="objectives" name="objectives" className={`form-input form-textarea ${errors.objectives ? 'field-error' : ''}`} maxLength={1000} rows={3} placeholder="Skills to learn, projects to build, ideas to explore..." value={form.objectives} onChange={(e) => update('objectives', e.target.value)} aria-invalid={!!errors.objectives} aria-describedby={errors.objectives ? 'objectives-error' : undefined} />
          </FormField>
        </div>
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Website (leave blank)</label><input type="text" id="website" name="website" value={form.website} onChange={(e) => update('website', e.target.value)} tabIndex={-1} autoComplete="off" /></div>
        <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-white/[0.085] bg-white/[0.025] p-4"><input type="checkbox" id="agreed" name="agreed" checked={form.agreed} onChange={(e) => update('agreed', e.target.checked)} className="agreement-check mt-[2px] h-[16px] w-[16px] shrink-0 accent-cyan-300" /><div className="text-[12px] leading-[1.7] text-slate-400"><label htmlFor="agreed" className="cursor-pointer">I consent to YouAI storing my application in the club's private Google Sheet, using it only to review my membership request and contact me about it.</label> <button type="button" onClick={back} className="font-semibold text-cyan-300 underline decoration-cyan-300/30 underline-offset-4 hover:text-white">Review the values</button>.</div></div>
        {errors.agreed && <p className="mt-2 text-[11px] text-rose-300" role="alert">{errors.agreed}</p>}
        {sendError && <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/5 p-3 text-[12px] leading-6 text-rose-200" role="alert"><CircleAlert size={17} className="mt-1 shrink-0" /><span>{sendError}</span></div>}
        <div className="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center"><span className="font-mono text-[10px] leading-5 text-slate-500">* REQUIRED FIELDS<br />REVIEWED BY THE YOUAI TEAM</span><PrimaryButton type="submit" disabled={sending} loading={sending} className="w-full sm:w-auto">{sending ? 'Sending application...' : 'Submit application'}</PrimaryButton></div>
      </form>
    </section>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const reduceMotion = useReducedMotion();

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  // Intentionally no arbitrary goTo(index): every forward navigation is one step.
  function goNext() {
    setStep((current) => nextStep(current, rulesAccepted));
    scrollTop();
  }

  function goBack() {
    setStep(previousStep);
    scrollTop();
  }

  useEffect(() => { document.title = ['Welcome', 'Discover', 'Our Values', 'Apply'][step] + ' | YouAI — YouCode Safi'; }, [step]);

  return (
    <div className="site-shell relative isolate flex min-h-screen flex-col overflow-hidden bg-[#050919] text-slate-100">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AmbientBackground />
      <header className="relative z-20 border-b border-white/[0.065]">
        <div className="mx-auto flex h-[85px] max-w-[1312px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-14">
          <div className="flex items-center gap-3"><img src="/youai-wordmark.png" alt="YouAI" className="h-[41px] w-auto max-w-[154px] object-contain" /><span className="hidden h-[20px] w-px bg-white/15 sm:block" /><span className="hidden font-mono text-[9px] font-medium tracking-[0.16em] text-slate-500 sm:block">YOUCODE<br />SAFI</span></div>
          <div className="flex items-center gap-3 sm:gap-5"><div className="hidden items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.045] px-3 py-2 font-mono text-[9px] tracking-[0.12em] text-slate-300 md:flex"><span className="h-[5px] w-[5px] rounded-full bg-[#4df4d5] shadow-[0_0_9px_#4df4d5]" /> APPLICATIONS OPEN</div><span className="font-mono text-[10px] tracking-[.13em] text-slate-500 sm:text-[11px]">2026 / 2027</span><span className="hidden items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 font-mono text-[10px] tracking-[.08em] text-slate-400 sm:flex"><ShieldCheck size={14} className="text-cyan-300" /> STEP 0{step + 1} / 04</span></div>
        </div>
      </header>
      <div className="relative z-10 mx-auto w-full max-w-[1312px] px-5 pt-5 sm:px-8 lg:px-14 lg:pt-7"><ProgressNav step={step} /></div>
      <main id="main-content" className="relative z-10 mx-auto w-full max-w-[1312px] flex-1 px-5 sm:px-8 lg:px-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={reduceMotion ? false : { opacity: 0, y: 20, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduceMotion ? {} : { opacity: 0, y: -12, filter: 'blur(5px)' }} transition={{ duration: reduceMotion ? 0 : .31, ease: [.22, 1, .36, 1] }}>
            {step === 0 && <Welcome next={goNext} reduceMotion={reduceMotion} />}
            {step === 1 && <About next={goNext} back={goBack} />}
            {step === 2 && <Values next={goNext} back={goBack} accepted={rulesAccepted} onAcceptanceChange={setRulesAccepted} />}
            {step === 3 && <Application form={form} setForm={setForm} back={goBack} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="relative z-10 mt-9 border-t border-white/[0.07]">
        <div className="mx-auto flex min-h-[63px] max-w-[1312px] flex-col justify-between gap-3 px-5 py-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:px-8 lg:px-14"><span className="font-mono tracking-[.09em]">© 2026 YOUAI. MADE FOR CURIOUS MINDS.</span><span className="font-mono tracking-[.09em]">BUILT AT YOUCODE SAFI <span className="mx-2 text-cyan-300">✳</span> MOROCCO</span></div>
      </footer>
    </div>
  );
}
