interface DashboardSectionProps {
  title: string;
  colorClass: string;
  lineClass: string;
  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  colorClass,
  lineClass,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2
          className={`text-xs font-black uppercase tracking-[0.25em] ${colorClass}`}
        >
          {title}
        </h2>
        <div className={`h-[1px] flex-1 ${lineClass}`}></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
}
