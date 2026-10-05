import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Kit visual compartido para landings (copiado del lenguaje de Sabiduría Cíclica). */

export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const inView = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-60px" },
};

export const HERO_IMAGE_FILTER = "saturate(0.85) brightness(1.04) contrast(0.95)";

/** Título que aparece palabra por palabra */
export const RevealTitle = ({ text, as = "h2", className = "" }: { text: string; as?: "h1" | "h2"; className?: string }) => {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block mr-[0.25em]"
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
        >
          {w}
        </motion.span>
      ))}
    </Tag>
  );
};

/** Texto que aparece palabra por palabra (opcional: desenfoque a nitidez) */
export const RevealWords = ({
  text, className = "", blur = false, stagger = 0.06, as = "p",
}: { text: string; className?: string; blur?: boolean; stagger?: number; as?: "p" | "h2" }) => {
  const Tag = as === "h2" ? motion.h2 : motion.p;
  const hidden = blur ? { opacity: 0, filter: "blur(6px)", y: 6 } : { opacity: 0, y: 12 };
  const show = blur ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 1, y: 0 };
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span key={i} aria-hidden="true" className="inline-block mr-[0.25em]"
          variants={{ hidden, show: { ...show, transition: { duration: blur ? 0.9 : 0.5, ease: EASE } } }}>{w}</motion.span>
      ))}
    </Tag>
  );
};

/** Círculos punteados dorado y malva que giran muy lento */
export const RotatingOrnament = ({ className = "" }: { className?: string }) => (
  <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
    <motion.svg viewBox="0 0 200 200" className="w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#B8977E" strokeWidth="0.8" strokeDasharray="2 7" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#795D64" strokeWidth="0.5" strokeOpacity="0.6" />
      <circle cx="100" cy="10" r="5" fill="#B8977E" fillOpacity="0.7" />
      <circle cx="30" cy="100" r="3" fill="#795D64" fillOpacity="0.5" />
    </motion.svg>
  </div>
);

const TONES = {
  plain: "",
  mauve: "bg-gradient-to-b from-background via-warm-mauve/30 to-background",
  peach: "bg-gradient-to-b from-background via-warm-peach/50 to-background",
};

export const LandingSection = ({
  id, tone = "plain", className = "", children,
}: { id?: string; tone?: keyof typeof TONES; className?: string; children: ReactNode }) => (
  <section id={id} className={`relative py-12 md:py-16 px-6 scroll-mt-20 ${TONES[tone]} ${className}`}>
    {children}
  </section>
);

/** Hero con imagen que sangra a la izquierda en desktop */
export const SplitHero = ({ image, alt, children }: { image: string; alt: string; children: ReactNode }) => (
  <section className="relative pt-0 pb-12 md:pb-0 px-4 md:px-0 bg-gradient-to-b from-card via-card to-background overflow-hidden">
    <div className="relative max-w-6xl md:max-w-none mx-auto grid md:grid-cols-[53%_1fr] gap-10 items-center">
      <div className="relative -mx-4 md:mx-0 md:self-start">
        <div className="relative overflow-hidden aspect-square ciclica-hero-bleed">
          <img
            src={image}
            alt={alt}
            loading="eager"
            fetchPriority="high"
            style={{ filter: HERO_IMAGE_FILTER }}
            className="absolute inset-0 w-full h-full object-cover object-center block"
          />
        </div>
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-5 text-center md:text-left md:pr-8 lg:pr-12 md:py-10 md:max-w-xl"
      >
        {children}
      </motion.div>
    </div>
  </section>
);

interface PriceCardProps {
  title: string;
  price: string;
  description: ReactNode;
  href: string;
  cta: ReactNode;
  badge?: string;
}

export const PriceCard = ({ title, price, description, href, cta, badge }: PriceCardProps) => (
  <motion.div variants={fadeUp} className="relative bg-[#795D64] text-white rounded-3xl p-6 md:p-7 shadow-lg flex flex-col text-center h-full">
    {badge && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-gold text-brand-ink text-[10px] font-bold uppercase tracking-widest shadow-sm whitespace-nowrap">
        {badge}
      </span>
    )}
    <h3 className="font-serif text-2xl font-semibold mt-2">{title}</h3>
    <p className="mt-3 flex items-baseline justify-center gap-1.5">
      <span className="text-5xl font-bold">{price}</span>
      <span className="text-sm font-semibold">USD</span>
    </p>
    <div className="mt-4 text-sm leading-relaxed text-white flex-grow space-y-3">{description}</div>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 block w-full py-3.5 px-4 text-center rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-brand-cream text-brand-ink hover:bg-brand-cream/90"
    >
      {cta}
    </a>
  </motion.div>
);

export const PriceCardLight = ({ title, price, description, href, cta }: PriceCardProps) => (
  <motion.div variants={fadeUp} className="relative bg-card border border-border/40 rounded-3xl p-6 md:p-7 flex flex-col text-center h-full">
    <h3 className="font-serif text-2xl font-semibold text-foreground mt-2">{title}</h3>
    <p className="mt-3 flex items-baseline justify-center gap-1.5 text-foreground">
      <span className="text-4xl font-bold">{price}</span>
      <span className="text-sm font-semibold">USD</span>
    </p>
    <div className="mt-4 text-sm leading-relaxed text-muted-foreground flex-grow space-y-3">{description}</div>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 block w-full py-3.5 px-4 text-center rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#795D64] hover:bg-[#6A5057] text-white"
    >
      {cta}
    </a>
  </motion.div>
);
