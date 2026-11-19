export default function AmbientBackground() {
  return (
    <div className="ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="ambient-grid absolute inset-0" />
      <div className="orb-glow orb-glow-left" />
      <div className="orb-glow orb-glow-right" />
      <div className="ambient-vignette absolute inset-0" />
      <div className="ambient-cross cross-one">+</div>
      <div className="ambient-cross cross-two">+</div>
      <div className="ambient-cross cross-three">+</div>
    </div>
  );
}
