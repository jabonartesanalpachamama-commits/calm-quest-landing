import { useReducedMotion } from "framer-motion";
import { PARTICIPACIONES, type Participacion } from "@/data/participaciones";

const Item = ({ p, wrap = false }: { p: Participacion; wrap?: boolean }) =>
  p.logo ? (
    <img src={p.logo} alt={p.alt} loading="lazy"
      className="h-9 md:h-10 w-auto object-contain grayscale opacity-60 transition duration-500 hover:grayscale-0 hover:opacity-100" />
  ) : (
    <span className={`font-serif text-xs md:text-sm tracking-[0.24em] uppercase ${wrap ? "whitespace-normal text-center block" : "whitespace-nowrap"} text-muted-foreground`}>{p.name}</span>
  );

/** Franja blanca de participaciones: desplazamiento lineal y lento de derecha a izquierda; estática con movimiento reducido. */
export const LogoMarquee = () => {
  const reduce = useReducedMotion();
  const reps = Math.max(2, Math.ceil(8 / PARTICIPACIONES.length));
  const half = Array.from({ length: reps }, () => PARTICIPACIONES).flat();
  return (
    <section aria-label="Participaciones" className="bg-background">
      <div aria-hidden="true" className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, hsl(var(--brand-gold) / 0.4), transparent)" }} />
      <div className="py-14 md:py-[72px]">
      {reduce ? (
        <ul className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 px-6">
          {PARTICIPACIONES.map((p) => <li key={p.name} className="max-w-full"><Item p={p} wrap /></li>)}
        </ul>
      ) : (
        <div className="logo-marquee" tabIndex={0}>
          <ul className="sr-only">{PARTICIPACIONES.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
          <div className="logo-marquee-track" aria-hidden="true">
            {[0, 1].map((g) => (
              <div key={g} className="flex shrink-0 items-center">
                {half.map((p, i) => <div key={`${g}-${i}`} className="px-10 md:px-16 flex items-center h-11"><Item p={p} /></div>)}
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
