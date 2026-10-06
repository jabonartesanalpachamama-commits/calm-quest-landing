import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Filete dorado de 2 px bajo el encabezado que se llena con el scroll de la página. */
export const ScrollProgress = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  return (
    <motion.div aria-hidden="true" style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] origin-left bg-brand-gold" />
  );
};

export default ScrollProgress;
