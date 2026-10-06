import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";

/** Círculo que respira (inhala/exhala 8 s): metáfora de regulación del sistema nervioso. */
export const BreathingCircle = ({ className = "", tone = "mauve" }: { className?: string; tone?: "mauve" | "gold" }) => {
  const reduce = useReducedMotion();
  const fill = tone === "gold"
    ? "radial-gradient(circle, hsl(var(--brand-gold)/0.28) 0%, hsl(var(--brand-gold)/0.08) 55%, transparent 72%)"
    : "radial-gradient(circle, hsl(var(--brand-mauve)/0.22) 0%, hsl(var(--warm-peach)/0.35) 45%, transparent 72%)";
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none rounded-full ${className}`}
      style={{ background: fill }}
      animate={reduce ? undefined : { scale: [0.85, 1.1, 0.85] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-[18%] rounded-full border border-brand-gold/40" />
    </motion.div>
  );
};

/** Palabra gigante en contorno dorado muy tenue; acepta un desplazamiento horizontal opcional. */
export const OutlineWord = ({ word, x, className = "" }: { word: string; x?: MotionValue<string>; className?: string }) => (
  <motion.span
    aria-hidden="true"
    style={{ x, WebkitTextStroke: "1px hsl(var(--brand-gold) / 0.35)" }}
    className={`pointer-events-none select-none whitespace-nowrap font-serif font-semibold leading-none text-transparent ${className}`}
  >
    {word}
  </motion.span>
);
