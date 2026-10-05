import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, inView, RotatingOrnament } from "./index";

/** Cita con tres presentaciones para no repetir el mismo patrón entre páginas. */
export const Quote = ({
  variant = "side", children, cite,
}: { variant?: "band" | "side" | "ornament"; children: ReactNode; cite?: string }) => {
  if (variant === "band") {
    return (
      <section className="bg-brand-ink text-brand-cream px-6 py-14 md:py-20">
        <motion.figure {...inView} variants={fadeUp} className="max-w-4xl mx-auto text-center">
          <span aria-hidden="true" className="block font-serif text-7xl leading-none text-brand-gold">“</span>
          <blockquote className="font-serif text-2xl md:text-4xl leading-snug">{children}</blockquote>
          {cite && <figcaption className="mt-5 text-sm tracking-widest uppercase text-brand-cream/80">{cite}</figcaption>}
        </motion.figure>
      </section>
    );
  }
  if (variant === "ornament") {
    return (
      <section className="relative overflow-hidden px-6 py-14 md:py-16 bg-gradient-to-b from-background via-warm-mauve/30 to-background">
        <RotatingOrnament className="w-64 h-64 -right-16 -top-10 opacity-60" />
        <motion.figure {...inView} variants={fadeUp} className="relative max-w-3xl mx-auto text-center">
          <blockquote className="font-serif text-2xl md:text-3xl italic text-foreground leading-snug">{children}</blockquote>
          {cite && <figcaption className="mt-4 text-sm text-muted-foreground">{cite}</figcaption>}
        </motion.figure>
      </section>
    );
  }
  return (
    <motion.figure {...inView} variants={fadeUp} className="max-w-3xl mx-auto my-10 px-6">
      <div className="border-l-4 border-brand-gold pl-6 py-2">
        <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed">{children}</blockquote>
        {cite && <figcaption className="mt-3 text-sm text-muted-foreground">{cite}</figcaption>}
      </div>
    </motion.figure>
  );
};

export default Quote;
