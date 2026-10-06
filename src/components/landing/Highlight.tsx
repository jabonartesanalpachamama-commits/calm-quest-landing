import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Subrayado dorado fino (1 px) que se dibuja de izquierda a derecha la primera vez que la frase entra en pantalla.
 * Se pinta como fondo del propio texto (background-size 0 → 100 %), así nunca aparece una caja
 * antes de animarse y funciona aunque la frase se parta en varias líneas.
 */
export const Highlight = ({ children, delay = 0, className = "", viewportMargin = "-40px" }: { children: ReactNode; delay?: number; className?: string; viewportMargin?: string }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`inline ${className}`}
      style={{
        backgroundImage: "linear-gradient(hsl(var(--brand-gold)), hsl(var(--brand-gold)))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 100%",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
      initial={reduce ? { backgroundSize: "100% 1px" } : { backgroundSize: "0% 1px" }}
      whileInView={{ backgroundSize: "100% 1px" }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration: reduce ? 0 : 1.4, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      <span style={{ paddingBottom: "0.1em" }}>{children}</span>
    </motion.span>
  );
};

export default Highlight;
