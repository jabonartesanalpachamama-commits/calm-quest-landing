/**
 * PORTADA — una sola narrativa: de lo inquieto a lo calmado.
 * Gramática común (nace de «Mi filosofía de trabajo», que no se modifica):
 *  - Motivo recurrente: el círculo que respira (BreathingCircle). Reaparece con otra escala y lugar en
 *    cada capítulo: halo detrás de Fransury, punto del hilo dorado en programas, cierre.
 *  - Palabras gigantes en contorno (OutlineWord) como textura: «Presencia» (Quién te acompaña),
 *    «habitar» (Programas) y SANTOSHA (Filosofía). Solo palabras que ya aparecen en la portada.
 *  - Cada capítulo empieza inquieto (desfase leve, opacidad baja) y se asienta al llegar al centro.
 *  - Un mecanismo distinto por capítulo: hero = asentamiento de palabras; Quién te acompaña = revelado por
 *    máscara de línea + parallax entre capas; ¿Por dónde empiezo? = filas que se alinean con el scroll y
 *    líneas que se dibujan; Programas = clip-path horizontal / título a contravelocidad / texto cruzando la
 *    foto; Filosofía y cierre = iluminación palabra a palabra (ScrollFillText, solo ahí).
 *  - Tipografía: serif con mezcla de redonda e itálica, rótulos en versalitas con tracking amplio,
 *    medidas cortas. Nada de píldoras, chips, óvalos ni marcos. Máximo 2 resaltados por sección,
 *    como subrayado dorado fino que se dibuja (GoldLine) o itálica ciruela.
 *  - Scroll nativo; solo transform/opacity/clip-path; con movimiento reducido todo queda quieto.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence, motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, PlayCircle, X } from "lucide-react";
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
import { EASE, fadeUp, inView } from "@/components/landing";
import { ScrollFillText } from "@/components/landing/ScrollFillText";
import SectionTransition from "@/components/SectionTransition";
import LogoMarquee from "@/components/landing/LogoMarquee";
import { Highlight } from "@/components/landing/Highlight";
import { BreathingCircle, OutlineWord } from "@/components/landing/Breath";

// Foto del hero: cambiar solo esta línea para usar otra imagen.
const HERO_IMAGE = heroBackground.url;

const BTN_SOLID = "inline-flex items-center gap-3 px-7 py-3.5 rounded-[3px] text-sm tracking-[0.12em] uppercase font-medium justify-center transition-colors duration-300 bg-brand-mauve hover:bg-brand-ink text-primary-foreground";
const LINK_LINE = "group relative inline-flex items-center gap-2 py-1 text-sm tracking-[0.12em] uppercase font-medium text-brand-mauve";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
const H2 = "font-serif text-3xl md:text-5xl font-normal text-foreground";
const LABEL = "block text-[11px] uppercase tracking-[0.35em] text-brand-mauve [font-variant:small-caps]";
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

/** Resaltado de la portada: itálica ciruela con un subrayado dorado de 1 px que se dibuja (funciona en varias líneas). */
const GoldLine = ({ children, delay = 0.2 }: { children: React.ReactNode; delay?: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span className="font-serif italic text-brand-ink"
      style={{ backgroundImage: "linear-gradient(hsl(var(--brand-gold)), hsl(var(--brand-gold)))", backgroundRepeat: "no-repeat", backgroundPosition: "0 100%", WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", paddingBottom: "0.08em" }}
      initial={{ backgroundSize: reduce ? "100% 1px" : "0% 1px" }} whileInView={{ backgroundSize: "100% 1px" }}
      viewport={{ once: true, margin: "-20% 0px -20% 0px" }} transition={{ duration: reduce ? 0 : 1.1, delay, ease: [0.65, 0, 0.35, 1] }}>
      {children}
    </motion.span>
  );
};

/** Párrafo que se revela de arriba abajo con una máscara de línea (clip-path), empezando algo desplazado. */
const ClipReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.p className={className} initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)", y: 14, opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1 }} viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}>
      {children}
    </motion.p>
  );
};

/** Palabras que llegan inquietas (desfase y giro leves) y se asientan. */
const SettleWords = ({ text, className = "", start = 0 }: { text: string; className?: string; start?: number }) => (
  <>
    {text.split(" ").map((w, i) => (
      <motion.span key={i} aria-hidden="true" className={`inline-block mr-[0.22em] ${className}`}
        variants={{
          hidden: { opacity: 0.12, y: (i % 2 ? -1 : 1) * 16, rotate: (i % 2 ? -2.5 : 2.5) },
          show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 1.3, delay: 0.25 + (start + i) * 0.08, ease: EASE } },
        }}>
        {w}
      </motion.span>
    ))}
  </>
);

/* ───────────── Hero ───────────── */
const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const desktop = useMedia("(min-width: 768px)");
  const goProgramas = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#programas")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const title = "Del modo supervivencia a la calma consciente";
  return (
    <section ref={ref} className="relative md:min-h-[100svh] overflow-hidden flex flex-col md:flex-row md:items-center bg-brand-cream">
      <div className="relative h-[55svh] md:absolute md:inset-0 md:h-auto overflow-hidden">
        <motion.img src={HERO_IMAGE} alt="Mujer meditando al amanecer sobre las montañas"
          style={reduce ? undefined : { y, scale }}
          className="absolute inset-0 w-full h-full object-cover object-[85%_30%] md:object-[70%_30%] will-change-transform" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-cream to-transparent md:hidden" />
        <div aria-hidden="true" className="hidden md:block absolute inset-0 bg-gradient-to-r from-brand-cream from-25% via-brand-cream/75 via-45% to-transparent to-70%" />
      </div>
      <motion.div initial={reduce ? "show" : "hidden"} animate="show"
        style={reduce || !desktop ? undefined : { y: textY, opacity: textOpacity }}
        className="relative w-full max-w-6xl mx-auto px-6 -mt-10 pb-14 md:mt-0 md:py-28">
        <div className="max-w-xl text-center md:text-left">
          <motion.h1 aria-label={title} className="font-serif text-[2.6rem] md:text-6xl lg:text-7xl font-light leading-[1.05] text-foreground">
            <SettleWords text="Del modo supervivencia a la" />
            <SettleWords text="calma consciente" start={5} className="italic text-brand-mauve" />
          </motion.h1>
          <motion.span aria-hidden="true" className="block mx-auto md:mx-0 h-px w-16 bg-brand-gold origin-left mt-8 mb-6"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, delay: 0.9, ease: EASE } } }} />
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 1.05, ease: EASE } } }} className="space-y-3">
            <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed">Hola, soy Fransury Gonzáles (Sury), psicóloga y maestra de Kundalini Yoga.</p>
            <p className="font-serif italic text-lg md:text-xl text-brand-mauve leading-relaxed max-w-[34ch] mx-auto md:mx-0">Quiero acompañarte a sanar experiencias difíciles y habitar una vida en mayor plenitud.</p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 1.3 } } }} className="pt-8">
            <a href="#programas" onClick={goProgramas} className={`${BTN_SOLID} ${FOCUS} w-full sm:w-auto`}>
              Mira cómo te acompaño
              <motion.span className="inline-flex" animate={reduce ? undefined : { y: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
              </motion.span>
            </a>
          </motion.div>
        </div>
      </motion.div>
      {!reduce && (
        <div aria-hidden="true" className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-brand-mauve/80">
          <span className="text-[10px] uppercase tracking-[0.35em]">Desliza</span>
          <span className="relative block w-px h-10 overflow-hidden bg-brand-gold/25">
            <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-brand-gold" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          </span>
        </div>
      )}
    </section>
  );
};

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
          className="fixed z-[45] inset-x-3 bottom-[5.5rem] md:inset-x-auto md:right-6 md:bottom-24 md:w-[360px] rounded-[4px] bg-brand-ink text-brand-cream shadow-2xl p-5 md:p-6">
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"
            className={`absolute top-2.5 right-2.5 w-11 h-11 inline-flex items-center justify-center text-brand-cream/80 hover:text-brand-cream ${FOCUS}`}>
            <X className="w-5 h-5" />
          </button>
          <span className="block text-[10px] uppercase tracking-[0.35em] text-brand-gold">Entrada Gratuita</span>
          <p id="popup-clase-titulo" className="font-serif text-xl md:text-2xl font-normal mt-3 pr-8 leading-snug">¿Sufres de ansiedad o agotamiento mental?</p>
          <p className="text-sm text-brand-cream/90 font-light mt-2 leading-relaxed">Una clase online de 30 minutos donde aprendes una técnica somática para ayudar a calmar tu sistema nervioso.</p>
          <button type="button" onClick={() => { setOpen(false); onStart(); }}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[3px] text-sm tracking-[0.1em] uppercase font-medium bg-brand-cream text-brand-ink hover:bg-card transition-colors ${FOCUS}`}>
            <PlayCircle className="w-5 h-5" strokeWidth={1.5} /> Comenzar Clase Maestra
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

/* ───────────── ¿Por dónde empiezo? — filas que se alinean con el scroll ───────────── */
const StartRow = ({ text, to, i }: { text: string; to: string; i: number }) => {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 55%"] });
  const x = useTransform(scrollYProgress, [0, 1], [(i % 2 ? -1 : 1) * (desktop ? 36 : 14), 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  return (
    <li ref={ref} className="group relative">
      <Link to={to} className={`flex items-baseline justify-between gap-5 py-6 md:py-7 min-h-[56px] ${FOCUS}`}>
        <motion.span style={reduce ? undefined : { x, opacity }}
          className="block font-serif font-normal text-[22px] md:text-[28px] leading-snug text-brand-ink">
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">{text}</span>
        </motion.span>
        <ArrowRight aria-hidden="true" className="shrink-0 w-5 h-5 text-brand-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-mauve" strokeWidth={1} />
      </Link>
      <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-px bg-brand-gold/15" />
      <motion.span aria-hidden="true" style={reduce ? undefined : { scaleX: scrollYProgress }}
        className="absolute left-0 right-0 bottom-0 h-px origin-left bg-brand-gold/60 group-hover:bg-brand-gold transition-colors duration-300" />
    </li>
  );
};

const StartSelector = () => (
  <section aria-labelledby="empiezo-titulo" className="px-6 py-16 md:py-24">
    <div className="max-w-6xl mx-auto grid md:grid-cols-[4fr_7fr] gap-8 md:gap-16">
      <motion.div {...inView} variants={fadeUp} className="md:pt-6 md:sticky md:top-[18vh] self-start">
        <h2 id="empiezo-titulo" className={LABEL}>¿Por dónde empiezo?</h2>
        <span aria-hidden="true" className="block w-14 h-px bg-brand-gold my-5" />
        <p className="font-serif italic text-2xl md:text-3xl text-foreground/80 leading-snug max-w-[18ch]">Elige lo que más se parece a tu momento.</p>
      </motion.div>
      <ul>
        {START_OPTIONS.map(({ text, to }, i) => <StartRow key={to} text={text} to={to} i={i} />)}
      </ul>
    </div>
  </section>
);

/* ───────────── Programas: escenas editoriales a sangre ───────────── */
const ProgramTitle = ({ title }: { title: string }) => {
  const words = title.split(" ");
  const last = words.pop();
  return <>{words.join(" ")} <em className="italic text-brand-mauve">{last}</em></>;
};

const ProgramScene = ({ p, i }: { p: (typeof PROGRAMS)[number]; i: number }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const motionOn = !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const counterX = useTransform(scrollYProgress, [0, 1], desktop ? ["14%", "-10%"] : ["6%", "-4%"]);
  const crossY = useTransform(scrollYProgress, [0, 1], desktop ? [90, -90] : [30, -30]);
  const flip = i % 2 === 1;
  // Escena 1: la foto se revela con clip-path horizontal. Escena 2: título a contravelocidad. Escena 3: el título cruza sobre la foto.
  const reveal = i === 0;
  const mask = flip
    ? "md:[mask-image:linear-gradient(to_left,black_45%,transparent_95%)] md:[-webkit-mask-image:linear-gradient(to_left,black_45%,transparent_95%)]"
    : "md:[mask-image:linear-gradient(to_right,black_45%,transparent_95%)] md:[-webkit-mask-image:linear-gradient(to_right,black_45%,transparent_95%)]";
  return (
    <article ref={ref} className="relative md:min-h-[88vh] flex flex-col md:flex-row md:items-center">
      <motion.div
        initial={reveal && motionOn ? { clipPath: flip ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" } : false}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 1.6, ease: EASE }}
        className={`relative h-[62vw] max-h-[460px] md:max-h-none md:h-auto md:absolute md:inset-y-0 md:w-[62%] ${flip ? "md:right-0" : "md:left-0"} overflow-hidden
          [mask-image:linear-gradient(to_bottom,black_55%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${mask}`}>
        <motion.img src={p.image} alt="" loading="lazy" style={motionOn ? { y: imgY, scale: 1.16 } : undefined}
          className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/4 hidden md:block" style={{ background: "linear-gradient(to bottom, var(--page-bg), transparent)" }} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(to top, var(--page-bg), transparent)" }} />
      </motion.div>
      <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 -mt-12 md:mt-0 flex ${flip ? "md:justify-start" : "md:justify-end"}`}>
        <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-md">
          <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">{p.subtitle}</motion.p>
          <motion.h3
            style={motionOn ? (i === 1 ? { x: counterX } : i === 2 ? { y: crossY } : undefined) : undefined}
            className={`font-serif font-light text-[40px] md:text-[64px] leading-[1.02] text-foreground mt-4 ${i === 2 ? "md:-ml-40 lg:-ml-56 mix-blend-multiply" : ""}`}>
            <ProgramTitle title={p.title} />
          </motion.h3>
          <motion.p variants={fadeUp} className="mt-6 text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-[38ch]">{p.desc}</motion.p>
          <motion.p variants={fadeUp} className="mt-5 text-[11px] uppercase tracking-[0.28em] text-brand-mauve leading-loose">
            {p.features.join(" · ")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6">
            <Link to={p.href} className={`${LINK_LINE} ${FOCUS}`} aria-label={`Ver detalles de ${p.title}`}>
              Ver detalles <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} />
              <span aria-hidden="true" className="absolute left-0 bottom-0 h-px w-full bg-brand-gold origin-left scale-x-[0.35] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
};

const Programs = () => {
  const threadRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: threadRef, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const dotTop = useTransform(line, [0, 1], ["0%", "100%"]);
  const { scrollYProgress: secP } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const wordX = useTransform(secP, [0, 1], ["20%", "-35%"]);
  return (
    <section ref={sectionRef} id="programas" aria-labelledby="programas-titulo" className="relative overflow-x-clip py-16 md:py-24 scroll-mt-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-10 md:top-16 flex justify-center">
        <OutlineWord word="habitar" x={reduce || !desktop ? undefined : wordX} className="text-[clamp(6rem,22vw,20rem)] italic" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 mb-12 md:mb-20 md:text-center">
        <span className={LABEL}>Formación &amp; Acompañamiento</span>
        <h2 id="programas-titulo" className="font-serif text-3xl md:text-6xl font-light text-foreground mt-4"><MaskLine>Mis programas y espacios</MaskLine></h2>
        <p className="font-serif italic text-lg text-muted-foreground mt-3">Recorridos para comprender lo que vives y recuperar tu equilibrio.</p>
      </div>
      <div ref={threadRef} className="relative space-y-16 md:space-y-10">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-3 md:left-6 w-px bg-brand-gold/15 z-20">
          <motion.div className="absolute inset-0 bg-brand-gold/70 origin-top" style={reduce ? undefined : { scaleY: line }} />
          {!reduce && (
            <motion.span className="absolute -left-[11px] w-[23px] h-[23px] -translate-y-1/2" style={{ top: dotTop }}>
              <BreathingCircle tone="gold" className="absolute inset-0" />
              <span className="absolute inset-[8px] rounded-full bg-brand-gold" />
            </motion.span>
          )}
        </div>
        {PROGRAMS.map((p, i) => <ProgramScene key={p.href} p={p} i={i} />)}
      </div>
    </section>
  );
};

/* ───────────── Quién te acompaña ───────────── */
const Companion = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], desktop ? ["-10%", "10%"] : ["-4%", "4%"]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);
  const para = "text-foreground/80 leading-relaxed font-light text-lg max-w-[52ch] mx-auto md:mx-0";
  return (
    <section ref={ref} aria-labelledby="acompana-titulo" className="relative overflow-x-clip px-6 py-16 md:py-24">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
        <OutlineWord word="Presencia" x={reduce || !desktop ? undefined : wordX} className="text-[clamp(5rem,20vw,19rem)]" />
      </div>
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-[6fr_5fr] gap-6 md:gap-16 items-start">
        <div className="relative mx-auto w-full max-w-[380px] md:max-w-none md:sticky md:top-[10vh]">
          <div aria-hidden="true" className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[115%] aspect-square"><BreathingCircle className="absolute inset-0" /></div>
          <div className="relative aspect-[4/5] overflow-hidden [mask-image:radial-gradient(ellipse_50%_50%_at_50%_42%,black_40%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_50%_50%_at_50%_42%,black_40%,transparent_78%)]">
            <motion.img src={fransuryImage} alt="Fransury Gonzáles" loading="lazy" style={reduce ? undefined : { y: photoY, scale: 1.18 }}
              className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>
        </div>
        <div className="space-y-6 text-center md:text-left md:py-[12vh]">
          <span className={LABEL}>Acompañamiento Humano</span>
          <h2 id="acompana-titulo" className="font-serif text-4xl md:text-6xl font-light text-foreground leading-[1.05]">
            <MaskLine>Quién te</MaskLine><MaskLine delay={0.12} className="italic text-brand-mauve">acompaña</MaskLine>
          </h2>
          <p className="font-serif text-2xl text-foreground">Fransury Gonzáles</p>
          <span aria-hidden="true" className="block mx-auto md:mx-0 w-14 h-px bg-brand-gold" />
          <ClipReveal className={para}>Soy psicóloga, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante de la psique y el alma humana.</ClipReveal>
          <ClipReveal className={para} delay={0.1}>
            Mi propósito es acompañarte a <GoldLine>sanar experiencias difíciles</GoldLine>, a transformar el significado de lo que viviste y a <GoldLine delay={0.5}>habitar una vida en mayor plenitud</GoldLine>. Lo haremos integrando el yoga, como medicina ancestral, con la comprensión de algunos factores psicológicos, para que aprendas a regular tu sistema nervioso.
          </ClipReveal>
          <div className="pt-2">
            <Link to="/quien-soy" className={`${LINK_LINE} ${FOCUS}`}>
              Conoce mi historia <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" strokeWidth={1.25} />
              <span aria-hidden="true" className="absolute left-0 bottom-0 h-px w-full bg-brand-gold origin-left scale-x-[0.35] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </div>
        </div>
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
const CREAM = "hsl(26 41% 92%)";
const PEACH = "hsl(22 75% 90%)";
const PLUM = "hsl(327 26% 22%)";

/** Fondo continuo: interpola el color de la portada según el capítulo visible (scroll nativo). */
const usePageBackground = (marks: React.RefObject<HTMLElement>[]) => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [stops, setStops] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  useLayoutEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const tops = marks.map((r) => (r.current ? r.current.getBoundingClientRect().top + window.scrollY : 0));
      const [start, programs, philo] = tops;
      setStops([start - vh * 0.7, start - vh * 0.3, programs - vh * 0.6, programs - vh * 0.2, philo - vh * 0.5, philo]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [marks]);
  const bg = useTransform(scrollY, stops, [CREAM, PEACH, PEACH, CREAM, CREAM, PLUM]);
  const bgVar = useMotionTemplate`${bg}`;
  return reduce ? CREAM : bgVar;
};

const PortalHome = () => {
  const { settings, palette } = useVisualSettings();
  const [freeClassOpen, setFreeClassOpen] = useState(false);
  const openFree = () => setFreeClassOpen(true);
  const startRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const philoRef = useRef<HTMLDivElement>(null);
  const [marks] = useState(() => [startRef, programsRef, philoRef]);
  const pageBg = usePageBackground(marks);

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>
      <Seo
        title="SantoSha | Psicoterapia, yoga y meditación online"
        description="Psicoterapia individual y de pareja, Kundalini Yoga y meditación con Fransury Gonzáles. Atención virtual desde cualquier lugar."
        path="/"
      />
      <Header palette={palette} brandName={settings?.brandName} />

      <motion.main className="flex-grow" style={{ ["--page-bg" as string]: pageBg, backgroundColor: "var(--page-bg)" }}>
        <Hero />
        <LogoMarquee />
        <Companion />
        <div ref={startRef}><StartSelector /></div>
        <div ref={programsRef}><Programs /></div>
        <SectionTransition from="transparent" to={PLUM} />
        <div ref={philoRef} />
        <Philosophy />

        {/* Cierre: el círculo que respira vuelve, ahora grande y quieto en el centro */}
        <section className="relative overflow-hidden px-6 pt-16 md:pt-24 pb-32 md:pb-40" style={{ background: `linear-gradient(to bottom, ${CREAM} 0%, ${CREAM} 55%, hsl(var(--warm-mauve)) 75%, ${PLUM} 100%)` }}>
          <div aria-hidden="true" className="absolute inset-0 flex justify-center pt-4 md:pt-8">
            <BreathingCircle className="relative w-[min(90vw,520px)] aspect-square" />
          </div>
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="relative max-w-3xl mx-auto text-center space-y-6">
            <h2 className={H2}><ScrollFillText as="span" text="¿Quieres empezar? [[Escríbeme.]]" offset={["start 90%", "end 60%"]} /></h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed max-w-[40ch] mx-auto">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
              <a href={getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.")} target="_blank" rel="noopener noreferrer" className={`${BTN_SOLID} ${FOCUS}`}>
                Escribir por WhatsApp <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
              <button type="button" onClick={openFree} className={`${LINK_LINE} ${FOCUS}`}>
                Acceder a la Clase Gratis <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} aria-hidden="true" />
                <span aria-hidden="true" className="absolute left-0 bottom-0 h-px w-full bg-brand-gold origin-left scale-x-[0.35] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </button>
            </motion.div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Atención virtual desde cualquier lugar del mundo.</p>
          </motion.div>
        </section>
      </motion.main>

      <SiteFooter palette={palette} />
      <FreeClassPopup onStart={openFree} />
      <AiChatWidget pageSlug="home" />
      <FreeClassDialog open={freeClassOpen} onOpenChange={setFreeClassOpen} />
    </div>
  );
};

export default PortalHome;
