import ParticleField from "@/components/ParticleField";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="moving-grid" />
      <div className="moving-grid-glow" />
      <ParticleField />
    </div>
  );
}
