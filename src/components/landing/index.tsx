import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Kit visual compartido para landings (copiado del lenguaje de Sabiduría Cíclica). */

export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
};

export const inView = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-60px" },
};

export const HERO_IMAGE_FILTER = "saturate(0.85) brightness(1.04) contrast(0.95)";

/** Título que aparece con un fundido suave y 14 px de desplazamiento (lenguaje editorial). */
export const RevealTitle = ({ text, as = "h2", className = "" }: { text: string; as?: "h1" | "h2"; className?: string }) => {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return <Tag className={className} {...inView} variants={fadeUp}>{text}</Tag>;
};

/** Párrafo que aparece completo con un fundido suave (ya no palabra por palabra). */
export const RevealWords = ({
  text, className = "", as = "p",
}: { text: string; className?: string; blur?: boolean; stagger?: number; as?: "p" | "h2" }) => {
  const Tag = as === "h2" ? motion.h2 : motion.p;
  return <Tag className={className} {...inView} variants={fadeUp}>{text}</Tag>;
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
  mauve: "bg-brand-cream",
  peach: "bg-brand-cream",
};

export const LandingSection = ({
  id, tone = "plain", className = "", children,
}: { id?: string; tone?: keyof typeof TONES; className?: string; children: ReactNode }) => (
  <section id={id} className={`relative py-12 md:py-16 px-6 scroll-mt-20 ${TONES[tone]} ${className}`}>
    {children}
  </section>
);

/** Hero con imagen que sangra a la izquierda en desktop */
export const SplitHero = ({ image, alt, children, imagePosition, imageClassName = "object-center", maskClassName = "ciclica-hero-bleed" }: { image: string; alt: string; children: ReactNode; imagePosition?: string; imageClassName?: string; maskClassName?: string }) => (
  <section className="relative pt-0 pb-12 md:pb-0 px-4 md:px-0 bg-background overflow-hidden">
    <div className="relative max-w-6xl md:max-w-none mx-auto grid md:grid-cols-[53%_1fr] gap-10 items-center">
      <div className="relative -mx-4 md:mx-0 md:self-start">
        <div className={`relative overflow-hidden aspect-square ${maskClassName}`}>
          <img
            src={image}
            alt={alt}
            loading="eager"
            fetchPriority="high"
            style={{ filter: HERO_IMAGE_FILTER }}
            className={`absolute inset-0 w-full h-full object-cover ${imagePosition ?? imageClassName} block`}
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
  /** "lux": precio en trazo extrafino, insignia dorada y borde malva pleno (solo Yoga y meditación 1:1). */
  variant?: "lux";
}

export const PriceCard = ({ title, price, description, href, cta, badge, variant }: PriceCardProps) => (
  <motion.div variants={fadeUp} className="relative bg-brand-mauve text-primary-foreground p-8 md:p-10 flex flex-col text-center h-full">
    {badge && (
      <span aria-hidden="true" className={`block text-[10px] uppercase tracking-[0.3em] mb-2 ${variant === "lux" ? "text-brand-gold" : "text-primary-foreground/90"}`}>{badge}</span>
    )}
    {badge && <span className="sr-only">{badge}</span>}
    <h3 className="mt-2">{title}</h3>
    <span aria-hidden="true" className="block mx-auto w-10 h-px bg-brand-gold my-5" />
    <p className="flex items-baseline justify-center gap-2">
      <span className={`font-serif text-5xl ${variant === "lux" ? "font-extralight md:text-6xl" : ""}`}>{price}</span>
      <span className="text-xs tracking-[0.2em]">USD</span>
    </p>
    <div className="mt-5 text-sm leading-relaxed text-primary-foreground flex-grow space-y-3">{description}</div>
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="mt-8 block w-full py-4 px-4 text-center border border-primary-foreground text-[11px] tracking-[0.28em] uppercase hover:bg-primary-foreground hover:text-brand-ink transition-colors duration-500">
      {cta}
    </a>
  </motion.div>
);

export const PriceCardLight = ({ title, price, description, href, cta, variant }: PriceCardProps) => (
  <motion.div variants={fadeUp} className={`relative bg-card border ${variant === "lux" ? "border-brand-mauve" : "border-brand-mauve/40"} p-8 md:p-10 flex flex-col text-center h-full`}>
    <h3 className="mt-2 text-foreground">{title}</h3>
    <span aria-hidden="true" className="block mx-auto w-10 h-px bg-brand-gold my-5" />
    <p className="flex items-baseline justify-center gap-2 text-foreground">
      <span className={`font-serif text-5xl ${variant === "lux" ? "font-extralight md:text-6xl" : ""}`}>{price}</span>
      <span className="text-xs tracking-[0.2em]">USD</span>
    </p>
    <div className="mt-5 text-sm leading-relaxed text-muted-foreground flex-grow space-y-3">{description}</div>
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="mt-8 block w-full py-4 px-4 text-center border border-brand-ink text-brand-ink text-[11px] tracking-[0.28em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500">
      {cta}
    </a>
  </motion.div>
);
