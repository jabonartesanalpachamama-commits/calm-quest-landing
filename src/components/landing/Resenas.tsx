import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE, fadeUp, RotatingOrnament } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { porIdsResena, RESENA_DIMENSIONS, type Resena } from "@/data/resenas";
import individual from "@/assets/fransury-individual.webp";
import pareja from "@/assets/pareja-manos.webp";
import parejaMobile from "@/assets/pareja-manos-900.webp";
import yoga from "@/assets/fransury-yoga-nueva.webp";

const photos = { individual, pareja, yoga };
const staticReveal = {
  hidden: { opacity: 0, filter: "blur(10px)", transform: "translate3d(60px,40px,-120px) rotateY(-22deg)" },
  show: { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0) rotateY(0deg)", transition: { duration: 1.2, ease: EASE } },
};

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

/** Immersive shared band; screenshots themselves are always unaltered. */
export const ResenaStatic = ({ id }: { id: string }) => {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const [resena] = porIdsResena([id]);
  if (!resena) return null;
  return <section ref={section} aria-label={`Reseña de ${resena.nombre}`} data-resena-static={id} data-review-category={resena.categoria} className="reviews-static reviews-theme relative isolate my-8 overflow-hidden bg-brand-ink px-6 py-12 text-brand-cream md:my-12 md:py-16">
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <motion.picture className="absolute -inset-y-6 inset-x-0" style={reduce ? undefined : { y }}>
        {resena.categoria === "pareja" && <source media="(max-width: 767px)" srcSet={parejaMobile} />}
        <img src={photos[resena.categoria]} alt="" loading="lazy" className="h-full w-full object-cover object-[50%_30%]" />
      </motion.picture>
      <div className={`absolute inset-0 ${resena.categoria === "pareja" ? "reviews-veil-pareja" : "reviews-veil"}`} />
    </div>
    {!reduce && <RotatingOrnament className="reviews-ornament reviews-static-ornament top-0 left-1/2 -translate-x-1/2 w-[min(86vw,560px)] aspect-square opacity-15" />}
    <div className="relative mx-auto max-w-4xl text-center">
      <motion.h2 className="reviews-static-title mx-auto max-w-[26ch] text-brand-cream"
        initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.16 } } }}>
        {["LO QUE DICEN MIS", "PACIENTES"].map((line) => <motion.span key={line} className="block" variants={reduce ? { show: { opacity: 1 } } : fadeUp}>{line}</motion.span>)}
      </motion.h2>
      <span aria-hidden="true" className="mx-auto my-6 block h-px w-16 bg-brand-gold/60" />
      <motion.p className="reviews-static-subtitle mx-auto max-w-[52ch] text-sm text-brand-cream/85 md:text-base"
        initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true }} variants={fadeUp}>Reseñas de Google de pacientes que ya hicieron su proceso conmigo.</motion.p>
      <div className="reviews-perspective mx-auto mt-8 max-w-[520px] md:mt-10">
        <motion.figure className="m-0" initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={reduce ? { show: { opacity: 1 } } : staticReveal}>
          <ResenaImage resena={resena} framed />
        </motion.figure>
      </div>
      <div className="mt-8 md:mt-10">
        <Button asChild variant="outline" className="h-auto rounded-none border-brand-cream bg-transparent px-9 py-4 text-xs uppercase tracking-normal text-brand-cream hover:bg-brand-cream hover:text-brand-ink focus-visible:ring-brand-cream">
          <Link to="/testimonios">Ver más reseñas</Link>
        </Button>
      </div>
    </div>
  </section>;
};