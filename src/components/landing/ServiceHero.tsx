import type React from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDown, type LucideIcon } from "lucide-react";
import { fadeUp, RevealTitle } from "@/components/landing";

/** Hero partido 50/50 de las páginas de servicio (diagramación de /proceso-de-pareja; .lux quita pills y redondeos). */
const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";

type Props = {
  label: string;
  title: string;
  titleClassName?: string;
  children: ReactNode;
  meta: [LucideIcon, string][];
  primary: { text: string; target: string };
  secondary: { text: string; href: string };
};

const ServiceHero = ({ label, title, titleClassName = "text-4xl md:text-5xl lg:text-6xl", children, meta, primary, secondary }: Props) => {
  const go = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(primary.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section className="relative grid md:grid-cols-2">
      <div aria-hidden="true" className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-brand-gold z-10" />
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="bg-[#795D64] text-brand-cream px-6 py-14 md:px-12 lg:px-16 md:py-24 flex flex-col justify-center space-y-6">
        <motion.span variants={fadeUp} className="self-start px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-brand-cream/40 text-brand-cream">
          {label}
        </motion.span>
        <RevealTitle as="h1" text={title} className={`font-serif ${titleClassName} font-semibold leading-[1.1] text-brand-cream`} />
      </motion.div>
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        className="bg-brand-cream px-6 py-12 md:px-12 lg:px-16 md:py-24 flex flex-col justify-center space-y-6">
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
