export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-medium text-slate-500">Sistema Administrativo</h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Sin Login (fase inicial)
        </span>
      </div>
    </header>
  );
}
