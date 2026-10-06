import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Imagen con revelado clip-path al entrar y parallax interno suave.
 * El disparador vive en el contenedor (el recorte oculta el elemento al IntersectionObserver).
 */
export const RevealImage = ({
  src, alt, className = "", imgClassName = "object-cover", eager = false, from = "bottom",
}: { src: string; alt: string; className?: string; imgClassName?: string; eager?: boolean; from?: "bottom" | "right" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const hidden = from === "right" ? "inset(0% 0% 0% 100%)" : "inset(100% 0% 0% 0%)";
  return (
    <motion.div ref={ref} className={`overflow-hidden ${className}`}
      initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: { clipPath: hidden }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } } }}>
      <motion.img src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined}
        style={reduce ? undefined : { y, scale: 1.1 }} className={`w-full h-full ${imgClassName}`} />
    </motion.div>
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
