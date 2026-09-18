export default function SectionHeading({
  children,
  number,
  eyebrow,
  light = false,
}: {
  children: React.ReactNode;
  number: string;
  eyebrow?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-8">
      <div className={`eyebrow mb-3 ${light ? "eyebrow-light" : ""}`}>
        <span>{number}</span>
        <span className="eyebrow-rule" />
        {eyebrow && <span>{eyebrow}</span>}
      </div>
      <h2 className={`font-serif text-[2rem] md:text-[2.4rem] leading-[1.1] ${light ? "text-white" : "text-ink"}`}>
        {children}
      </h2>
    </div>
  );
}
