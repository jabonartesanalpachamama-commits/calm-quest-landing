import { motion } from "framer-motion";
import { fadeUp, inView, RevealTitle } from "@/components/landing";

/** Situaciones en tarjetas numeradas (masonry), patrón común de las páginas de servicio. */
const SituationsGrid = ({ title, subtitle, items }: { title: string; subtitle?: string; items: string[] }) => (
  <section className="px-6 py-14 md:py-16">
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <RevealTitle text={title} className="font-serif text-3xl md:text-5xl font-semibold text-foreground" />
        {subtitle && <p className="text-muted-foreground font-light text-lg">{subtitle}</p>}
      </div>
      <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="columns-1 md:columns-2 gap-5">
        {items.map((item, i) => (
          <motion.li key={item} variants={fadeUp}
            className="group break-inside-avoid mb-5 flex items-start gap-5 rounded-3xl bg-card border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span className="font-serif text-4xl md:text-5xl leading-none text-brand-mauve">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-base md:text-lg text-foreground/90 leading-relaxed pt-1">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);

export default SituationsGrid;
