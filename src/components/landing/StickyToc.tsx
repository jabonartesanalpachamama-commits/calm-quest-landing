import { useEffect, useState } from "react";

/** Detecta la sección visible para resaltar el índice. */
export const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
};

const go = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
};

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";

/** Índice lateral sticky (escritorio) */
export const SideToc = ({ items, active, title = "Contenido" }: { items: [string, string][]; active: string; title?: string }) => (
  <nav aria-label="Índice" className="hidden lg:block sticky top-28 self-start">
    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{title}</p>
    <ul className="space-y-1 border-l border-border/60">
      {items.map(([id, label]) => (
        <li key={id}>
          <a href={`#${id}`} onClick={(e) => go(e, id)} aria-current={active === id ? "true" : undefined}
            className={`block -ml-px pl-4 py-1.5 text-sm border-l-2 transition-colors rounded-r-sm ${FOCUS} ${
              active === id ? "border-brand-gold text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

/** Índice en píldoras con scroll horizontal (móvil) */
export const PillToc = ({ items, active }: { items: [string, string][]; active: string }) => (
  <nav aria-label="Índice" className="lg:hidden sticky top-16 md:top-20 z-30 -mx-6 px-6 py-3 bg-background/95 backdrop-blur border-b border-border/40">
    <ul className="flex gap-2 overflow-x-auto text-sm pb-1">
      {items.map(([id, label]) => (
        <li key={id} className="shrink-0">
          <a href={`#${id}`} onClick={(e) => go(e, id)}
            className={`inline-flex whitespace-nowrap px-3.5 py-2 rounded-full border transition-colors ${FOCUS} ${
              active === id ? "bg-[#795D64] text-white border-[#795D64]" : "bg-card text-[#795D64] border-border/50"
            }`}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
