import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Foto a todo el ancho con degradado a blanco arriba/abajo, parallax de 30 px y entrada fade + 14 px (estática con movimiento reducido). */
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
      className="relative w-full h-[110vw] max-h-[640px] md:h-[78vh] md:max-h-[760px] overflow-hidden bg-background">
      <motion.img src={src} alt={alt} loading="lazy" width={width} height={height} style={reduce ? undefined : { y }}
        className={`absolute inset-x-0 -top-[30px] w-full h-[calc(100%+60px)] object-cover ${position}`} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
    </motion.section>
  );
};

export default FullBleedPhoto;
