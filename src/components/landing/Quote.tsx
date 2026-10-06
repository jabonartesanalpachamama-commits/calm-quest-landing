import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, inView } from "./index";

/**
 * Cita sobria (lenguaje editorial): frase en mayúsculas de trazo fino, centrada, con filetes dorados.
 * `variant` se conserva por compatibilidad pero todas se ven igual, salvo "lux-band":
 * la banda de frase de la portada (más aire, trazo más fino, filete que se dibuja, firma pequeña).
 */
export const Quote = ({
  children, cite, variant,
}: { variant?: "band" | "side" | "ornament" | "lux-band"; children: ReactNode; cite?: string }) => variant === "lux-band" ? (
  <section className="bg-brand-cream px-6 py-24 md:py-40 text-center">
    <motion.figure {...inView} variants={fadeUp} className="max-w-4xl mx-auto">
      <motion.span aria-hidden="true" className="block mx-auto w-12 h-px bg-brand-gold mb-12 origin-left"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
      <blockquote className="font-serif font-light uppercase tracking-[0.2em] text-xl md:text-[1.75rem] leading-[1.6] text-foreground">{children}</blockquote>
      {cite && <figcaption className="mt-10 text-[11px] tracking-[0.3em] uppercase text-muted-foreground max-w-xl mx-auto leading-relaxed">{cite}</figcaption>}
    </motion.figure>
  </section>
) : (
  <section className="bg-brand-cream px-6 py-20 md:py-32">
    <motion.figure {...inView} variants={fadeUp} className="max-w-3xl mx-auto text-center">
      <span aria-hidden="true" className="block mx-auto w-12 h-px bg-brand-gold mb-10" />
      <blockquote className="font-serif uppercase tracking-[0.14em] text-xl md:text-[1.75rem] leading-[1.7] text-foreground">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-8 text-[11px] tracking-[0.3em] uppercase text-muted-foreground">{cite}</figcaption>}
      <span aria-hidden="true" className="block mx-auto w-12 h-px bg-brand-gold mt-10" />
    </motion.figure>
  </section>
);

export default Quote;
