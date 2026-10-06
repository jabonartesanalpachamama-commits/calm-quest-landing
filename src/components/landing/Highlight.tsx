import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Marcador dorado (35 %) que barre de izquierda a derecha la primera vez que la frase entra en pantalla.
 * Se pinta como fondo del propio texto (background-size 0 → 100 %), así nunca aparece una caja
 * antes de animarse y funciona aunque la frase se parta en varias líneas.
 */
export const Highlight = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`inline ${className}`}
      style={{
        backgroundImage: "linear-gradient(hsl(var(--brand-gold) / 0.35), hsl(var(--brand-gold) / 0.35))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 88%",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
      initial={reduce ? { backgroundSize: "100% 0.35em" } : { backgroundSize: "0% 0.35em" }}
      whileInView={{ backgroundSize: "100% 0.35em" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduce ? 0 : 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.span>
  );
};

export default Highlight;
