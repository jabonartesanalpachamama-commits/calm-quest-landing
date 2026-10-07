import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { PARTICIPACIONES, type Participacion } from "@/data/participaciones";

const SPEED = 60; // px por segundo

const Item = ({ p, wrap = false }: { p: Participacion; wrap?: boolean }) =>
  p.logo ? (
    <img src={p.logo} alt={p.alt} loading="lazy" draggable={false}
      className={`${p.h ?? "h-10 md:h-12"} w-auto max-w-none object-contain grayscale opacity-60 mix-blend-multiply transition duration-500 [@media(hover:hover)]:hover:grayscale-0 [@media(hover:hover)]:hover:opacity-100`} />
  ) : (
    <span className={`font-serif text-xs md:text-sm tracking-[0.24em] uppercase ${wrap ? "whitespace-normal text-center block" : "whitespace-nowrap"} text-muted-foreground`}>{p.name}</span>
  );

/** Franja blanca de participaciones: desplazamiento lineal y lento de derecha a izquierda; estática con movimiento reducido. */
export const LogoMarquee = () => {
  const reduce = useReducedMotion();
  const groupRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(70);
  const reps = Math.max(2, Math.ceil(8 / PARTICIPACIONES.length));
  const half = Array.from({ length: reps }, () => PARTICIPACIONES).flat();

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const update = () => el.offsetWidth && setDuration(el.offsetWidth / SPEED);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [reduce]);

  return (
    <section aria-label="Participaciones" className="bg-background">
      <div aria-hidden="true" className="h-px w-full" style={{ background: "hsl(var(--brand-gold) / 0.4)" }} />
      <div className="py-14 md:py-[72px]">
      {reduce ? (
        <ul className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-20 gap-y-8 px-6">
          {PARTICIPACIONES.map((p) => <li key={p.name} className="max-w-full"><Item p={p} wrap /></li>)}
        </ul>
      ) : (
        <div className="logo-marquee" tabIndex={0} aria-label="Participaciones (franja en movimiento)">
          <ul className="sr-only">{PARTICIPACIONES.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
          <div className="logo-marquee-track" aria-hidden="true" style={{ animationDuration: `${duration}s` }}>
            {[0, 1].map((g) => (
              <div key={g} ref={g === 0 ? groupRef : undefined} className="flex shrink-0 items-center">
                {half.map((p, i) => <div key={`${g}-${i}`} className="px-12 md:px-20 flex items-center h-16"><Item p={p} /></div>)}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default LogoMarquee;
