import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, fadeUp, RevealTitle } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { RESENAS, CATEGORIAS_RESENAS, RESENA_DIMENSIONS, type Resena } from "@/data/resenas";
import individual from "@/assets/fransury-individual.webp";
import pareja from "@/assets/pareja-manos.webp";
import parejaMobile from "@/assets/pareja-manos-900.webp";
import yoga from "@/assets/fransury-yoga-nueva.webp";

import DepthCarousel from "@/components/reactbits/DepthCarousel";
import GradualBlur from "@/components/reactbits/GradualBlur";

const photos = { individual, pareja, yoga };
export const RESENA_LINK = "inline-flex min-h-11 items-center border-b border-brand-gold text-brand-mauve text-xs uppercase tracking-normal hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mauve focus-visible:ring-offset-4";

export const resenaReveal = {
  hidden: { opacity: 0, filter: "blur(10px)", transform: "translate3d(0,50px,-120px) rotateX(4deg)" },
  show: { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0) rotateX(0deg)", transition: { duration: 1.2, ease: EASE } },
};

export const ResenaImage = ({ resena, framed = false, loading = "lazy" }: { resena: Resena; framed?: boolean; loading?: "lazy" | "eager" }) => {
  const dimensions = RESENA_DIMENSIONS[resena.id];
  if (!dimensions) return null;
  const image = <img src={resena.img} alt={`Reseña de Google de ${resena.nombre} sobre Fransury González`}
    loading={loading} decoding="async" width={dimensions.width} height={dimensions.height}
    className={framed ? "block h-full w-full object-contain" : "block w-full h-auto"} />;
  return framed ? <div className="reviews-capture">{image}</div> : image;
};

/** Shared depth review band; initial review selection stays page-specific. */
export const ResenaStatic = ({ id }: { id: string }) => {
  const reduce = useReducedMotion();
  const initialIndex = Math.max(0, RESENAS.findIndex(r => r.id === id));
  const [active, setActive] = useState(initialIndex);
  const category = RESENAS[active]?.categoria ?? "individual";
  return <section aria-label="Reseñas de Google" data-resena-static={id} data-review-category={category} className="reviews-static reviews-theme relative isolate overflow-hidden text-brand-cream">
    <div className={`reviews-soft-transition relative ${id === "luii-gomez" ? "reviews-home-transition" : ""}`} aria-hidden="true">
      {!reduce && <GradualBlur height="100%" strength={.25} layers={4} zIndex={1} />}
    </div>
    <div className="relative isolate px-3 py-12 md:px-6 md:py-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        {CATEGORIAS_RESENAS.map(({ id: key }) => <motion.picture key={key} data-band-background={key} className="absolute inset-0" initial={false} animate={{ opacity: category === key ? 1 : 0 }} transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}>
          {key === "pareja" && <source media="(max-width: 767px)" srcSet={parejaMobile} />}
          <img src={photos[key]} alt="" loading="lazy" className="reviews-band-photo h-full w-full object-cover object-[50%_30%]" />
        </motion.picture>)}
        <div className="reviews-band-veil absolute inset-0" />
        <div className="reviews-band-top absolute inset-x-0 top-0 h-32" />
      </div>
      <div className="relative mx-auto max-w-[960px] text-center">
        <RevealTitle text="LO QUE DICEN MIS PACIENTES" className="reviews-static-title mx-auto max-w-[26ch] text-brand-cream" />
        <p className="reviews-static-subtitle mx-auto mt-6 max-w-[52ch] text-sm text-brand-cream md:text-base">Reseñas de Google de pacientes que ya hicieron su proceso conmigo.</p>
        <motion.div className="mt-8 md:mt-10" initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: .15 }} variants={fadeUp}>
          <DepthCarousel initialIndex={initialIndex} onChange={setActive} items={RESENAS.map((resena, index) => ({ id: resena.id, label: `Reseña de ${resena.nombre}`, content: <ResenaImage resena={resena} framed loading={index === initialIndex ? "eager" : "lazy"} /> }))} />
        </motion.div>
        {id !== "all" && <div className="mt-8 md:mt-10"><Button asChild variant="outline" className="h-auto rounded-none border-brand-cream bg-transparent px-9 py-4 text-xs uppercase tracking-normal text-brand-cream hover:bg-brand-cream hover:text-brand-ink focus-visible:ring-brand-cream"><Link to="/testimonios">Ver más reseñas</Link></Button></div>}
      </div>
    </div>
  </section>;
};
