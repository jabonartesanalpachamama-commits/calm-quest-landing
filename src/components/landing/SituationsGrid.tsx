import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, inView, RevealTitle } from "@/components/landing";

/** Situaciones en tarjetas numeradas (masonry), patrón común de las páginas de servicio. */
const SituationsGrid = ({ title, subtitle, items, compact = false }: { title: string; subtitle?: string; items: string[]; compact?: boolean }) => {
  const reduce = useReducedMotion();
  return (
  <section data-situations={compact ? "compact" : "cards"} className={compact ? "compact-situations px-6 py-8 md:py-12" : "px-6 py-14 md:py-16"}>
    <div className={`max-w-5xl mx-auto ${compact ? "space-y-5" : "space-y-10"}`}>
      <div className="text-center space-y-3">
        <RevealTitle text={title} className="font-serif text-3xl md:text-5xl font-semibold text-foreground" />
        {subtitle && <p className="text-muted-foreground font-light text-lg">{subtitle}</p>}
      </div>
      <motion.ul {...inView} initial={reduce ? false : "hidden"} variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.04 } } }} className={compact ? "grid md:grid-cols-2 gap-x-10" : "columns-1 md:columns-2 gap-5"}>
        {items.map((item, i) => (
          <motion.li key={item} variants={fadeUp}
            className={compact ? "compact-situation-row" : "group break-inside-avoid mb-5 flex items-start gap-5 rounded-3xl bg-card border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"}>
            <motion.span initial={false} whileInView={compact && !reduce ? { opacity: [0.55, 1] } : undefined} viewport={{ once: true }} transition={{ duration: .8 }} className={compact ? "compact-situation-number text-brand-mauve" : "font-serif text-4xl md:text-5xl leading-none text-brand-mauve"}>
              {String(i + 1).padStart(2, "0")}
            </motion.span>
            <span className={compact ? "compact-situation-text text-foreground" : "text-base md:text-lg text-foreground/90 leading-relaxed pt-1"}>{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);
};

export default SituationsGrid;
