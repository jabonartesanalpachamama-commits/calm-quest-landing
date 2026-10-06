import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Foto a todo el ancho con degradado a blanco arriba/abajo, parallax de 30 px y entrada fade + 14 px (estática con movimiento reducido). */
const FADE = "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";

const FullBleedPhoto = ({ src, alt, label, width, height, position }: {
  src: string; alt: string; label: string; width: number; height: number; position: string;
}) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <motion.section ref={ref} aria-label={label}
      initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ WebkitMaskImage: FADE, maskImage: FADE }}
      className="relative w-full h-[60svh] md:h-[70svh] overflow-hidden bg-background">
      <motion.img src={src} alt={alt} loading="lazy" width={width} height={height} style={reduce ? undefined : { y }}
        className={`absolute inset-x-0 -top-[30px] w-full h-[calc(100%+60px)] object-cover ${position}`} />
    </motion.section>
  );
};

export default FullBleedPhoto;
