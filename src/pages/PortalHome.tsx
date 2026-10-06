import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, Gift, Leaf, MessageCircle, PlayCircle, X } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import FreeClassDialog from "@/components/FreeClassDialog";
import Header from "@/components/Header";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import fransuryImage from "@/assets/fransury-retrato.webp";
import heroBackground from "@/assets/hero-sunrise.png.asset.json";
import cursoHero from "@/assets/curso-hero.png.asset.json";
import bannerAcompanamiento from "@/assets/banner-acompanamiento.webp";
import paraQuienImage from "@/assets/para-quien-image.webp";
import { EASE, fadeUp, inView, RotatingOrnament } from "@/components/landing";
import LogoMarquee from "@/components/landing/LogoMarquee";
import { Highlight } from "@/components/landing/Highlight";
import { BreathingCircle, OutlineWord } from "@/components/landing/Breath";

// Foto del hero: cambiar solo esta línea para usar otra imagen.
const HERO_IMAGE = heroBackground.url;

const BTN_SOLID = "inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold shadow-md justify-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-brand-mauve hover:bg-brand-mauve/90 text-primary-foreground";
const BTN_OUTLINE = "inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold justify-center bg-card/80 backdrop-blur border border-brand-mauve/40 text-foreground hover:bg-card transition-all duration-300";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
const H2 = "font-serif text-3xl md:text-5xl font-normal text-foreground";
const POPUP_KEY = "santosha_free_popup_seen";

const PROGRAMS = [
  {
    title: "Mi Proceso Individual",
    subtitle: "Psicoterapia Individual",
    desc: "Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.",
    features: ["1 o 3 Sesiones", "Espacio Terapéutico", "100% Virtual"],
    href: "/mi-proceso-individual",
    image: bannerAcompanamiento,
  },
  {
    title: "Proceso de Pareja",
    subtitle: "Psicoterapia de Pareja",
    desc: "Un espacio donde ambos puedan observar lo que está ocurriendo, mejorar la comunicación y asumir responsabilidad sobre aquello que sí pueden transformar.",
    features: ["Mejorar la comunicación", "Gestión de conflictos", "100% Virtual"],
    href: "/proceso-de-pareja",
    image: paraQuienImage,
  },
  {
    title: "Cultivar Mi Bienestar",
    subtitle: "Kundalini Yoga",
    desc: "Espacios diseñados para habitar el cuerpo, encontrar equilibrio y conectar con tu verdadera esencia a través de la práctica constante.",
    features: ["Curso de Iniciación", "Sabiduría Cíclica", "Acompañamiento 1:1"],
    href: "/cultivar-bienestar",
    image: cursoHero.url,
  },
];

const START_OPTIONS = [
  { text: "Quiero comprender por qué me pasa lo que me pasa", to: "/mi-proceso-individual" },
  { text: "Mi relación atraviesa un conflicto", to: "/proceso-de-pareja" },
  { text: "Quiero calmar mi cuerpo y mi mente", to: "/acompanamiento-individual" },
  { text: "Quiero aprender yoga desde cero", to: "/curso-iniciacion-yoga" },
  { text: "Quiero comprender mi ciclo", to: "/sabiduria-ciclica-esencia-femenina" },
];

const RESTLESS = ["Reaccionar", "Controlar", "Exigirse", "Desconectarse"];
const CALM = ["Presencia", "Ecuanimidad", "Conexión", "Contentamiento consciente"];

/** Revelado enmascarado: el contenido sube desde detrás de una línea invisible. */
const MaskLine = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.span className={`block overflow-hidden pb-[0.08em] ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
    <motion.span className="block" variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 0.9, delay, ease: EASE } } }}>
      {children}
    </motion.span>
  </motion.span>
);

/* ───────────── 1. Hero ───────────── */
const Hero = ({ onFreeClass }: { onFreeClass: () => void }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const goProgramas = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#programas")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  return (
    <section ref={ref} className="relative md:min-h-[100svh] overflow-hidden flex flex-col md:flex-row md:items-center bg-brand-cream">
      {/* Imagen: bloque superior en móvil (rostro completo), fondo completo en escritorio */}
      <div className="relative h-[55svh] md:absolute md:inset-0 md:h-auto overflow-hidden">
        <motion.img src={HERO_IMAGE} alt="Mujer meditando al amanecer sobre las montañas"
          style={reduce ? undefined : { y, scale }}
          className="absolute inset-0 w-full h-full object-cover object-[85%_30%] md:object-[70%_30%] will-change-transform" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-cream to-transparent md:hidden" />
        <div aria-hidden="true" className="hidden md:block absolute inset-0 bg-gradient-to-r from-brand-cream from-25% via-brand-cream/75 via-45% to-transparent to-70%" />
      </div>
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        className="relative w-full max-w-6xl mx-auto px-6 -mt-10 pb-12 md:mt-0 md:py-28">
        <div className="max-w-xl space-y-5 text-center md:text-left">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/80 text-brand-mauve shadow-sm">
            <Leaf className="w-3.5 h-3.5" /> Conciencia · Calma · Transformación humana
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-foreground">
            Del modo supervivencia a la <Highlight delay={0.9} className="text-brand-mauve">calma consciente</Highlight>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/85 leading-relaxed font-light">
            Kundalini Yoga, regulación del sistema nervioso y sabiduría somática para recordar tu esencia y habitar tu vida.
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-2 border-l-0 md:border-l md:border-brand-gold/60 md:pl-5">
            <span aria-hidden="true" className="block mx-auto w-12 h-px bg-brand-gold/70 mb-3 md:hidden" />
            <p className="font-serif text-lg md:text-xl text-foreground">Hola, soy Fransury Gonzáles (Sury), psicóloga y maestra de Kundalini Yoga.</p>
            <p className="font-serif italic text-base md:text-lg text-brand-mauve">Mi propósito es acompañarte a sanar experiencias difíciles y habitar una vida en mayor plenitud.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3 pt-1 [&>*]:w-full sm:[&>*]:w-auto">
            <a href="#programas" onClick={goProgramas} className={`${BTN_SOLID} ${FOCUS}`}>
              Ver programas formativos
              <motion.span className="inline-flex" animate={reduce ? undefined : { y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </a>
            <button type="button" onClick={onFreeClass} className={`${BTN_OUTLINE} ${FOCUS}`}>
              <Gift className="w-5 h-5 text-brand-mauve" /> Acceder a Clase Gratuita
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ───────────── 2. Ventana emergente de clase gratuita ───────────── */
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
          className="fixed z-[45] inset-x-3 bottom-[5.5rem] md:inset-x-auto md:right-6 md:bottom-24 md:w-[360px] rounded-3xl bg-brand-ink text-brand-cream shadow-2xl p-5 md:p-6">
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"
            className={`absolute top-2.5 right-2.5 w-11 h-11 inline-flex items-center justify-center rounded-full text-brand-cream/80 hover:text-brand-cream hover:bg-brand-cream/10 ${FOCUS}`}>
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-brand-cream/15">Entrada Gratuita</span>
          <p id="popup-clase-titulo" className="font-serif text-xl md:text-2xl font-semibold mt-3 pr-8 leading-snug">¿Sufres de ansiedad o agotamiento mental?</p>
          <p className="text-sm text-brand-cream/90 font-light mt-2 leading-relaxed">Una clase online de 30 minutos donde aprendes una técnica somática para ayudar a calmar tu sistema nervioso.</p>
          <button type="button" onClick={() => { setOpen(false); onStart(); }}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold bg-brand-cream text-brand-ink hover:bg-card transition-colors ${FOCUS}`}>
            <PlayCircle className="w-5 h-5" /> Comenzar Clase Maestra
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

/* ───────────── 3. Selector "¿Por dónde empiezo?" ───────────── */
const StartSelector = () => (
  <section aria-labelledby="empiezo-titulo" className="px-6 py-16 md:py-24">
    <div className="max-w-6xl mx-auto grid md:grid-cols-[4fr_7fr] gap-8 md:gap-16">
      <motion.div {...inView} variants={fadeUp} className="md:pt-6">
        <h2 id="empiezo-titulo" className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-mauve">¿Por dónde empiezo?</h2>
        <span aria-hidden="true" className="block w-14 h-px bg-brand-gold my-4" />
        <p className="font-serif italic text-xl md:text-2xl text-foreground/80 leading-snug">Elige lo que más se parece a tu momento.</p>
      </motion.div>
      <ul className="border-t border-brand-gold/40">
        {START_OPTIONS.map(({ text, to }, i) => (
          <motion.li key={to} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
            className="group border-b border-brand-gold/40 hover:border-brand-gold focus-within:border-brand-gold transition-colors duration-300">
            <Link to={to} className={`flex items-center justify-between gap-5 py-6 md:py-7 min-h-[56px] rounded ${FOCUS}`}>
              <span className="font-serif font-normal text-[22px] md:text-[26px] leading-snug text-brand-ink transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                {text}
              </span>
              <span aria-hidden="true" className="shrink-0 w-9 h-9 rounded-full border border-brand-gold inline-flex items-center justify-center text-brand-gold transition-colors duration-300 group-hover:bg-brand-mauve group-hover:border-brand-mauve group-hover:text-brand-cream group-focus-visible:bg-brand-mauve group-focus-visible:text-brand-cream">
                <ArrowRight className="w-4 h-4" strokeWidth={1.25} />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

/* ───────────── 5. Programas: recorrido editorial ───────────── */
const ProgramBlock = ({ p, i }: { p: (typeof PROGRAMS)[number]; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const flip = i % 2 === 1;
  return (
    <div ref={ref} className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-center pl-8 md:pl-0`}>
      <motion.div initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "-60px" }}
        className={`relative w-full max-w-[420px] mx-auto ${flip ? "md:order-2" : ""}`}>
        <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 rounded-t-full rounded-b-2xl border border-brand-gold/70" />
        <motion.div className="relative aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden"
          variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: EASE } } }}>
          <motion.img src={p.image} alt="" loading="lazy" style={reduce ? undefined : { y: imgY, scale: 1.14 }} className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
      <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-brand-gold [font-variant:small-caps]">{p.subtitle}</motion.p>
        <motion.h3 variants={fadeUp} className="font-serif font-normal text-[32px] md:text-[44px] leading-tight text-foreground">{p.title}</motion.h3>
        <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">{p.desc}</motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
          {p.features.map((f) => (
            <span key={f} className="text-xs px-3 py-1 rounded-full border border-brand-gold/40 text-brand-mauve">{f}</span>
          ))}
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link to={p.href} className={`group relative inline-flex items-center gap-2 py-1 text-sm font-medium text-brand-mauve rounded ${FOCUS}`} aria-label={`Ver detalles de ${p.title}`}>
            Ver detalles <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span aria-hidden="true" className="absolute left-0 bottom-0 h-px w-full bg-brand-gold origin-left scale-x-[0.35] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Programs = () => {
  const threadRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: threadRef, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const dotTop = useTransform(line, [0, 1], ["0%", "100%"]);
  return (
    <section id="programas" aria-labelledby="programas-titulo" className="px-6 py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 md:text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-muted-foreground">Formación & Acompañamiento</span>
          <h2 id="programas-titulo" className="font-serif text-3xl md:text-5xl font-normal text-foreground mt-2"><MaskLine>Mis programas y espacios</MaskLine></h2>
          <p className="text-muted-foreground font-light text-sm italic mt-2">Recorridos para comprender lo que vives y recuperar tu equilibrio.</p>
        </div>
        <div ref={threadRef} className="relative space-y-20 md:space-y-28">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-2 md:left-1/2 w-px bg-brand-gold/15">
            <motion.div className="absolute inset-0 bg-brand-gold/70 origin-top" style={reduce ? undefined : { scaleY: line }} />
            {!reduce && <motion.span className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-brand-gold" style={{ top: dotTop }} />}
          </div>
          {PROGRAMS.map((p, i) => <ProgramBlock key={p.href} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
};

/* ───────────── 6. Quién te acompaña ───────────── */
const Companion = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);
  const para = "text-foreground/80 leading-relaxed font-light text-lg";
  return (
    <section ref={ref} aria-labelledby="acompana-titulo" className="relative overflow-hidden px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[5fr_6fr] gap-12 md:gap-16 items-center">
        <div className="relative mx-auto w-full max-w-[340px] md:max-w-[400px]">
          <motion.div aria-hidden="true" className="absolute -inset-16 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-mauve)/0.35) 0%, hsl(var(--warm-peach)/0.45) 40%, transparent 70%)" }}
            animate={reduce ? undefined : { scale: [1, 1.06, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div aria-hidden="true" style={reduce ? undefined : { y: frameY }}
            className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 rounded-t-full rounded-b-3xl border-2 border-brand-gold/70" />
          <div className="relative aspect-[3/4] rounded-t-full rounded-b-3xl overflow-hidden shadow-xl">
            <motion.img src={fransuryImage} alt="Fransury Gonzáles" loading="lazy" style={reduce ? undefined : { y: photoY, scale: 1.1 }}
              className="w-full h-full object-cover object-top" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-card/60 backdrop-blur-md border border-card/60 px-5 py-3 text-center">
              <p className="font-serif text-xl font-semibold text-foreground">Fransury Gonzáles</p>
            </div>
          </div>
          <RotatingOrnament className="w-24 h-24 -top-6 -right-6" />
        </div>
        <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.2 } } }} className="space-y-5 text-center md:text-left">
          <motion.span variants={fadeUp} className="block text-xs font-semibold tracking-[0.3em] uppercase text-brand-mauve">Acompañamiento Humano</motion.span>
          <h2 id="acompana-titulo" className={H2}><MaskLine>Quién te acompaña</MaskLine></h2>
          <motion.p variants={fadeUp} className={para}>
            Soy psicóloga, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante de la psique y el alma humana.
          </motion.p>
          <motion.p variants={fadeUp} className={para}>
            Mi propósito es acompañarte a <Highlight>sanar experiencias difíciles</Highlight>, a transformar el significado de lo que viviste y a <Highlight delay={0.3}>habitar una vida en mayor plenitud</Highlight>. Lo haremos integrando el yoga, como medicina ancestral, con la comprensión de algunos factores psicológicos, para que aprendas a <Highlight delay={0.6}>regular tu sistema nervioso</Highlight>.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/quien-soy" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-brand-mauve/50 text-brand-mauve hover:bg-brand-cream transition-colors ${FOCUS}`}>
              Conoce mi historia <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ───────────── 7. Filosofía: scroll narrativo ───────────── */
const PhaseOneText = () => (
  <>
    <h3 className="font-serif text-3xl md:text-5xl font-semibold">
      Salir del <span className="inline-block">modo</span> <span className="jitter-word inline-block">supervivencia</span>
    </h3>
    <p className="text-base md:text-lg font-light leading-relaxed opacity-90 max-w-xl mx-auto">
      Gran parte del sufrimiento emerge cuando vivimos reaccionando, controlando y desconectados del cuerpo. Santosha propone restaurar el sistema nervioso para <Highlight>volver a habitar el presente</Highlight>.
    </p>
  </>
);
const PhaseTwoText = () => (
  <>
    <h3 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">¿Qué es Santosha?</h3>
    <p className="text-base md:text-lg text-foreground/80 font-light leading-relaxed max-w-xl mx-auto">
      Santosha es un Niyama sánscrito que habla de contentamiento. Para mí, va más allá de conformarse: es cultivar una <Highlight>presencia profunda, calma consciente y equilibrio</Highlight> tanto en la expansión como en la incertidumbre.
    </p>
  </>
);
const ManifestoLink = () => (
  <Link to="/filosofia" className={`${BTN_SOLID} ${FOCUS}`}>Leer el manifiesto completo de Santosha →</Link>
);

const Philosophy = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const plum = useTransform(p, [0.3, 0.5], [1, 0]);
  const one = useTransform(p, [0.28, 0.42], [1, 0]);
  const oneY = useTransform(p, [0.28, 0.42], ["0px", "-40px"]);
  const two = useTransform(p, [0.45, 0.6], [0, 1]);
  const twoY = useTransform(p, [0.45, 0.6], ["40px", "0px"]);
  const wordX = useTransform(p, [0, 1], ["10%", "-35%"]);
  const calm = [useTransform(p, [0.55, 0.62], [0, 1]), useTransform(p, [0.6, 0.67], [0, 1]), useTransform(p, [0.65, 0.72], [0, 1]), useTransform(p, [0.7, 0.77], [0, 1])];
  const cta = useTransform(p, [0.78, 0.88], [0, 1]);

  if (reduce) {
    return (
      <section aria-labelledby="filo-titulo">
        <div className="bg-brand-ink text-brand-cream px-6 py-16 text-center space-y-5">
          <h2 id="filo-titulo" className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-gold">Mi filosofía de trabajo</h2>
          <PhaseOneText />
          <p className="text-sm text-brand-cream/85">{RESTLESS.join(" · ")}</p>
        </div>
        <div className="bg-brand-cream px-6 py-16 text-center space-y-5">
          <PhaseTwoText />
          <p className="text-sm text-foreground/75">{CALM.join(" · ")}</p>
          <ManifestoLink />
        </div>
      </section>
    );
  }

  const restlessPos = ["top-[14%] left-[6%]", "top-[20%] right-[6%]", "bottom-[18%] left-[10%]", "bottom-[12%] right-[8%]"];
  return (
    <section ref={ref} aria-labelledby="filo-titulo" className="relative h-[260vh] md:h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-brand-cream">
        <motion.div aria-hidden="true" style={{ opacity: plum }} className="absolute inset-0 bg-brand-ink" />
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-60">
          <OutlineWord word="SANTOSHA" x={wordX} className="block text-[clamp(8rem,30vw,26rem)]" />
        </div>

        {/* Fase 1 */}
        <motion.div style={{ opacity: one, y: oneY }} className="absolute inset-0 flex items-center justify-center px-6">
          {RESTLESS.map((w, i) => (
            <motion.span key={w} aria-hidden="true" className={`absolute ${restlessPos[i]} font-serif italic text-lg md:text-3xl text-brand-cream/60`}
              animate={{ x: [0, 6, -5, 3, 0], y: [0, -4, 5, -2, 0] }} transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}>
              {w}
            </motion.span>
          ))}
          <div className="relative text-center space-y-5 text-brand-cream max-w-2xl">
            <h2 id="filo-titulo" className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-gold">Mi filosofía de trabajo</h2>
            <PhaseOneText />
            <p className="sr-only">{RESTLESS.join(" · ")}</p>
          </div>
        </motion.div>

        {/* Fase 2 */}
        <motion.div style={{ opacity: two, y: twoY }} className="absolute inset-0 flex items-center justify-center px-6">
          <BreathingCircle className="absolute w-[min(88vw,560px)] aspect-square" />
          <div className="relative text-center space-y-4 md:space-y-5 max-w-2xl">
            <PhaseTwoText />
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-brand-mauve font-serif italic text-lg md:text-2xl">
              {CALM.map((w, i) => (
                <motion.li key={w} style={{ opacity: calm[i] }}>{w}</motion.li>
              ))}
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
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>
      <Seo
        title="SantoSha | Psicoterapia, yoga y meditación online"
        description="Psicoterapia individual y de pareja, Kundalini Yoga y meditación con Fransury Gonzáles. Atención virtual desde cualquier lugar."
        path="/"
      />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <Hero onFreeClass={openFree} />
        <LogoMarquee />
        <Companion />
        <StartSelector />
        <Programs />
        <Philosophy />

        {/* Cierre */}
        <section className="px-6 py-16 md:py-24 bg-gradient-to-b from-brand-cream to-warm-mauve/50">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h2 variants={fadeUp} className={H2}>¿Quieres empezar? <Highlight delay={0.4}>Escríbeme.</Highlight></motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              <a href={getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.")} target="_blank" rel="noopener noreferrer" className={`${BTN_SOLID} ${FOCUS}`}>
                <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp
              </a>
              <button type="button" onClick={openFree} className={`${BTN_OUTLINE} ${FOCUS}`}>
                <Gift className="w-5 h-5 text-brand-mauve" /> Acceder a la Clase Gratis
              </button>
            </motion.div>
            <p className="text-xs text-muted-foreground">Atención virtual desde cualquier lugar del mundo.</p>
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
