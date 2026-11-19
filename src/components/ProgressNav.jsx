import { Check, LockKeyhole } from 'lucide-react';

const STAGES = [
  { title: 'WELCOME', subtitle: 'The beginning' },
  { title: 'DISCOVER', subtitle: 'Our community' },
  { title: 'VALUES', subtitle: 'The code we live by' },
  { title: 'APPLY', subtitle: 'Your next move' },
];

export default function ProgressNav({ step }) {
  return (
    <nav className="stepnav mx-auto w-full max-w-[1192px]" aria-label="Registration progress">
      <ol className="grid grid-cols-4 gap-2 lg:gap-8">
        {STAGES.map((stage, index) => {
          const active = step === index;
          const completed = step > index;
          return (
            <li key={stage.title} className="relative min-w-0" aria-current={active ? 'step' : undefined}>
              <div className={`step-link flex items-center gap-3 rounded-xl p-2 text-left sm:p-3 ${active ? 'step-link-active' : ''}`}>
                <span className={`step-number flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border font-mono text-[11px] sm:h-10 sm:w-10 ${active ? 'border-cyan-300/60 bg-cyan-300/12 text-cyan-300' : completed ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300' : 'border-white/10 bg-white/[0.025] text-slate-500'}`}>
                  {completed ? <Check size={16} strokeWidth={2.2} /> : active ? `0${index + 1}` : <LockKeyhole size={15} strokeWidth={1.7} />}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className={`block text-[10px] font-bold tracking-[0.19em] ${active ? 'text-white' : completed ? 'text-slate-300' : 'text-slate-500'}`}>{stage.title}</span>
                  <span className="mt-[3px] block truncate text-[11px] text-slate-500">{stage.subtitle}</span>
                </span>
              </div>
              {index < 3 && <span aria-hidden="true" className={`step-connector absolute top-[27px] -right-2 hidden h-px w-4 lg:block ${completed ? 'bg-cyan-300/45' : 'bg-white/10'}`} />}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-center font-mono text-[10px] tracking-[.08em] text-slate-500 sm:text-right">Complete each step to unlock the next.</p>
    </nav>
  );
}
