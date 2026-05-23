import { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
      <header className="mb-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
