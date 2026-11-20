import { useId } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { porIds } from "@/data/testimonios";
import { EASE, fadeUp, inView } from "@/components/landing";

export const TESTIMONIOS_LABEL = "block text-[10px] uppercase tracking-[0.35em] text-brand-mauve";
export const EDITORIAL_FOCUS = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-mauve focus-visible:ring-offset-4";
export const EDITORIAL_LINK = `inline-flex items-center min-h-11 text-[11px] uppercase tracking-[0.3em] text-brand-mauve border-b border-brand-gold/60 pb-1 hover:border-brand-mauve transition-colors duration-500 ${EDITORIAL_FOCUS}`;

/** Same drawing pattern as the home page, with a static reduced-motion state. */
export const Rule = ({ className = "" }: { className?: string }) => {
  const reduce = useReducedMotion();
  return <motion.span aria-hidden="true" className={`block h-px w-12 bg-brand-gold origin-left ${className}`}
    initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
    transition={{ duration: reduce ? 0 : 1.6, ease: EASE }} />;
};

type TestimoniosBlockProps = { ids: string[]; titulo?: string; etiqueta?: string; verMas?: boolean; id?: string };

export const TestimoniosBlock = ({ ids, titulo = "En sus palabras", etiqueta = "Testimonios", verMas = false, id }: TestimoniosBlockProps) => {
  const headingId = useId();
  const reduce = useReducedMotion();
  const testimonios = porIds(ids);
  return (
    <section id={id} aria-labelledby={headingId} className="bg-background px-6 py-24 md:py-40 scroll-mt-28">
      <div className="max-w-5xl mx-auto [container-type:inline-size]">
        <motion.div {...inView} initial={reduce ? false : inView.initial} variants={fadeUp} className="mb-14 md:mb-20">
          {etiqueta && <p className={TESTIMONIOS_LABEL}>{etiqueta}</p>}
          <h2 id={headingId} className="mt-6 text-foreground">{titulo}</h2>
          <Rule className="mt-8" />
        </motion.div>
        <motion.div {...inView} initial={reduce ? false : inView.initial}
          variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.12 } } }} className="border-t border-border">
          {testimonios.map((testimonio) => (
            <motion.blockquote key={testimonio.id} data-testimonio={testimonio.id} variants={fadeUp}
              className="m-0 grid md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 border-b border-border">
              <cite className="block not-italic md:col-span-4 min-w-0">
                <span className="block text-[11px] font-light uppercase tracking-[0.3em] text-brand-ink leading-relaxed break-words">{testimonio.nombre}</span>
                {testimonio.pais && <span className="block mt-3 text-[10px] uppercase tracking-[0.3em] text-brand-mauve leading-relaxed">{testimonio.pais}</span>}
              </cite>
              <div className={`md:col-span-8 min-w-0 font-serif font-light leading-[1.6] text-foreground space-y-6 break-words ${testimonio.parrafos.join(" ").length > 400 ? "text-[clamp(17px,2cqi,20px)]" : "text-[clamp(17px,2.4cqi,24px)]"}`}>
                {testimonio.parrafos.map((parrafo, i) => <p key={i} className="!leading-[1.6]">{parrafo}</p>)}
              </div>
            </motion.blockquote>
          ))}
        </motion.div>
        {verMas && <div className="mt-12 md:mt-16"><Link to="/testimonios" className={EDITORIAL_LINK}>Leer más historias</Link></div>}
      </div>
    </section>
  );
};