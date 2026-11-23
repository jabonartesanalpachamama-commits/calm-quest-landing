import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EASE, fadeUp, RevealTitle } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { FEATURED_RESENAS, agruparResenas } from "@/data/resenas";

import { ReviewCapture } from "./ReviewCapture";

export const RESENA_LINK = "inline-flex min-h-11 items-center border-b border-brand-gold text-brand-mauve text-xs uppercase tracking-normal hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mauve focus-visible:ring-offset-4";

export const resenaReveal = {
  hidden: { opacity: 0, filter: "blur(10px)", transform: "translate3d(0,50px,-120px) rotateX(4deg)" },
  show: { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0) rotateX(0deg)", transition: { duration: 1.2, ease: EASE } },
};

export { ResenaImage } from "./ReviewCapture";

/** Four original captures, no autoplay or selected side cards. */
export const ResenaStatic = ({ id }: { id: string }) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const review = FEATURED_RESENAS[active];
  if (!review) return null;
  const move = (delta: number) => setActive(index => (index + delta + FEATURED_RESENAS.length) % FEATURED_RESENAS.length);
  return <section aria-label="Reseñas de Google" data-resena-static={id} className="lux reviews-static px-5 py-20 md:px-6 md:py-28">
    <div className="mx-auto max-w-[720px]">
      <RevealTitle text="LO QUE DICEN MIS PACIENTES" className="reviews-static-title text-center text-brand-ink" />
      <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: .15 }} variants={fadeUp} className="mt-10">
        <div role="region" aria-roledescription="carrusel" aria-label="Opiniones de pacientes" tabIndex={0}
          className="reviews-capture-stage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4"
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
            if (event.key === 'Home') { event.preventDefault(); setActive(0); }
            if (event.key === 'End') { event.preventDefault(); setActive(FEATURED_RESENAS.length - 1); }
          }}
          onClickCapture={event => { if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; } }}
          onPointerDown={event => {
            swiped.current = false;
            if (event.pointerType === 'touch') pointer.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerCancel={() => { pointer.current = null; }}
          onPointerUp={event => {
            const start = pointer.current; pointer.current = null;
            if (!start) return;
            const dx = event.clientX - start.x, dy = event.clientY - start.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; move(dx < 0 ? 1 : -1); }
          }}>
          <motion.div key={review.id}
            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : .35, ease: EASE }}>
            <ReviewCapture resena={review} />
          </motion.div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <Button type="button" variant="outline" size="icon" aria-label="Reseña anterior" className="review-arrow" onClick={() => move(-1)}><ArrowLeft aria-hidden="true" className="h-5 w-5" /></Button>
          <span role="status" aria-live="polite" aria-atomic="true" className="min-w-16 text-center text-sm tabular-nums text-brand-mauve">{active + 1} / {FEATURED_RESENAS.length}</span>
          <Button type="button" variant="outline" size="icon" aria-label="Reseña siguiente" className="review-arrow" onClick={() => move(1)}><ArrowRight aria-hidden="true" className="h-5 w-5" /></Button>
        </div>
      </motion.div>
      <div className="mt-8 text-center"><Button asChild variant="outline" className="rounded-none border-brand-ink bg-transparent text-brand-ink"><Link to="/testimonios">VER MÁS RESEÑAS</Link></Button></div>
    </div>
  </section>;
};

export const ResenasGallery = () => {
  const reduce = useReducedMotion();
  return <section className="lux reviews-static px-5 py-20 md:px-6 md:py-28" aria-label="Todas las reseñas de Google">
    <div className="mx-auto max-w-[720px] space-y-16">
      {agruparResenas().map(category => <div key={category.id}>
        <RevealTitle text={category.titulo} className="reviews-category mb-10 text-center text-brand-ink" />
        <div className="space-y-10">{category.resenas.map(review => <motion.div key={review.id}
          initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: .1 }} variants={fadeUp}>
          <ReviewCapture resena={review} />
        </motion.div>)}</div>
      </div>)}
    </div>
  </section>;
};
