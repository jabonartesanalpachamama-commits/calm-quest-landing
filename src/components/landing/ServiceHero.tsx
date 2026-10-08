import type React from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDown, type LucideIcon } from "lucide-react";
import { fadeUp, RevealTitle } from "@/components/landing";

/** Hero partido 50/50 de las páginas de servicio: foto con velo plano y título a la izquierda, subtítulo + resumen a la derecha. */
const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";

type Props = {
  title: string;
  /** Línea fina opcional debajo del título (p. ej. «Sesiones 1 a 1 · Virtual»). */
  label?: string;
  subtitle?: string;
  image: { src: string; srcSet?: string; alt: string; width: number; height: number; position: string };
  titleClassName?: string;
  children: ReactNode;
  meta: [LucideIcon, string][];
  primary: { text: string; target: string };
  secondary: { text: string; href: string };
};

const ServiceHero = ({ title, label, subtitle, image, children, meta, primary, secondary }: Props) => {
  const go = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(primary.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section className="relative grid md:grid-cols-2">
      <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[560px] bg-[#482A3A]">
        <img src={image.src} srcSet={image.srcSet} sizes={image.srcSet ? "(min-width: 768px) 50vw, 100vw" : undefined}
          alt={image.alt} width={image.width} height={image.height} loading="eager"
          className={`absolute inset-0 w-full h-full object-cover ${image.position}`} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#482A3A] opacity-[0.35]" />
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-12 lg:px-16 md:pb-14 space-y-3">
          <RevealTitle as="h1" text={title}
            className="font-serif text-[2rem] md:text-[clamp(2rem,4.2vw,4.25rem)] font-semibold leading-[1.1] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]" />
          {label && (
            <motion.p variants={fadeUp} className="text-[11px] tracking-[0.3em] uppercase text-white/90">{label}</motion.p>
          )}
        </motion.div>
      </div>
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        className="bg-brand-cream px-6 py-12 md:px-12 lg:px-16 md:py-20 flex flex-col justify-center space-y-6">
        {subtitle && (
          <motion.div variants={fadeUp} className="space-y-4">
            <p className="font-serif font-light text-[clamp(1.35rem,2vw,1.9rem)] leading-snug text-[#482A3A]">{subtitle}</p>
            <span aria-hidden="true" className="block w-12 h-px bg-brand-gold" />
          </motion.div>
        )}
        <motion.div variants={fadeUp} className="text-lg text-foreground/85 leading-relaxed font-light space-y-4">
          {children}
        </motion.div>
        <motion.ul variants={fadeUp} className="flex flex-wrap gap-2 text-sm">
          {meta.map(([Icon, text]) => (
            <li key={text} className={PILL}><Icon className="w-4 h-4 text-primary" /> {text}</li>
          ))}
        </motion.ul>
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
          <a href={primary.target} onClick={go} className={BTN_SOLID + " group"}>
            {primary.text}
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
          </a>
          <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#795D64] underline decoration-brand-gold underline-offset-4 hover:opacity-80">
            {secondary.text}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServiceHero;
