import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, RevealTitle } from "@/components/landing";
import { porIdsResena, RESENA_DIMENSIONS, type Resena } from "@/data/resenas";

export const RESENA_LINK = "inline-flex min-h-11 items-center border-b border-brand-gold text-brand-mauve text-xs uppercase tracking-normal hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mauve focus-visible:ring-offset-4";

export const resenaReveal = {
  hidden: { opacity: 0, filter: "blur(10px)", transform: "translate3d(0,50px,-120px) rotateX(4deg)" },
  show: { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0) rotateX(0deg)", transition: { duration: 1.2, ease: EASE } },
};

export const ResenaImage = ({ resena, framed = false, loading = "lazy" }: { resena: Resena; framed?: boolean; loading?: "lazy" | "eager" }) => {
  const dimensions = RESENA_DIMENSIONS[resena.id];
  if (!dimensions) return null;
  return <img src={resena.img} alt={`Reseña de Google de ${resena.nombre} sobre Fransury González`}
    loading={loading} decoding="async" width={dimensions.width} height={dimensions.height}
    className={`block w-full h-auto ${framed ? "reviews-capture" : ""}`} />;
};

/** Compact shared band; screenshots themselves are always unaltered. */
export const ResenaStatic = ({ id }: { id: string }) => {
  const reduce = useReducedMotion();
  const [resena] = porIdsResena([id]);
  if (!resena) return null;
  return <section aria-label={`Reseña de ${resena.nombre}`} data-resena-static={id} className="reviews-static border-y border-brand-gold bg-brand-cream px-6 py-5">
    <div className="max-w-[520px] mx-auto">
      <RevealTitle text="LO QUE DICEN MIS PACIENTES" className="reviews-static-title text-center text-brand-mauve" />
      <span aria-hidden="true" className="mx-auto my-3 block h-px w-12 bg-brand-gold" />
      <div className="reviews-perspective">
        <motion.figure className="m-0" initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={reduce ? { show: { opacity: 1 } } : resenaReveal}>
          <ResenaImage resena={resena} />
        </motion.figure>
      </div>
      <div className="mt-4 text-center"><Link to="/testimonios" className={RESENA_LINK}>Ver más reseñas</Link></div>
    </div>
  </section>;
};