import { useReducedMotion } from "framer-motion";
import { PARTICIPACIONES, type Participacion } from "@/data/participaciones";

const Item = ({ p, wrap = false }: { p: Participacion; wrap?: boolean }) =>
  p.logo ? (
    <img src={p.logo} alt={p.alt} loading="lazy"
      className="h-10 w-auto object-contain grayscale opacity-70 transition duration-300 hover:grayscale-0 hover:opacity-100" />
  ) : (
    <span className={`font-serif text-sm md:text-base tracking-[0.18em] uppercase ${wrap ? "whitespace-normal text-center block" : "whitespace-nowrap"} text-brand-mauve/80`}>{p.name}</span>
  );

/** Carrusel continuo de izquierda a derecha (~40 s por vuelta); estático con movimiento reducido. */
export const LogoMarquee = ({ label = "Ha participado en" }: { label?: string }) => {
  const reduce = useReducedMotion();
  // Repetimos la lista para que cada mitad sea más ancha que la pantalla y no queden huecos.
  const reps = Math.max(2, Math.ceil(8 / PARTICIPACIONES.length));
  const half = Array.from({ length: reps }, () => PARTICIPACIONES).flat();
  return (
    <section aria-label={label} className="bg-brand-cream border-y border-brand-gold/30 py-6 md:py-7">
      <p className="text-center text-xs tracking-[0.3em] uppercase text-brand-mauve [font-variant:small-caps] mb-4">{label}</p>
      {reduce ? (
        <ul className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 px-6">
          {PARTICIPACIONES.map((p) => <li key={p.name} className="max-w-full"><Item p={p} wrap /></li>)}
        </ul>
      ) : (
        <div className="logo-marquee" tabIndex={0}>
          <ul className="sr-only">{PARTICIPACIONES.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
          <div className="logo-marquee-track" aria-hidden="true">
            {[0, 1].map((g) => (
              <div key={g} className="flex shrink-0 items-center">
                {half.map((p, i) => <div key={`${g}-${i}`} className="px-8 md:px-12 flex items-center h-11"><Item p={p} /></div>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LogoMarquee;
