import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, MotionConfig } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Leaf, MessageCircle, Moon, CalendarDays, Clock, Video, ArrowDown } from "lucide-react";
import { Helmet } from "react-helmet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";

type Phase = "nueva" | "creciente" | "llena" | "menguante" | "completa";

const MoonPhase = ({ phase, className = "w-6 h-6" }: { phase: Phase; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
    {phase === "creciente" && <path d="M12 3A9 9 0 0 1 12 21A4.5 9 0 0 0 12 3Z" fill="currentColor" />}
    {phase === "llena" && <circle cx="12" cy="12" r="9" fill="currentColor" />}
    {phase === "menguante" && <path d="M12 3A9 9 0 0 0 12 21A4.5 9 0 0 1 12 3Z" fill="currentColor" />}
    {phase === "completa" && (
      <>
        <circle cx="12" cy="12" r="6" fill="currentColor" />
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      </>
    )}
  </svg>
);

const LEARNING_POINTS: { phase: Phase; text: string }[] = [
  { phase: "nueva", text: "Comprender tu naturaleza cíclica y las fases que habitan tu experiencia femenina." },
  { phase: "creciente", text: "Reconocer tus propios patrones emocionales, energéticos y corporales, entendiendo cómo se expresa tu ciclo en tu vida cotidiana." },
  { phase: "llena", text: "Desarrollar herramientas prácticas de observación y autoconocimiento, para interpretar las señales de tu cuerpo con mayor claridad y compasión." },
  { phase: "menguante", text: "Transformar tu relación con tu ciclo y con tu cuerpo, dejando atrás la desconexión, la culpa o la lucha constante." },
  { phase: "completa", text: "Organizar tus semanas según tu energía: saber cuándo te conviene hacer más y cuándo te conviene bajar el ritmo." },
];

const ETAPAS = ["Menstrúo cada mes", "Mis ciclos son irregulares", "Uso anticonceptivos", "Estoy en la perimenopausia", "Ya viví la menopausia"];

const CUPO_URL = getWhatsAppUrl("Hola Fransu, quiero mi cupo para el taller Sabiduría Cíclica del 17 de octubre");
const DUDA_URL = getWhatsAppUrl("Hola Fransu, tengo una pregunta sobre el taller Sabiduría Cíclica");

// Precio de lanzamiento vigente hasta el 10 de octubre de 2026 23:59 hora Colombia (UTC-5)
const LAUNCH_DEADLINE = new Date("2026-10-11T00:00:00-05:00").getTime();
const isLaunchPrice = () => Date.now() < LAUNCH_DEADLINE;

const TESTIMONIOS = [
  { name: "Goretti", country: "México", quote: "Gracias por ser nuestra guía de amor y sanación. Estuvo intenso, pero muy mágico y de tanta conciencia. Gracias por hacer este tipo de talleres." },
  { name: "Martha G.", country: "Estados Unidos", quote: "Nunca me había puesto a pensar en mi periodo de esa manera. Es mucha información para entender, procesar e integrar, y me di cuenta de lo descuidada que había sido conmigo misma. Gracias." },
  { name: "Verónica I.", country: "México", quote: "Terminamos cansadas, pero felices. Aprendí mucho sobre un tema que no tenía tan presente y del que hoy tomo conciencia. Gracias por ser mi guía." },
];

const FAQS = [
  { q: "¿Necesito experiencia previa?", a: "No. El taller está pensado para cualquier mujer que quiera comprender su ciclo, sin importar si ha practicado yoga o no." },
  { q: "¿Es para mí si ya no menstrúo?", a: "Sí. El taller es para todas las mujeres, en cualquier etapa: también si estás en la perimenopausia o ya viviste la menopausia." },
  { q: "Uso anticonceptivos o mis ciclos son irregulares. ¿Me sirve?", a: "Sí. Aprenderás a observar los ritmos de tu energía y tu ánimo desde tu situación actual. Si tienes una duda puntual, escríbeme antes de inscribirte y lo revisamos juntas." },
  { q: "¿Qué necesito para conectarme?", a: "Un celular o computador con internet, un lugar tranquilo y un cuaderno. Si aún menstrúas, ten a mano la fecha de tu última menstruación." },
  { q: "¿A qué hora es en mi país?", a: "El taller es de 10:00 a. m. a 2:00 p. m. hora Colombia. Equivale a 9:00 a. m. a 1:00 p. m. en Ciudad de México y 11:00 a. m. a 3:00 p. m. en Miami y Nueva York. Si estás en otro país, escríbeme y te confirmo tu horario." },
  { q: "¿Cómo pago?", a: "Al escribirme por WhatsApp te comparto los medios de pago. Si pagas desde Colombia, el valor se convierte a pesos con la tasa de cambio del día." },
  { q: "¿Qué pasa después de inscribirme?", a: "Te confirmo tu cupo por WhatsApp y unos días antes del taller te envío el enlace de Google Meet y lo que necesitas tener a mano." },
];

const INCLUYE = [
  "Taller en vivo de 4 horas por Google Meet",
  "Las fases de tu ciclo y cómo se expresan en tu cuerpo, tu energía y tus emociones",
  "Herramientas prácticas para observar y registrar tu ciclo",
  "Espacio de círculo para compartir y hacer preguntas",
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const inView = { initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, margin: "-60px" } };

/** Título que aparece palabra por palabra */
const RevealTitle = ({ text, as = "h2", className = "" }: { text: string; as?: "h1" | "h2"; className?: string }) => {
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

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Carrusel de testimonios con avance automático */
const TestimonialsCarousel = () => {
  const reduce = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", duration: 32 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => emblaApi && setSelected(emblaApi.selectedScrollSnap()), [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused || reduce) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 5500);
    return () => window.clearInterval(id);
  }, [emblaApi, paused, reduce]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {TESTIMONIOS.map((t) => (
            <div key={t.name} className="flex-[0_0_100%] min-w-0 px-2">
              <figure className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/40 text-center">
                <blockquote className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed italic">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center justify-center gap-3">
                  <span className="relative w-11 h-11 rounded-full bg-gradient-to-br from-warm-mauve to-warm-gold flex items-center justify-center">
                    <span className="font-serif text-lg font-semibold text-primary">{t.name.charAt(0)}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card flex items-center justify-center text-primary">
                      <MoonPhase phase="creciente" className="w-3.5 h-3.5" />
                    </span>
                  </span>
                  <span className="text-left text-sm">
                    <span className="block font-semibold text-foreground">{t.name}</span>
                    <span className="block text-muted-foreground">{t.country}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-5">
        {TESTIMONIOS.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Ir al testimonio ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === selected ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

/** Línea de tiempo que se dibuja con el scroll */
const LearningTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border/50 md:-translate-x-1/2" />
      <motion.div style={{ scaleY }} className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-primary origin-top md:-translate-x-1/2" />
      <ol className="space-y-6 md:space-y-4">
        {LEARNING_POINTS.map(({ phase, text }, i) => {
          const right = i % 2 === 1;
          return (
            <motion.li
              key={text}
              {...inView}
              variants={{ hidden: { opacity: 0, x: right ? 20 : -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE, delay: 0.05 } } }}
              className={`relative pl-14 md:pl-0 md:w-1/2 ${right ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}
            >
              <span className={`absolute left-0 md:left-auto top-1 w-10 h-10 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary shadow-sm ${right ? "md:-left-5" : "md:-right-5"}`}>
                <MoonPhase phase={phase} className="w-5 h-5" />
              </span>
              <p className="bg-card/70 backdrop-blur-sm border border-border/40 rounded-2xl px-5 py-4 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                {text}
              </p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

const SabiduriaCiclica = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());
  const reduce = useReducedMotion();

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((i) => i.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as unknown as VisualIdentity;
        }
      } catch { /* local fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const launch = isLaunchPrice();
  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

  // Parallax
  const { scrollY } = useScroll();
  const k = reduce ? 0 : 1;
  const heroImgY = useTransform(scrollY, [0, 800], [0, 90 * k]);
  const deco1Y = useTransform(scrollY, [0, 3000], [0, -260 * k]);
  const deco2Y = useTransform(scrollY, [0, 3000], [0, 180 * k]);
  const deco3Y = useTransform(scrollY, [0, 4000], [0, -320 * k]);

  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(photoProgress, [0, 1], [30 * k, -30 * k]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col overflow-x-hidden`}>
        <Helmet>
          <title>Sabiduría Cíclica | Taller en vivo 17 de octubre | SantoSha</title>
          <meta name="description" content="Taller en vivo con Fransury González, psicóloga y maestra de Kundalini Yoga, para todas las mujeres: comprende tu naturaleza cíclica. Sábado 17 de octubre, 10 a. m. a 2 p. m. (Colombia), por Google Meet." />
        </Helmet>

        <Header palette={palette} brandName={settings?.brandName} />

        {/* Elementos decorativos con parallax */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div style={{ y: deco1Y }} className="absolute top-[38%] -left-24 w-72 h-72 rounded-full bg-warm-mauve/50 blur-3xl" />
          <motion.div style={{ y: deco2Y }} className="absolute top-[55%] -right-20 w-80 h-80 rounded-full bg-warm-gold/50 blur-3xl" />
          <motion.div style={{ y: deco3Y }} className="absolute top-[30%] right-[8%] text-primary/10 hidden md:block">
            <MoonPhase phase="creciente" className="w-24 h-24" />
          </motion.div>
          <motion.div style={{ y: deco1Y }} className="absolute top-[72%] left-[6%] text-primary/10 hidden md:block">
            <MoonPhase phase="menguante" className="w-16 h-16" />
          </motion.div>
        </div>

        <main className="flex-grow relative">

          {/* (1) HERO */}
          <section className="relative pt-6 md:pt-12 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-b from-warm-peach via-warm-gold/60 to-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--warm-mauve)/0.7),transparent_60%)] pointer-events-none" />
            <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div style={{ y: heroImgY }} className="relative -mx-4 md:mx-0">
                <div className="md:rounded-[2rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent)] md:shadow-[0_30px_60px_-30px_hsl(var(--primary)/0.35)] md:[mask-image:linear-gradient(to_bottom,black_88%,transparent)]">
                  <img
                    src="/sabiduria-ciclica-17oct.webp"
                    alt="Taller Sabiduría Cíclica, sábado 17 de octubre, 4 horas en vivo por Google Meet"
                    width={1254}
                    height={1254}
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-auto block"
                  />
                </div>
              </motion.div>

              <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-5 text-center md:text-left">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
                  <Flower2 className="w-3.5 h-3.5" /> Taller en vivo · Virtual
                </motion.span>
                <RevealTitle as="h1" text="Sabiduría Cíclica, Esencia Femenina" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
                <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                  Un taller en vivo para comprender tu naturaleza cíclica y escuchar lo que tu cuerpo te dice, en cualquier etapa de tu vida.
                </motion.p>
                <motion.ul variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
                  <li className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-3.5 py-2">
                    <CalendarDays className="w-4 h-4 text-primary" /> Sábado 17 de octubre
                  </li>
                  <li className="flex items-start gap-2 bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl px-3.5 py-2 text-left">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>10:00 a. m. a 2:00 p. m. hora Colombia
                      <span className="block text-[11px] text-muted-foreground">9:00 a. m. Ciudad de México · 11:00 a. m. Miami/Nueva York</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-3.5 py-2">
                    <Video className="w-4 h-4 text-primary" /> 4 horas en vivo por Google Meet
                  </li>
                </motion.ul>
                <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-1">
                  <a
                    href="#que-es"
                    onClick={scrollTo("#que-es")}
                    className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
                  >
                    Ver detalles del taller <ArrowDown className="w-4 h-4" />
                  </a>
                  <a href="#ciclica-precio" onClick={scrollTo("#ciclica-precio")} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    Quiero mi cupo
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* (2) QUÉ ES EL TALLER */}
          <section id="que-es" className="relative py-12 md:py-16 px-6 scroll-mt-20">
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-3xl mx-auto space-y-6 text-center">
              <motion.p variants={fadeUp} className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground/95">
                "¿Y si aquello que has interpretado como confusión, cansancio, sensibilidad intensa, desconexión o contradicción… fuera en realidad un lenguaje profundo de tu cuerpo intentando hablarte?"
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                Vivimos en una cultura que nos enseñó a funcionar de forma lineal, constante y productiva, desconectándonos de una verdad esencial: <strong className="text-foreground font-medium">la mujer es cíclica por naturaleza.</strong>
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                <strong className="text-foreground font-medium">Sabiduría Cíclica, Esencia Femenina</strong> es un viaje de autoconocimiento, conciencia corporal y reconexión con tu ritmo interno. Un espacio donde aprenderás a ver tu ciclo no como algo que hay que aguantar, sino como información valiosa sobre tu energía, tu ánimo y lo que necesitas.
              </motion.p>
            </motion.div>

            <motion.figure {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-2xl mx-auto mt-10 text-center">
              <motion.div
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
                className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
              />
              <motion.blockquote variants={fadeUp} className="font-serif text-2xl md:text-3xl font-light italic text-foreground leading-snug py-5">
                Tu ciclo no está en tu contra.<br />Tu cuerpo no es un problema que debas corregir.
              </motion.blockquote>
              <motion.figcaption variants={fadeUp} className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-primary">
                Vuelve a tu ritmo · Vuelve a tu cuerpo · Vuelve a tu esencia
              </motion.figcaption>
              <motion.div
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
                className="h-px w-24 mx-auto mt-5 bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
              />
            </motion.figure>
          </section>

          {/* (3) POR QUÉ NACE + QUIÉN TE GUÍA */}
          <section className="relative py-12 md:py-16 px-6 bg-gradient-to-b from-background via-warm-mauve/30 to-background">
            <div className="max-w-5xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 items-center">
              <motion.div ref={photoRef} style={{ y: photoY }} className="max-w-[300px] md:max-w-[340px] mx-auto w-full">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-t-full rounded-b-3xl bg-gradient-to-b from-warm-gold via-warm-mauve to-transparent blur-md opacity-80" />
                  <div className="relative rounded-t-full rounded-b-3xl overflow-hidden ring-1 ring-primary/20 [mask-image:linear-gradient(to_bottom,black_85%,transparent)]">
                    <img src="/fransury-sabiduria-ciclica.webp" alt="Fransury González, psicóloga y maestra de Kundalini Yoga" width={800} height={1394} loading="lazy" className="w-full h-auto block" />
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground tracking-wide">Fransury González · Psicóloga y maestra de Kundalini Yoga</p>
              </motion.div>

              <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="space-y-5 text-center md:text-left">
                <RevealTitle text="Por qué nace este taller" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
                <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                  Desde mi experiencia clínica, terapéutica y vivencial, he acompañado a muchas mujeres que viven alejadas de su cuerpo, peleadas con su menstruación, con sus cambios hormonales o peor aún en desconocimiento de estos, confundidas por sus cambios emocionales o desconectadas de su intuición natural.
                </motion.p>
                <motion.p variants={fadeUp} className={`font-serif text-lg font-medium ${palette.primaryText} italic`}>
                  Este taller nace para abrir un camino distinto: uno donde puedas comprenderte, escucharte y volver a ti.
                </motion.p>
                <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                  Soy Fransury González (Sury), psicóloga y maestra de Kundalini Yoga. En mi consulta he acompañado a muchas mujeres que viven peleadas con su ciclo o sin entenderlo. Este taller reúne lo que he aprendido desde la psicología y el yoga para que puedas escucharte con más claridad y compasión.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* (4) EN ESTE VIAJE APRENDERÁS A */}
          <section className="relative py-12 md:py-16 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <RevealTitle text="En este viaje aprenderás a:" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <LearningTimeline />
            </div>
          </section>

          {/* (5) PARA QUIÉN ES */}
          <section className="relative py-12 md:py-16 px-6 bg-gradient-to-b from-background via-warm-peach/50 to-background">
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="max-w-3xl mx-auto text-center space-y-6">
              <RevealTitle text="Este taller es para todas las mujeres" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                No importa en qué etapa estés. Si menstrúas cada mes, si tus ciclos son irregulares, si usas anticonceptivos, si estás en la perimenopausia o si ya viviste la menopausia, tu cuerpo sigue teniendo ritmos: cambian tu energía, tu ánimo y tu forma de relacionarte. En este taller aprenderás a reconocerlos y a escucharlos desde la etapa en la que estás hoy.
              </motion.p>
              <ul className="flex flex-wrap justify-center gap-2.5">
                {ETAPAS.map((e) => (
                  <motion.li
                    key={e}
                    variants={{ hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } } }}
                    className="flex items-center gap-2 bg-card/80 border border-primary/20 rounded-full px-4 py-2 text-sm text-foreground"
                  >
                    <Moon className="w-3.5 h-3.5 text-primary" /> {e}
                  </motion.li>
                ))}
              </ul>
              <motion.p variants={fadeUp} className={`font-serif text-2xl md:text-3xl font-semibold pt-2 ${palette.primaryText}`}>
                ¿Estás lista para volver a escucharte?
              </motion.p>
            </motion.div>
          </section>

          {/* (6) TESTIMONIOS */}
          <section className="relative py-12 md:py-16 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <RevealTitle text="Lo que dicen quienes ya vivieron el taller" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <TestimonialsCarousel />
            </div>
          </section>

          {/* (7) PRECIO */}
          <section id="ciclica-precio" className="relative py-12 md:py-16 px-6 scroll-mt-20 bg-gradient-to-b from-background via-warm-mauve/30 to-background">
            <motion.div {...inView} variants={fadeUp} className="max-w-md mx-auto space-y-6">
              <RevealTitle text="Tu inversión" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <div className={`bg-gradient-to-br ${palette.primary} rounded-3xl p-6 md:p-7 shadow-lg border-2 border-white/20`}>
                <div className="space-y-2 text-center text-white">
                  <h3 className="font-serif text-2xl font-semibold">Taller Sabiduría Cíclica</h3>
                  {launch && <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Precio de lanzamiento hasta el 10 de octubre</p>}
                  <div className="flex justify-center items-baseline gap-3">
                    <span className="text-5xl font-bold">USD {launch ? 60 : 75}</span>
                    {launch && <span className="text-xl line-through opacity-70">USD 75</span>}
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/15 border border-white/25 px-4 py-3 text-white text-center">
                  <p className="font-serif text-lg font-semibold">¿Vienes con una amiga?</p>
                  <p className="text-sm opacity-90">Inscríbanse juntas y cada una paga USD 60, incluso después del 10 de octubre.</p>
                </div>
                <ul className="mt-5 space-y-3 border-t border-white/20 pt-5">
                  {INCLUYE.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-white">
                      <Flower2 className="w-4 h-4 mt-0.5 opacity-90 shrink-0" />
                      <span className="text-sm leading-relaxed font-medium opacity-90">{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={CUPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block w-full py-3.5 text-center rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-primary hover:bg-white/90"
                >
                  Quiero mi cupo
                </a>
                <p className="mt-3 text-[11px] text-white/80 text-center">Si pagas desde Colombia, el valor se convierte a pesos con la tasa de cambio del día.</p>
              </div>
            </motion.div>
          </section>

          {/* (8) PREGUNTAS FRECUENTES */}
          <section className="relative py-12 md:py-16 px-6">
            <motion.div {...inView} variants={fadeUp} className="max-w-3xl mx-auto space-y-6">
              <RevealTitle text="Preguntas frecuentes" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
                    <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="text-xs text-muted-foreground text-center">
                Este taller no reemplaza la atención ginecológica ni médica. Si tienes un diagnóstico, sigue las indicaciones de tu médico.
              </p>
            </motion.div>
          </section>

          {/* (9) CIERRE */}
          <section id="ciclica-contacto" className="relative py-12 md:py-16 px-6 bg-gradient-to-b from-background via-warm-peach/50 to-background">
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-2xl mx-auto text-center space-y-5">
              <RevealTitle text="¿Tienes alguna duda antes de inscribirte?" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground font-light text-lg">Escríbeme y te respondo personalmente.</motion.p>
              <motion.div variants={fadeUp}>
                <a
                  href={DUDA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
                >
                  <MessageCircle className="w-5 h-5" /> Escribirle a Sury
                </a>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
                {["Femenino & Cíclico", "100% Virtual", "Guiado por Fransury González, psicóloga y maestra de Kundalini Yoga"].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </span>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="pt-3 space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Explorar otros espacios</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/curso-iniciacion-yoga" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-2.5 rounded-full hover:border-primary/30">
                    <Moon className="w-4 h-4" /> Curso de Iniciación al Yoga
                  </Link>
                  <Link to="/acompanamiento-individual" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-2.5 rounded-full hover:border-primary/30">
                    <Leaf className="w-4 h-4" /> Acompañamiento 1:1
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer className={`relative py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
          <div className="max-w-6xl mx-auto space-y-4">
            <p className="font-serif font-semibold text-foreground">{settings?.brandName || "SantoSha"}</p>
            <p className="font-light">{settings?.footerText || "Bienestar · Conciencia · Transformación"}</p>
            <div className="pt-4 flex flex-wrap justify-center gap-6">
              <Link to="/" className="hover:underline text-xs text-muted-foreground/70 transition-colors">← Inicio</Link>
              <Link to="/quien-soy" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Quién Soy</Link>
              <Link to="/filosofia" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Filosofía</Link>
              <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Curso de Iniciación</Link>
              <Link to="/acompanamiento-individual" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Acompañamiento 1:1</Link>
              <Link to="/terminos-y-condiciones" className="hover:underline text-xs text-muted-foreground/60 transition-colors">Términos y Condiciones</Link>
            </div>
          </div>
        </footer>

        <AiChatWidget pageSlug="sabiduria-ciclica" />
      </div>
    </MotionConfig>
  );
};

export default SabiduriaCiclica;
