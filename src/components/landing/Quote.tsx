import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, inView } from "./index";

/**
 * Cita sobria (lenguaje editorial): frase en mayúsculas de trazo fino, centrada, con filetes dorados.
 * `variant` se conserva por compatibilidad pero todas las variantes se ven igual.
 */
export const Quote = ({
  children, cite,
}: { variant?: "band" | "side" | "ornament"; children: ReactNode; cite?: string }) => (
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
