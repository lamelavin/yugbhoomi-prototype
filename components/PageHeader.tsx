export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 px-8 pt-8 pb-6 lg:px-10">
      <div>
        {eyebrow && <p className="text-[10.5px] font-medium tracking-[0.14em] text-ink/40">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-3xl text-forest-700">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink/55 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
