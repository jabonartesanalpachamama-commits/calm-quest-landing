import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Foto a todo el ancho con degradado a blanco arriba/abajo, parallax de 30 px y entrada fade + 14 px (estática con movimiento reducido).
 *  `desktop` (opcional): recorte horizontal para md+ sobre un fondo del mismo tono que la foto, con bordes laterales fundidos;
 *  sirve para fotos verticales que en una franja ancha quedarían demasiado recortadas. */
const FADE = "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";
const SIDE_FADE = "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)";

type Desktop = { src: string; width: number; height: number; background: string };

const FullBleedPhoto = ({ src, srcSet, alt, label, width, height, position, desktop }: {
  src: string; srcSet?: string; alt: string; label: string; width: number; height: number; position: string; desktop?: Desktop;
}) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const motionStyle = reduce ? undefined : { y };
  return (
    <motion.section ref={ref} aria-label={label}
      initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ WebkitMaskImage: FADE, maskImage: FADE }}
      className="relative w-full h-[60svh] md:h-[70svh] overflow-hidden bg-background">
      <motion.img src={src} srcSet={srcSet} sizes={srcSet ? "100vw" : undefined} alt={alt} loading="lazy" width={width} height={height} style={motionStyle}
        className={`absolute inset-x-0 -top-[30px] w-full h-[calc(100%+60px)] object-cover ${position} ${desktop ? "md:hidden" : ""}`} />
      {desktop && (
        <div aria-hidden="true" className="hidden md:flex absolute inset-0 justify-center" style={{ background: desktop.background }}>
          <motion.img src={desktop.src} alt="" loading="lazy" width={desktop.width} height={desktop.height}
            style={{ ...motionStyle, WebkitMaskImage: SIDE_FADE, maskImage: SIDE_FADE }}
            className="relative -top-[30px] h-[calc(100%+60px)] w-auto max-w-none shrink-0" />
        </div>
      )}
    </motion.section>
  );
};

export default FullBleedPhoto;
