import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/landing";
import { porIdsResena, RESENA_DIMENSIONS, type Resena } from "@/data/resenas";

export const RESENA_LINK = "inline-flex min-h-11 items-center border-b border-brand-gold text-brand-mauve text-xs uppercase tracking-normal hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mauve focus-visible:ring-offset-4";

export const resenaReveal = {
  hidden: { opacity: 0, filter: "blur(10px)", transform: "translate3d(0,50px,-120px) rotateX(4deg)" },
  show: { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0) rotateX(0deg)", transition: { duration: 1.2, ease: EASE } },
};

export const ResenaImage = ({ resena, framed = false }: { resena: Resena; framed?: boolean }) => {
  const dimensions = RESENA_DIMENSIONS[resena.id];
  if (!dimensions) return null;
  return <img src={resena.img} alt={`Reseña de Google de ${resena.nombre} sobre Fransury González`}
    loading="lazy" decoding="async" width={dimensions.width} height={dimensions.height}
    className={`block w-full h-auto ${framed ? "resena-capture" : ""}`} />;
};

/** Compact and entirely static on the service pages. */
export const ResenaStatic = ({ id }: { id: string }) => {
  const [resena] = porIdsResena([id]);
  if (!resena) return null;
  return <section aria-label={`Reseña de ${resena.nombre}`} data-resena-static={id} className="bg-background px-6 py-10">
    <div className="max-w-[520px] mx-auto">
      <ResenaImage resena={resena} />
      <div className="mt-4 text-center"><Link to="/testimonios" className={RESENA_LINK}>Ver más reseñas</Link></div>
    </div>
  </section>;
};

export const ResenaScroll = ({ resena, index }: { resena: Resena; index: number }) => {
  const reduce = useReducedMotion();
  return <li data-resena={resena.id} className={`flex items-center py-3 md:py-4 ${index % 2 ? "md:justify-end" : "md:justify-start"}`}>
    <motion.figure className="w-full max-w-[560px] mx-auto md:mx-0 m-0"
      initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.15 }}
      variants={reduce ? { show: { opacity: 1 } } : resenaReveal}>
      <ResenaImage resena={resena} framed />
    </motion.figure>
  </li>;
};