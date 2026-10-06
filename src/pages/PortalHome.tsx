/**
 * PORTADA — lenguaje editorial de lujo (Lote I): blanco + malva, mucho aire, movimiento lento.
 *  - Títulos en display fino en mayúsculas (tokens globales en .lux), cuerpo en Montserrat.
 *  - Solo fundido + 14 px de desplazamiento al entrar, parallax mínimo en fotos, filetes que se dibujan.
 *  - Sin píldoras, óvalos ni marcos. Máximo 2 resaltados por sección (subrayado dorado fino).
 *  - «Mi filosofía de trabajo»: escenario sticky del caos a la calma (manchas difuminadas + 4 pares de palabras).
 */
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, PlayCircle, X } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import FreeClassDialog from "@/components/FreeClassDialog";
import Header from "@/components/Header";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import fransuryAcompana from "@/assets/fransury-acompana.webp";
import heroPhoto from "@/assets/fransury-hero.webp";
import { fadeUp, inView } from "@/components/landing";
import LogoMarquee from "@/components/landing/LogoMarquee";
import { Highlight } from "@/components/landing/Highlight";

// Foto del hero: cambiar solo esta línea para usar otra imagen (retrato vertical sobre fondo malva).
const HERO_IMAGE = heroPhoto;

const FOCUS = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-4";
const BTN_LINE = `inline-flex items-center justify-center gap-3 px-9 py-4 border border-brand-ink text-brand-ink text-[11px] tracking-[0.3em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500 ${FOCUS}`;
const BTN_SOLID = `inline-flex items-center justify-center gap-3 px-9 py-4 border border-brand-mauve bg-brand-mauve text-primary-foreground text-[11px] tracking-[0.3em] uppercase hover:bg-brand-ink hover:border-brand-ink transition-colors duration-500 ${FOCUS}`;
const LABEL = "block text-[10px] uppercase tracking-[0.35em] text-brand-mauve";
const POPUP_KEY = "santosha_free_popup_seen";
const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");

const SITE = "https://santoshayoga.com.co";
const HOME_JSONLD = [
  { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE}/#website`, name: "SantoSha", url: `${SITE}/`, inLanguage: "es-CO" },
  {
    "@context": "https://schema.org", "@type": ["Organization", "ProfessionalService"], "@id": `${SITE}/#organization`,
    name: "SantoSha", url: `${SITE}/`, image: `${SITE}/fransury-retrato.webp`,
    description: "Psicoterapia, terapia de pareja, Kundalini Yoga y meditación 100 % online, desde Medellín para todo el mundo.",
    address: { "@type": "PostalAddress", addressLocality: "Medellín", addressRegion: "Antioquia", addressCountry: "CO" },
    areaServed: "Worldwide", availableLanguage: "es",
  },
  {
    "@context": "https://schema.org", "@type": "Person", "@id": `${SITE}/#fransury`,
    name: "Fransury González", jobTitle: "Psicóloga y maestra de Kundalini Yoga", url: `${SITE}/quien-soy`,
    worksFor: { "@id": `${SITE}/#organization` },
  },
];

const START_OPTIONS = [
  { text: "Quiero comprender por qué me pasa lo que me pasa", to: "/mi-proceso-individual" },
  { text: "Mi relación atraviesa un conflicto", to: "/proceso-de-pareja" },
  { text: "Quiero calmar mi cuerpo y mi mente", to: "/acompanamiento-individual" },
  { text: "Quiero aprender yoga desde cero", to: "/curso-iniciacion-yoga" },
  { text: "Quiero comprender mi ciclo", to: "/sabiduria-ciclica-esencia-femenina" },
];

const useMedia = (q: string) => {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
};


/** Filete dorado que se dibuja lento al entrar. */
const Rule = ({ className = "" }: { className?: string }) => (
  <motion.span aria-hidden="true" className={`block h-px w-12 bg-brand-gold origin-left ${className}`}
    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
);

/* ───────────── Hero ───────────── */
const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const mask = desktop
    ? "linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)"
    : "linear-gradient(to bottom, #000 0%, #000 68%, transparent 100%)";
  return (
    <section ref={ref} className="relative md:min-h-[calc(100svh-96px)] overflow-hidden flex flex-col md:flex-row md:items-center bg-background"
      style={desktop ? { background: "linear-gradient(90deg, #FFFFFF 0%, #F6F2F3 32%, #DDD3D6 58%, #CEC3C6 100%)" } : undefined}>
      <div className="relative h-[64svh] md:absolute md:inset-y-0 md:right-0 md:w-[62%] md:h-auto overflow-hidden"
        style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskComposite: desktop ? "source-in" : undefined, maskComposite: desktop ? "intersect" : undefined } as React.CSSProperties}>
        <motion.div aria-hidden="true"
          className="absolute left-[15%] top-[5%] w-[70%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45),transparent_68%)]"
          animate={reduce ? undefined : { scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src={HERO_IMAGE} alt="Fransury González sentada en el suelo, sonriendo, con camisa blanca y jeans" fetchPriority="high"
          style={reduce || !desktop ? { scale: 1.04 } : { y, scale: 1.06 }}
          className="absolute inset-0 w-full h-full object-cover object-[40%_20%] md:object-[50%_22%] will-change-transform" />
      </div>
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }}
        className="relative w-full max-w-6xl mx-auto px-6 -mt-6 pb-24 md:mt-0 md:py-32">
        <div className="max-w-[30rem] text-center md:text-left">
          <motion.h1 variants={fadeUp} className="!text-[clamp(2rem,4.6vw,3.6rem)] !tracking-[0.16em] !font-extralight !leading-[1.2] text-foreground">
            Fransury<br />González
          </motion.h1>
          <Rule className="mx-auto md:mx-0 mt-8 mb-8" />
          <motion.p variants={fadeUp} className="text-base md:text-[17px] text-foreground max-w-[36ch] mx-auto md:mx-0">
            Quiero acompañarte a sanar experiencias difíciles y habitar una vida en mayor plenitud.
          </motion.p>
          <motion.div variants={fadeUp} className="pt-10">
            <Link to="/programas" className={`${BTN_LINE} w-full sm:w-auto`}>Mira cómo te acompaño</Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ───────────── Banda: frase de Fransury ───────────── */
const PhraseBand = () => (
  <section className="bg-brand-cream px-6 py-24 md:py-40 text-center">
    <motion.div {...inView} variants={fadeUp} className="max-w-4xl mx-auto">
      <Rule className="mx-auto mb-12" />
      <h2 className="text-foreground !leading-[1.6] !tracking-[0.2em]">Del modo supervivencia a la calma consciente</h2>
      <p className="mt-10 text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Fransury González</p>
    </motion.div>
  </section>
);

/* ───────────── Ventana emergente de clase gratuita ───────────── */
const FreeClassPopup = ({ onStart }: { onStart: () => void }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(POPUP_KEY) === "1"; } catch { /* sin storage */ }
    if (seen) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.35) {
        setOpen(true);
        try { sessionStorage.setItem(POPUP_KEY, "1"); } catch { /* sin storage */ }
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.aside role="dialog" aria-modal="false" aria-labelledby="popup-clase-titulo"
          initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="fixed z-[45] inset-x-3 bottom-[5.5rem] md:inset-x-auto md:right-6 md:bottom-24 md:w-[360px] bg-brand-ink text-brand-cream shadow-2xl p-5 md:p-6">
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"
            className={`absolute top-2.5 right-2.5 w-11 h-11 inline-flex items-center justify-center text-brand-cream/80 hover:text-brand-cream ${FOCUS}`}>
            <X className="w-5 h-5" />
          </button>
          <span className="block text-[10px] uppercase tracking-[0.35em] text-brand-gold">Entrada Gratuita</span>
          <p id="popup-clase-titulo" className="font-serif text-xl md:text-2xl font-normal mt-3 pr-8 leading-snug">¿Sufres de ansiedad o agotamiento mental?</p>
          <p className="text-sm text-brand-cream/90 font-light mt-2 leading-relaxed">Una clase online de 30 minutos donde aprendes una técnica somática para ayudar a calmar tu sistema nervioso.</p>
          <button type="button" onClick={() => { setOpen(false); onStart(); }}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm tracking-[0.1em] uppercase font-medium bg-brand-cream text-brand-ink hover:bg-card transition-colors ${FOCUS}`}>
            <PlayCircle className="w-5 h-5" strokeWidth={1.5} /> Comenzar Clase Maestra
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

/* ───────────── Quién te acompaña: 50/50 a sangre ───────────── */
const GoldLine = ({ children }: { children: React.ReactNode }) => <Highlight delay={0.3}>{children}</Highlight>;

const Companion = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <section ref={ref} aria-labelledby="acompana-titulo" className="grid md:grid-cols-2 bg-background">
      <div className="relative h-[110vw] max-h-[640px] md:h-auto md:max-h-none md:min-h-[100svh] overflow-hidden">
        <motion.img src={fransuryAcompana} alt="Fransury González, psicóloga y maestra de Kundalini Yoga, sonriendo sentada en un sofá claro" loading="lazy"
          style={reduce ? { scale: 1.08 } : { y: photoY, scale: 1.08 }}
          className="absolute inset-0 w-full h-full object-cover object-[50%_12%] [filter:grayscale(1)_contrast(0.96)_brightness(1.04)]" />
      </div>
      <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className="flex items-center px-6 py-24 md:px-16 lg:px-24 md:py-32">
        <div className="max-w-[31rem]">
          <motion.p variants={fadeUp} className={LABEL}>Quién te acompaña</motion.p>
          <motion.h2 variants={fadeUp} id="acompana-titulo" className="mt-6 text-foreground">Soy Fransury González,</motion.h2>
          <Rule className="my-8" />
          <motion.p variants={fadeUp} className="text-base text-foreground">
            Aunque quienes han caminado conmigo desde hace años me llaman Sury, soy psicóloga y maestra de Kundalini Yoga.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 text-base text-muted-foreground">
            Soy facilitadora de procesos de conciencia y una eterna estudiante de la psique y el alma humana.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 text-base text-muted-foreground">
            Mi propósito es acompañarte a <GoldLine>transformar el significado de lo que has vivido</GoldLine>. Lo haremos integrando el yoga, como medicina ancestral, y la integración de algunos factores psicológicos, para que aprendas a <GoldLine>regular tu sistema nervioso</GoldLine> y vivas una vida tranquila y feliz.
          </motion.p>
          <motion.div variants={fadeUp} className="pt-10">
            <Link to="/quien-soy" className={BTN_LINE}>Conoce mi historia</Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ───────────── ¿Por dónde empiezo? ───────────── */
const StartSelector = () => (
  <section aria-labelledby="empiezo-titulo" className="bg-background px-6 py-24 md:py-40">
    <div className="max-w-5xl mx-auto grid md:grid-cols-[4fr_7fr] gap-10 md:gap-20">
      <motion.div {...inView} variants={fadeUp}>
        <h2 id="empiezo-titulo" className="text-foreground">¿Por dónde empiezo?</h2>
        <Rule className="my-8" />
        <p className="text-base text-muted-foreground max-w-[26ch]">Elige lo que más se parece a tu momento.</p>
        <p className="mt-6 text-sm text-muted-foreground">
          ¿Buscas clases de yoga? <Link to="/acompanamiento-individual" className={`text-foreground underline decoration-brand-gold decoration-1 underline-offset-[6px] hover:text-brand-ink transition-colors ${FOCUS}`}>Yoga y meditación 1:1</Link>
        </p>
      </motion.div>
      <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="border-t border-border">
        {START_OPTIONS.map(({ text, to }) => (
          <motion.li key={to} variants={fadeUp} className="border-b border-border">
            <Link to={to} className={`group flex items-center justify-between gap-6 py-7 md:py-8 min-h-[56px] ${FOCUS}`}>
              <span className="font-serif font-light uppercase tracking-[0.1em] text-[15px] md:text-lg leading-relaxed text-brand-ink transition-transform duration-500 group-hover:translate-x-1.5">{text}</span>
              <ArrowRight aria-hidden="true" className="shrink-0 w-4 h-4 text-brand-gold transition-all duration-500 group-hover:translate-x-1 group-hover:text-brand-mauve" strokeWidth={1} />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);

/* ───────────── 7. Filosofía: «De esto a esto» ───────────── */
const WORDS_A = ["Prisa", "Ruido", "Exigencia", "Tensión", "Cansancio"];
const WORDS_B = ["Presencia", "Serenidad", "Conexión", "Gratitud"];
const PARA_A = "Gran parte del sufrimiento emerge cuando vivimos reaccionando, controlando y desconectados del cuerpo. Cargamos con lo que ya pasó y con lo que podría pasar, y la mente casi nunca está donde estamos.";
const PARA_B = "Cuando el sistema nervioso se regula, el cuerpo suelta la tensión y la mente deja de adelantarse. Puedes sentarte a comer, conversar o descansar sin estar pensando en otra cosa. Lo trabajamos con yoga, respiración y la comprensión de lo que viviste.";
const JOSEFIN = { fontFamily: "'Josefin Sans', sans-serif" };
const FILO_CSS = `
@keyframes filo-jitter{0%{transform:translate(0,0)}12%{transform:translate(-7px,3px)}25%{transform:translate(5px,-6px)}37%{transform:translate(-3px,-2px)}50%{transform:translate(7px,4px)}62%{transform:translate(-6px,-5px)}75%{transform:translate(4px,6px)}87%{transform:translate(-5px,1px)}100%{transform:translate(0,0)}}
.filo-jitter{display:inline-block;animation:filo-jitter .67s steps(8) infinite}
@keyframes filo-breathe{0%,100%{transform:translate(-50%,-50%) scale(.9)}50%{transform:translate(-50%,-50%) scale(1.06)}}
.filo-ring{position:absolute;left:50%;top:50%;border-radius:9999px;animation:filo-breathe 9s ease-in-out infinite;pointer-events:none}
`;

const smooth = (a: number, b: number) => (v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
/** Progreso suavizado 0→1 en el tramo [a,b]. */
const useSeg = (p: MotionValue<number>, a: number, b: number) => useTransform(p, smooth(a, b));

const Big = ({ children, tone }: { children: string; tone: string }) => (
  <p aria-hidden="true" style={JOSEFIN}
    className={`flex items-center gap-[22px] font-light uppercase tracking-[0.3em] text-[clamp(34px,6vw,64px)] leading-none ${tone}`}>
    <span className="block h-px w-[clamp(34px,6vw,70px)] bg-brand-gold" />
    <span className="pl-[0.3em]">{children}</span>
    <span className="block h-px w-[clamp(34px,6vw,70px)] bg-brand-gold" />
  </p>
);
const KICKER = "text-[11px] tracking-[0.38em] uppercase font-light text-brand-gold";
const TITLE = "font-light uppercase tracking-[0.16em] leading-[1.25] max-w-[900px] [text-wrap:balance] text-[clamp(22px,4.2vw,50px)]";
const BODY = "text-[clamp(14px,1.5vw,17px)] leading-[1.75] font-light max-w-[560px]";
const CHIPS = "flex flex-wrap justify-center gap-x-7 gap-y-2 text-[clamp(12px,1.5vw,15px)] tracking-[0.28em] uppercase font-light max-w-[760px]";
const FILO_BTN = `inline-flex items-center justify-center px-[34px] py-[15px] border border-brand-mauve bg-brand-mauve text-primary-foreground text-[12px] tracking-[0.24em] uppercase hover:bg-brand-ink hover:border-brand-ink transition-colors duration-500 ${FOCUS}`;
const FiloButton = () => <Link to="/filosofia" className={FILO_BTN}>¿Qué es Santosha?</Link>;
const TitleB = () => (
  <h3 style={JOSEFIN} className={`${TITLE} text-brand-ink`}>
    Una vida en calma donde <span className="border-b border-brand-gold">habitas el presente</span>
  </h3>
);
const Rings = ({ o1, o2 }: { o1: MotionValue<number> | number; o2: MotionValue<number> | number }) => (
  <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <motion.span style={{ opacity: o1 }} className="filo-ring border border-brand-gold w-[min(86vw,640px)] h-[min(86vw,640px)]" />
    <motion.span style={{ opacity: o2, animationDelay: "-3s" }} className="filo-ring border border-brand-mauve w-[min(68vw,500px)] h-[min(68vw,500px)]" />
  </div>
);

/** Palabra que aparece en su tramo: fade + 10px + blur 6px → nítida. */
const ScrollWord = ({ w, p, a, d, className }: { w: string; p: MotionValue<number>; a: number; d: number; className: string }) => {
  const t = useSeg(p, a, a + d);
  const y = useTransform(t, [0, 1], [10, 0]);
  const filter = useTransform(t, (v) => `blur(${(1 - v) * 6}px)`);
  return <motion.li style={{ opacity: t, y, filter }} className={className}>{w}</motion.li>;
};
const Stagger = ({ p, a, d, children }: { p: MotionValue<number>; a: number; d: number; children: React.ReactNode }) => {
  const t = useSeg(p, a, a + d);
  const y = useTransform(t, [0, 1], [14, 0]);
  return <motion.div style={{ opacity: t, y }}>{children}</motion.div>;
};

const Philosophy = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.5 });

  const focus = useSeg(p, 0.03, 0.24);
  const blurWord = useTransform(focus, (v) => `blur(${(1 - v) * 6}px)`);
  const jitterO = useTransform(focus, (v) => 1 - v);
  const paraA = useSeg(p, 0.05, 0.14);
  const offA = useSeg(p, 0.4, 0.48);
  const layerAO = useTransform(offA, (v) => 1 - v);
  const curtain = useSeg(p, 0.46, 0.68);
  const clip = useTransform(curtain, (v) => `inset(0 0 ${(1 - v) * 100}% 0)`);
  const lineY = useTransform(curtain, (v) => `${v * 100}svh`);
  const lineO = useTransform(curtain, (v) => (v > 0 && v < 1 ? 1 : 0));
  const rings = useSeg(p, 0.66, 0.8);
  const r1 = useTransform(rings, (v) => v * 0.55);
  const r2 = useTransform(rings, (v) => v * 0.4);
  const btn = useSeg(p, 0.9, 0.96);

  if (reduce) {
    return (
      <section aria-labelledby="filo-titulo">
        <div className="bg-brand-ink text-brand-cream px-6 py-24 flex flex-col items-center text-center gap-5">
          <h2 id="filo-titulo" className={KICKER}>Mi filosofía de trabajo</h2>
          <Big tone="text-brand-gold">De</Big>
          <h3 style={JOSEFIN} className={TITLE}>Salir del modo supervivencia</h3>
          <p className={`${BODY} opacity-90`}>{PARA_A}</p>
          <ul className={CHIPS}>{WORDS_A.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
        <div className="relative overflow-hidden bg-brand-cream px-6 py-28 flex flex-col items-center text-center gap-5">
          <Rings o1={0.5} o2={0.5} />
          <div className="relative z-10 flex flex-col items-center gap-5">
            <Big tone="text-brand-mauve">A</Big>
            <TitleB />
            <p className={`${BODY} text-brand-ink/85`}>{PARA_B}</p>
            <ul className={`${CHIPS} text-brand-mauve`}>{WORDS_B.map((w) => <li key={w}>{w}</li>)}</ul>
            <div className="pt-2"><FiloButton /></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="filo-titulo" className="relative h-[460vh] md:h-[520vh]">
      <style>{FILO_CSS}</style>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-brand-ink">
        {/* Capa A · ciruela */}
        <motion.div style={{ opacity: layerAO }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-5 text-brand-cream">
          <h2 id="filo-titulo" className={KICKER}>Mi filosofía de trabajo</h2>
          <Big tone="text-brand-gold">De</Big>
          <h3 style={JOSEFIN} className={TITLE}>
            Salir del modo{" "}
            <span className="relative inline-block">
              <motion.span style={{ opacity: focus }} className="inline-block">supervivencia</motion.span>
              <motion.span aria-hidden="true" style={{ opacity: jitterO, filter: blurWord }} className="absolute inset-0">
                <span className="filo-jitter">supervivencia</span>
              </motion.span>
            </span>
          </h3>
          <motion.p style={{ opacity: paraA }} className={`${BODY} opacity-90`}>{PARA_A}</motion.p>
          <ul className={CHIPS}>
            {WORDS_A.map((w, i) => <ScrollWord key={w} w={w} p={p} a={0.12 + i * 0.045} d={0.05} className="" />)}
          </ul>
        </motion.div>

        {/* Capa B · crema, revelada por cortina */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-brand-cream">
          <Rings o1={r1} o2={r2} />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-5">
            <Stagger p={p} a={0.58} d={0.12}><Big tone="text-brand-mauve">A</Big></Stagger>
            <Stagger p={p} a={0.62} d={0.12}><TitleB /></Stagger>
            <Stagger p={p} a={0.66} d={0.12}><p className={`${BODY} text-brand-ink/85`}>{PARA_B}</p></Stagger>
            <ul className={`${CHIPS} text-brand-mauve`}>
              {WORDS_B.map((w, i) => <ScrollWord key={w} w={w} p={p} a={0.72 + i * 0.04} d={0.05} className="" />)}
            </ul>
            <motion.div style={{ opacity: btn }} className="pt-2"><FiloButton /></motion.div>
          </div>
        </motion.div>
        <motion.span aria-hidden="true" style={{ y: lineY, opacity: lineO }} className="absolute left-0 right-0 top-0 h-px bg-brand-gold" />
      </div>
    </section>
  );
};

/* ───────────── Página ───────────── */

const PortalHome = () => {
  const { settings, palette } = useVisualSettings();
  const [freeClassOpen, setFreeClassOpen] = useState(false);
  const openFree = () => setFreeClassOpen(true);

  return (
    <div className="min-h-screen relative flex flex-col">
      <Seo
        title="SantoSha | Psicoterapia, yoga y meditación online"
        description="Psicoterapia individual y de pareja, Kundalini Yoga y meditación con Fransury González. Atención virtual desde cualquier lugar."
        path="/"
        jsonLd={HOME_JSONLD}
      />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow bg-background">
        <Hero />
        <LogoMarquee />
        <PhraseBand />
        <Companion />
        <StartSelector />
        <Philosophy />

        <section className="bg-background px-6 py-28 md:py-44">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={fadeUp} className="text-foreground">¿Quieres empezar? Escríbeme.</motion.h2>
            <Rule className="mx-auto my-9" />
            <motion.p variants={fadeUp} className="text-base text-muted-foreground max-w-[44ch] mx-auto">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={BTN_LINE}>Escríbeme</a>
              <button type="button" onClick={openFree}
                className={`text-[11px] tracking-[0.3em] uppercase text-brand-mauve border-b border-brand-gold/60 pb-1 hover:border-brand-mauve transition-colors duration-500 ${FOCUS}`}>
                Acceder a la Clase Gratis
              </button>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-14 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Atención virtual desde cualquier lugar del mundo.</motion.p>
          </motion.div>
        </section>
      </main>

      <SiteFooter palette={palette} />
      <FreeClassPopup onStart={openFree} />
      <AiChatWidget pageSlug="home" />
      <FreeClassDialog open={freeClassOpen} onOpenChange={setFreeClassOpen} />
    </div>
  );
};

export default PortalHome;
