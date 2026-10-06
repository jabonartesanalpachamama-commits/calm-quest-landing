import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Imagen con revelado clip-path al entrar y parallax interno suave.
 * El disparador vive en el contenedor (el recorte oculta el elemento al IntersectionObserver).
 */
const GRAY = "grayscale(1) contrast(0.96) brightness(1.04)";
const COLOR = "grayscale(0) contrast(1) brightness(1)";

export const RevealImage = ({
  src, alt, className = "", imgClassName = "object-cover", eager = false, from = "bottom", colorize = false,
}: { src: string; alt: string; className?: string; imgClassName?: string; eager?: boolean; from?: "bottom" | "right"; colorize?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const hidden = from === "right" ? "inset(0% 0% 0% 100%)" : "inset(100% 0% 0% 0%)";
  const shown = reduce || inView;
  return (
    // El disparador vive en el contenedor externo: el clip-path del hijo lo ocultaría al IntersectionObserver.
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0"
        initial={reduce ? false : { clipPath: hidden }}
        animate={shown ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: hidden }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
        <motion.img src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined}
          initial={colorize && !reduce ? { filter: GRAY } : false}
          animate={colorize && !reduce ? { filter: shown ? COLOR : GRAY } : undefined}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
          style={reduce ? undefined : { y, scale: 1.1 }} className={`w-full h-full ${imgClassName}`} />
      </motion.div>
    </div>
  );
};

/** Filete dorado que se dibuja de izquierda a derecha (o de arriba abajo) ligado al scroll. */
export const DrawLine = ({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: vertical ? ["start 80%", "end 60%"] : ["start 95%", "start 60%"] });
  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <motion.div className={`w-full h-full bg-brand-gold ${vertical ? "origin-top" : "origin-left"}`}
        style={reduce ? undefined : vertical ? { scaleY: scrollYProgress } : { scaleX: scrollYProgress }} />
    </div>
  );
};
