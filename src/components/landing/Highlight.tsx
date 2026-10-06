import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Marcador dorado (35 %) que barre de izquierda a derecha la primera vez que la frase entra en pantalla. */
export const Highlight = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline whitespace-normal ${className}`}>
      <motion.span
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-[0.06em] h-[0.42em] -z-0 origin-left rounded-sm bg-brand-gold/35"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
      />
      <span className="relative">{children}</span>
    </span>
  );
};

export default Highlight;
