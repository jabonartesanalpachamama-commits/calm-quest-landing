import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { EASE, fadeUp, RevealTitle } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { RESENAS, RESENA_DIMENSIONS, type Resena } from "@/data/resenas";

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

/** One literal text review at a time; no autoplay, photos, depth or hidden side cards. */
export const ResenaStatic = ({ id }: { id: string }) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(Math.max(0, RESENAS.findIndex(r => r.id === id)));
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const review = RESENAS[active];
  if (!review) return null;
  const move = (delta: number) => setActive(index => (index + delta + RESENAS.length) % RESENAS.length);
  return <section aria-label="Reseñas de Google" data-resena-static={id} className="lux reviews-static px-5 py-20 md:px-6 md:py-28">
    <div className="mx-auto max-w-[720px]">
      <span aria-hidden="true" className="mx-auto mb-12 block h-px w-16 bg-brand-gold" />
      <RevealTitle text="LO QUE DICEN MIS PACIENTES" className="reviews-static-title text-center text-brand-ink" />
      <p className="mt-5 text-center text-sm text-brand-mauve">Experiencias compartidas en Google.</p>
      <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: .15 }} variants={fadeUp} className="mt-10">
        <div role="region" aria-roledescription="carrusel" aria-label="Opiniones de pacientes" tabIndex={0}
          className="reviews-text-stage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4"
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
            if (event.key === 'Home') { event.preventDefault(); setActive(0); }
            if (event.key === 'End') { event.preventDefault(); setActive(RESENAS.length - 1); }
          }}
          onPointerDown={event => { if (event.pointerType === 'touch') pointer.current = { x: event.clientX, y: event.clientY }; }}
          onPointerCancel={() => { pointer.current = null; }}
          onPointerUp={event => {
            const start = pointer.current; pointer.current = null;
            if (!start) return;
            const dx = event.clientX - start.x, dy = event.clientY - start.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
          }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={review.id} aria-roledescription="diapositiva" aria-label={`${active + 1} de ${RESENAS.length}: ${review.nombre}`}
              initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 1 } : { opacity: 0, x: -12 }} transition={{ duration: reduce ? 0 : .35, ease: EASE }}
              className="reviews-text-card border border-border bg-card p-6 text-brand-ink md:p-10">
              <div aria-label={`${review.estrellas} de 5 estrellas`} className="mb-6 flex gap-1 text-brand-gold">
                {Array.from({ length: review.estrellas }, (_, index) => <Star key={index} aria-hidden="true" className="h-5 w-5 fill-current" />)}
              </div>
              <p className="review-literal whitespace-pre-line break-words">{review.texto}</p>
              <p className="mt-8 text-sm font-medium">{review.nombre}</p>
              <p className="mt-1 text-xs text-brand-mauve">Reseña de Google, hace {review.antiguedad}</p>
            </motion.article>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <Button type="button" variant="outline" size="icon" aria-label="Reseña anterior" className="review-arrow" onClick={() => move(-1)}><ArrowLeft aria-hidden="true" className="h-5 w-5" /></Button>
          <span role="status" aria-live="polite" aria-atomic="true" className="min-w-16 text-center text-sm tabular-nums text-brand-mauve">{active + 1} / {RESENAS.length}</span>
          <Button type="button" variant="outline" size="icon" aria-label="Reseña siguiente" className="review-arrow" onClick={() => move(1)}><ArrowRight aria-hidden="true" className="h-5 w-5" /></Button>
        </div>
      </motion.div>
      {id !== 'all' && <div className="mt-8 text-center"><Link to="/testimonios" className={RESENA_LINK}>Ver más reseñas</Link></div>}
    </div>
  </section>;
};
