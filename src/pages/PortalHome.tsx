/**
 * PORTADA — lenguaje editorial de lujo (Lote I): blanco + malva, mucho aire, movimiento lento.
 *  - Títulos en display fino en mayúsculas (tokens globales en .lux), cuerpo en Montserrat.
 *  - Solo fundido + 14 px de desplazamiento al entrar, parallax mínimo en fotos, filetes que se dibujan.
 *  - Sin píldoras, óvalos ni marcos. Máximo 2 resaltados por sección (subrayado dorado fino).
 *  - «Mi filosofía de trabajo» conserva su experiencia de scroll (única con animación narrativa).
 */
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, PlayCircle, X } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import FreeClassDialog from "@/components/FreeClassDialog";
import Header from "@/components/Header";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import fransuryImage from "@/assets/fransury-retrato.webp";
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

const RESTLESS = ["Prisa", "Ruido", "Exigencia", "Tensión", "Aguantar", "Anticipar", "Control", "Cansancio"];
const CALM = ["Presencia", "Ecuanimidad", "Conexión", "Contentamiento consciente"];

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
        <motion.img src={fransuryImage} alt="Fransury González, psicóloga y maestra de Kundalini Yoga" loading="lazy"
          style={reduce ? { scale: 1.08 } : { y: photoY, scale: 1.08 }}
          className="absolute inset-0 w-full h-full object-cover object-top [filter:grayscale(1)_contrast(0.96)_brightness(1.04)]" />
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

/* ───────────── 7. Filosofía: «El pulso» (caos → calma) ───────────── */
const INK = "#482A3A", CREAM = "#F6F2F3", GOLD = "#B8977E";
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => { const x = clamp01(v); return x * x * (3 - 2 * x); };
/** Ruido determinista en [-1, 1]. */
const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
const vnoise = (x: number) => { const i = Math.floor(x), f = x - i; return hash(i) + (hash(i + 1) - hash(i)) * smooth(f); };
/** Caos: sube 0–0.1, pleno 0.1–0.4, decae 0.4–0.66. */
const chaosAt = (p: number) => (p < 0.1 ? p / 0.1 : p < 0.4 ? 1 : 1 - smooth((p - 0.4) / 0.26));
const calmAt = (p: number) => smooth((p - 0.62) / 0.1);

const PULSE_H = 200;
const pulsePath = (p: number, t: number, w: number, amp: number) => {
  const c = chaosAt(p), b = calmAt(p), N = 110;
  const freq = 1.2 + 34 * c; // ciclos de ruido a lo ancho
  const breathe = (7 + 3 * Math.sin((t * 2 * Math.PI) / 8)) * b;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const zig = c > 0.001 ? vnoise(x * freq + 3) * (0.75 + 0.25 * Math.sin(t * 7 + i * 1.3)) + 0.18 * Math.sin(t * 11 + i * 2.1) * c : 0;
    const y = PULSE_H / 2 + zig * amp * c + breathe * Math.sin(x * Math.PI * 2.2 + (t * 2 * Math.PI) / 8);
    d += `${i ? "L" : "M"}${(x * w).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

const PulseLine = ({ p, t, desktop, still = false, color }: { p?: MotionValue<number>; t?: MotionValue<number>; desktop: boolean; still?: boolean; color?: MotionValue<string> | string }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [w, setW] = useState(1280);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(320, e.contentRect.width)));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  const zero = useMotionValue(0);
  const d = useTransform([p ?? zero, t ?? zero] as MotionValue<number>[], ([pv, tv]: number[]) =>
    still ? `M0 ${PULSE_H / 2}L${w} ${PULSE_H / 2}` : pulsePath(pv, tv, w, desktop ? 70 : 45));
  return (
    <svg ref={ref} aria-hidden="true" className="block w-full h-[200px]" viewBox={`0 0 ${w} ${PULSE_H}`} preserveAspectRatio="none">
      <motion.path d={d} fill="none" style={{ stroke: color ?? GOLD }} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
};

/** Letra del título que tiembla en proporción al caos y se asienta en 0. */
const ChaosLetter = ({ ch, i, chaos, t }: { ch: string; i: number; chaos: MotionValue<number>; t: MotionValue<number> }) => {
  const x = useTransform([chaos, t] as MotionValue<number>[], ([c, tv]: number[]) => c * 2.4 * Math.sin(tv * 23 + i * 1.9));
  const y = useTransform([chaos, t] as MotionValue<number>[], ([c, tv]: number[]) => c * 2.8 * Math.sin(tv * 19 + i * 2.7));
  const rotate = useTransform([chaos, t] as MotionValue<number>[], ([c, tv]: number[]) => c * 5 * hash(i) * Math.sin(tv * 13 + i));
  if (ch === " ") return <span> </span>;
  return <motion.span aria-hidden="true" className="inline-block" style={{ x, y, rotate }}>{ch}</motion.span>;
};

const PHASE1_TITLE = "Salir del modo supervivencia";
const ChaosTitle = ({ chaos, t }: { chaos: MotionValue<number>; t: MotionValue<number> }) => {
  let k = 0;
  return (
    <h3 className={TITLE1_CLASS}>
      <span className="sr-only">{PHASE1_TITLE}</span>
      {PHASE1_TITLE.split(" ").map((word, wi) => (
        <span key={wi} aria-hidden="true">
          {wi > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((ch) => <ChaosLetter key={k} ch={ch} i={k++} chaos={chaos} t={t} />)}
          </span>
        </span>
      ))}
    </h3>
  );
};
const TITLE1_CLASS = "font-serif !text-[clamp(2rem,6vw,4.6rem)] !font-extralight uppercase !tracking-[0.12em] !leading-[1.15] [overflow-wrap:normal] [hyphens:none]";
const PHASE1_LINE = "Reaccionamos, controlamos y nos desconectamos del cuerpo.";

const CalmTitle = () => (
  <h3 className="font-serif !text-[clamp(1.4rem,4.2vw,2.9rem)] !font-extralight uppercase !tracking-[0.1em] !leading-[1.35] text-[#482A3A] [overflow-wrap:normal] [hyphens:none]">
    A una vida en calma donde <Highlight delay={0.2}>habitas el presente</Highlight>
  </h3>
);
const ManifestoLink = () => (
  <Link to="/filosofia" className={`${BTN_SOLID} ${FOCUS}`}>Qué es Santosha</Link>
);
const CalmDiamond = () => <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rotate-45 bg-[#B8977E] shrink-0" />;
const CALM_CLASS = "flex flex-wrap justify-center items-center gap-x-5 gap-y-3 text-[#482A3A] font-serif font-extralight uppercase tracking-[0.08em] text-2xl md:text-4xl";

/**
 * Palabras del caos: posición dispersa (left/top en %, móvil | escritorio), rotación base, tamaño, opacidad y tono.
 * Bandas de arriba y de abajo; el centro (título y línea) queda libre.
 */
const CHAOS_WORDS = [
  { m: [22, 11], d: [12, 12], rot: -7, size: "text-2xl md:text-6xl", op: 0.85, gold: false },
  { m: [74, 15], d: [42, 7], rot: 6, size: "text-xl md:text-4xl", op: 0.6, gold: true },
  { m: [70, 62], d: [82, 13], rot: -4, size: "text-3xl md:text-5xl", op: 0.75, gold: false },
  { m: [26, 70], d: [16, 74], rot: 8, size: "text-3xl md:text-6xl", op: 0.9, gold: false },
  { m: [72, 77], d: [46, 88], rot: -8, size: "text-xl md:text-3xl", op: 0.55, gold: true },
  { m: [36, 84], d: [72, 70], rot: 5, size: "text-2xl md:text-5xl", op: 0.7, gold: false },
  { m: [74, 91], d: [86, 87], rot: -6, size: "text-xl md:text-4xl", op: 0.5, gold: false },
  { m: [24, 94], d: [26, 92], rot: 4, size: "text-2xl md:text-6xl", op: 0.8, gold: false },
];

const ChaosWord = ({ w, i, p, chaos, t, desktop }: { w: string; i: number; p: MotionValue<number>; chaos: MotionValue<number>; t: MotionValue<number>; desktop: boolean }) => {
  const c = CHAOS_WORDS[i];
  const [sx, sy] = desktop ? c.d : c.m;
  // Hilera ordenada: escritorio una fila; móvil dos filas de 4.
  const rx = desktop ? 20 + (i % 4) * 20 : 14 + (i % 4) * 24;
  const ry = desktop ? (i < 4 ? 72 : 82) : i < 4 ? 72 : 80;
  const appear = 0.08 + i * 0.026;
  const align = useTransform(p, [0.4, 0.5], [0, 1]);
  const ds = 0.5 + i * 0.012, de = ds + 0.05;
  const left = useTransform(align, (a) => `${sx + (rx - sx) * smooth(a)}%`);
  const top = useTransform(align, (a) => `${sy + (ry - sy) * smooth(a)}%`);
  const scale = useTransform(align, (a) => 1 - smooth(a) * (desktop ? 0.45 : 0.5));
  const opacity = useTransform(p, [appear, appear + 0.05, ds, de], [0, c.op, c.op, 0]);
  const letterSpacing = useTransform(p, [ds, de], ["0em", "0.5em"]);
  const filter = useTransform(p, [ds, de], ["blur(0px)", "blur(6px)"]);
  const x = useTransform([chaos, t] as MotionValue<number>[], ([cv, tv]: number[]) => cv * 5 * Math.sin(tv * 17 + i * 2.3));
  const y = useTransform([chaos, t] as MotionValue<number>[], ([cv, tv]: number[]) => cv * 4 * Math.sin(tv * 21 + i * 1.7));
  const rotate = useTransform([chaos, t, align] as MotionValue<number>[], ([cv, tv, a]: number[]) => c.rot * (1 - smooth(a)) + cv * 2.5 * Math.sin(tv * 15 + i));
  return (
    <motion.span aria-hidden="true" style={{ left, top, opacity }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${c.size} font-serif font-extralight uppercase whitespace-nowrap ${c.gold ? "text-[#B8977E]" : "text-[#F6F2F3]"}`}>
      <motion.span className="block" style={{ x, y, rotate, scale, letterSpacing, filter }}>{w}</motion.span>
    </motion.span>
  );
};

const Philosophy = () => {
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.5 });
  const t = useMotionValue(0);
  useAnimationFrame((ms) => { if (!reduce) t.set(ms / 1000); });
  const chaos = useTransform(p, chaosAt);
  const bg = useTransform(p, [0, 0.16, 0.52, 0.74, 0.96, 1], ["#FFFFFF", INK, INK, CREAM, CREAM, "#FFFFFF"]);
  const lineColor = useTransform(p, [0, 0.12, 0.5, 0.7], [INK, CREAM, CREAM, GOLD]);
  const oneColor = useTransform(p, [0.08, 0.09], [INK, CREAM]);
  const one = useTransform(p, [0.04, 0.1, 0.44, 0.5], [0, 1, 1, 0]);
  const oneY = useTransform(p, [0.44, 0.5], ["0px", "-24px"]);
  const two = useTransform(p, [0.66, 0.72], [0, 1]);
  const twoY = useTransform(p, [0.66, 0.72], ["24px", "0px"]);
  const calm = [0.74, 0.78, 0.82, 0.86].map((s) => useTransform(p, [s, s + 0.04], [0, 1])); // eslint-disable-line react-hooks/rules-of-hooks
  const cta = useTransform(p, [0.89, 0.94], [0, 1]);

  if (reduce) {
    return (
      <section aria-labelledby="filo-titulo">
        <div className="bg-[#482A3A] text-[#F6F2F3] px-6 py-24 md:py-36 text-center space-y-8">
          <h2 id="filo-titulo" className="text-xs uppercase tracking-[0.3em] font-semibold text-[#B8977E]">Mi filosofía de trabajo</h2>
          <h3 className={TITLE1_CLASS}>{PHASE1_TITLE}</h3>
          <p className="text-base md:text-xl font-light leading-relaxed max-w-xl mx-auto">{PHASE1_LINE}</p>
          <div className="-mx-6"><PulseLine desktop={desktop} still color={CREAM} /></div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xl md:text-2xl font-serif font-extralight uppercase">
            {RESTLESS.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
        <div className="bg-[#F6F2F3] px-6 py-24 md:py-36 text-center space-y-10">
          <CalmTitle />
          <ul className={CALM_CLASS}>{CALM.map((w, i) => <li key={w} className="inline-flex items-center gap-5">{i > 0 && <CalmDiamond />}{w}</li>)}</ul>
          <ManifestoLink />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="filo-titulo" className="relative h-[340vh] md:h-[380vh]">
      <motion.div className="sticky top-0 h-[100svh] overflow-hidden" style={{ backgroundColor: bg }}>
        {/* Palabras del caos */}
        <div className="absolute inset-0">{RESTLESS.map((w, i) => <ChaosWord key={w} w={w} i={i} p={p} chaos={chaos} t={t} desktop={desktop} />)}</div>

        {/* Línea del pulso */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2"><PulseLine p={p} t={t} desktop={desktop} color={lineColor} /></div>

        {/* Fase 1 · arriba de la línea */}
        <motion.div style={{ opacity: one, y: oneY, color: oneColor }}
          className="absolute inset-x-0 top-[18%] bottom-[54%] md:top-[18%] flex items-end justify-center px-5">
          <div className="text-center space-y-4 md:space-y-6 max-w-5xl">
            <h2 id="filo-titulo" className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold text-[#B8977E]">Mi filosofía de trabajo</h2>
            <ChaosTitle chaos={chaos} t={t} />
            <p className="text-sm md:text-xl font-light leading-relaxed max-w-xl mx-auto">{PHASE1_LINE}</p>
            <p className="sr-only">{RESTLESS.join(" · ")}</p>
          </div>
        </motion.div>

        {/* Fase 2 · calma */}
        <motion.div style={{ opacity: two, y: twoY }} className="absolute inset-x-0 top-[12%] bottom-[56%] flex items-end justify-center px-6">
          <div className="text-center max-w-4xl"><CalmTitle /></div>
        </motion.div>
        <motion.div style={{ opacity: two }} className="absolute inset-x-0 top-[58%] bottom-0 flex flex-col items-center px-6 gap-10 md:gap-12">
          <ul className={CALM_CLASS}>
            {CALM.map((w, i) => <motion.li key={w} style={{ opacity: calm[i] }} className="inline-flex items-center gap-5">{i > 0 && <CalmDiamond />}{w}</motion.li>)}
          </ul>
          <motion.div style={{ opacity: cta }}><ManifestoLink /></motion.div>
        </motion.div>
      </motion.div>
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
