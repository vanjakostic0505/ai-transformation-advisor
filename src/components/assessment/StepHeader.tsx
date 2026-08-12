export function StepHeader({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="eyebrow">{step}</p>
      <h1 className="display-2 mt-3 text-ink text-balance">{title}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted text-pretty">
        {description}
      </p>
    </div>
  );
}
