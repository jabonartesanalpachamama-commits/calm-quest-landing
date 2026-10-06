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

const RESTLESS = ["Prisa", "Ruido", "Exigencia", "Tensión", "Aguantar", "Anticipar", "Control", "Cansancio"];
const CALM = ["Presencia", "Ecuanimidad", "Conexión", "Contentamiento consciente"];

/* ───────────── 7. Filosofía: dolor → calma ───────────── */
const PhaseOneText = () => (
  <>
    <h3 className="font-serif text-3xl md:text-5xl font-semibold">
      Salir del <span className="inline-block">modo</span> <span className="jitter-word inline-block">supervivencia</span>
    </h3>
    <p className="text-base md:text-lg font-light leading-relaxed opacity-95 max-w-xl mx-auto">
      Gran parte del sufrimiento emerge cuando vivimos reaccionando, controlando y desconectados del cuerpo. Cargamos con lo que ya pasó y con lo que podría pasar, y la mente casi nunca está donde estamos.
    </p>
  </>
);
const TransitionText = () => (
  <>
    <h3 className="font-serif !text-[clamp(1.35rem,4.2vw,2.9rem)] text-foreground [overflow-wrap:normal] [hyphens:none]">
      A una vida en calma donde <Highlight delay={0.2}>habitas el presente</Highlight>
    </h3>
    <p className="text-sm md:text-lg text-foreground/85 font-light leading-relaxed max-w-xl mx-auto">
      Cuando el sistema nervioso se regula, <Highlight delay={0.4}>el cuerpo suelta la tensión</Highlight> y la mente deja de adelantarse. Puedes sentarte a comer, conversar o descansar sin estar pensando en otra cosa. Lo trabajamos con yoga, respiración y la comprensión de lo que viviste, para que la calma aparezca con más frecuencia y se quede más tiempo.
    </p>
  </>
);
const ManifestoLink = () => (
  <Link to="/filosofia" className={`${BTN_SOLID} ${FOCUS}`}>Qué es Santosha</Link>
);

/** Posición, tamaño, deriva (s) y si se oculta en móvil. */
const FLOAT_POS = [
  { pos: "top-[12%] left-[6%]", size: "text-2xl md:text-5xl", dur: 9 },
  { pos: "top-[16%] right-[6%]", size: "text-base md:text-2xl", dur: 11 },
  { pos: "bottom-[16%] left-[8%]", size: "text-xl md:text-4xl", dur: 8 },
  { pos: "bottom-[10%] right-[7%]", size: "text-lg md:text-3xl", dur: 12 },
  { pos: "top-[6%] left-1/2 -translate-x-1/2 md:top-[44%] md:left-[3%] md:translate-x-0", size: "text-sm md:text-xl", dur: 7 },
  { pos: "bottom-[4%] left-1/2 -translate-x-1/2", size: "text-base md:text-2xl", dur: 10 },
  { pos: "hidden md:block top-[42%] right-[3%]", size: "md:text-lg", dur: 8.5 },
  { pos: "hidden md:block top-[8%] left-[38%]", size: "md:text-sm", dur: 11.5 },
];

const Floater = ({ w, i, p }: { w: string; i: number; p: MotionValue<number> }) => {
  const f = FLOAT_POS[i];
  const s = 0.18 + i * 0.022, e = s + 0.1;
  const fade = useTransform(p, [s, e], [1, 0]);
  const spacing = useTransform(p, [s, e], ["0em", "0.6em"]);
  const blur = useTransform(p, [s, e], ["blur(0px)", "blur(8px)"]);
  const dx = (i % 2 ? -1 : 1) * (8 + i * 2);
  return (
    <motion.span aria-hidden="true" style={{ opacity: fade, letterSpacing: spacing, filter: blur }}
      className={`absolute ${f.pos} ${f.size} font-serif font-light whitespace-nowrap text-brand-cream`}>
      <motion.span className="block"
        animate={{ x: [0, dx, -dx / 2, 0], y: [0, -10, 6, 0], opacity: [0.25, 0.65, 0.4, 0.25] }}
        transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}>
        {w}
      </motion.span>
    </motion.span>
  );
};

const Philosophy = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 26, mass: 0.6 });
  const plum = useTransform(p, [0.3, 0.55], [1, 0]);
  const one = useTransform(p, [0.22, 0.34], [1, 0]);
  const oneY = useTransform(p, [0.22, 0.34], ["0px", "-30px"]);
  const two = useTransform(p, [0.52, 0.64], [0, 1]);
  const twoY = useTransform(p, [0.52, 0.64], ["30px", "0px"]);
  const calm = [useTransform(p, [0.66, 0.71], [0, 1]), useTransform(p, [0.7, 0.75], [0, 1]), useTransform(p, [0.74, 0.79], [0, 1]), useTransform(p, [0.78, 0.83], [0, 1])];
  const cta = useTransform(p, [0.84, 0.92], [0, 1]);

  if (reduce) {
    return (
      <section aria-labelledby="filo-titulo">
        <div className="bg-brand-ink text-brand-cream px-6 py-16 text-center space-y-5">
          <h2 id="filo-titulo" className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-gold">Mi filosofía de trabajo</h2>
          <PhaseOneText />
          <ul className="space-y-2 text-sm text-brand-cream/90 font-light">{RESTLESS.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
        <div className="bg-[#F7F3F0] px-6 py-16 text-center space-y-5">
          <TransitionText />
          <p className="text-brand-mauve font-serif text-lg">{CALM.join(" · ")}</p>
          <ManifestoLink />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="filo-titulo" className="relative h-[260vh] md:h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#F7F3F0]">
        <motion.div aria-hidden="true" style={{ opacity: plum }} className="absolute inset-0 bg-brand-ink" />

        {/* Fase 1 · dolor */}
        <div className="absolute inset-0">{RESTLESS.map((w, i) => <Floater key={w} w={w} i={i} p={p} />)}</div>
        <motion.div style={{ opacity: one, y: oneY }} className="absolute inset-0 flex items-center justify-center px-6">
          <div className="relative text-center space-y-4 md:space-y-5 text-brand-cream max-w-2xl">
            <h2 id="filo-titulo" className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-gold">Mi filosofía de trabajo</h2>
            <PhaseOneText />
            <p className="sr-only">{RESTLESS.join(" · ")}</p>
          </div>
        </motion.div>

        {/* Fase 2 · calma */}
        <motion.div style={{ opacity: two, y: twoY }} className="absolute inset-0 flex items-center justify-center px-6">
          <div className="relative text-center space-y-5 max-w-3xl">
            <TransitionText />
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-brand-mauve font-serif text-lg md:text-2xl">
              {CALM.map((w, i) => <motion.li key={w} style={{ opacity: calm[i] }}>{w}</motion.li>)}
            </ul>
            <motion.div style={{ opacity: cta }} className="pt-2"><ManifestoLink /></motion.div>
          </div>
        </motion.div>
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
