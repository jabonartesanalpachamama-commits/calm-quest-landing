import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, MotionConfig, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Leaf, MessageCircle, Moon, ArrowDown, Sparkles } from "lucide-react";
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
import SiteFooter from "@/components/SiteFooter";
import { useReplaceStaticMeta } from "@/components/Seo";
import { REDUCED_MOTION } from "@/components/landing";

type Phase = "nueva" | "creciente" | "media" | "llena" | "menguante" | "completa";

const MoonPhase = ({ phase, className = "w-6 h-6" }: { phase: Phase; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
    {phase === "creciente" && <path d="M12 3A9 9 0 0 1 12 21A4.5 9 0 0 0 12 3Z" fill="currentColor" />}
    {phase === "media" && <path d="M12 3A9 9 0 0 1 12 21Z" fill="currentColor" />}
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

const LEARNING_POINTS: { phase: Phase; text: string; bold?: string }[] = [
  { phase: "nueva", text: "Comprender tu naturaleza cíclica y las fases que habitan tu experiencia femenina." },
  { phase: "creciente", text: "Reconocer tus propios patrones emocionales, energéticos y corporales, entendiendo cómo se expresa tu ciclo en tu vida cotidiana." },
  { phase: "llena", text: "Desarrollar herramientas prácticas de observación y autoconocimiento, para interpretar las señales de tu cuerpo con mayor claridad y compasión." },
  { phase: "menguante", text: "Transformar tu relación con tu ciclo y con tu cuerpo, dejando atrás la desconexión, la culpa o la lucha constante.", bold: "dejando atrás la desconexión, la culpa o la lucha constante" },
  { phase: "completa", text: "Organizar tus semanas según tu energía: saber cuándo te conviene hacer más y cuándo te conviene bajar el ritmo." },
];

const ETAPAS = ["Menstrúo cada mes", "Mis ciclos son irregulares", "Uso anticonceptivos", "Estoy en la perimenopausia", "Ya viví la menopausia"];

const CUPO_URL = "https://checkout.bold.co/payment/LNK_66A1LU2TZR";
const DUDA_URL = getWhatsAppUrl("Hola Fransu, tengo una pregunta sobre el taller Sabiduría Cíclica");

// Precio de lanzamiento vigente hasta el 10 de octubre de 2026 23:59 hora Colombia (UTC-5)
const LAUNCH_DEADLINE = new Date("2026-10-11T00:00:00-05:00").getTime();
const isLaunchPrice = () => Date.now() < LAUNCH_DEADLINE;

const TESTIMONIOS = [
  { name: "Goretti", country: "México", quote: "Gracias por ser nuestra guía de amor y sanación. Estuvo intenso, pero muy mágico y de tanta conciencia. Gracias por hacer este tipo de talleres." },
  { name: "Martha G.", country: "Estados Unidos", quote: "Nunca me había puesto a pensar en mi periodo de esa manera. Es mucha información para entender, procesar e integrar, y me di cuenta de lo descuidada que había sido conmigo misma. Gracias." },
  { name: "Verónica I.", country: "México", quote: "Terminamos cansadas, pero felices. Aprendí mucho sobre un tema que no tenía tan presente y del que hoy tomo conciencia. Gracias por ser mi guía." },
];

const FAQ_GROUPS: { title: string; items: { q: string; a: string[] }[] }[] = [
  {
    title: "Tu cuerpo y tu etapa",
    items: [
      { q: "¿Necesito tener un ciclo menstrual regular para hacer el taller?", a: [
        "No. Sabiduría Cíclica, Esencia Femenina no está dirigido únicamente a mujeres con ciclos regulares.",
        "Si tu ciclo es irregular, cambia de duración, es muy diferente cada mes, tienes meses en los que no menstrúas o estás atravesando transformaciones hormonales, puedes participar. El propósito no es enseñarte a encajar tu cuerpo en un ciclo \"perfecto\", sino ayudarte a observar otras señales: tu energía, tus emociones, tu descanso y tus necesidades.",
        "Tu cuerpo no tiene que comportarse como un reloj para que puedas aprender a escucharlo.",
      ] },
      { q: "¿Puedo hacer el taller si tomo anticonceptivos hormonales?", a: [
        "Sí.",
        "Es importante tener presente que los anticonceptivos hormonales pueden modificar o suprimir las características naturales del ciclo menstrual. Por eso, en el taller no se trata de forzar la experiencia de las cuatro fases como si necesariamente estuvieran ocurriendo de la misma manera.",
        "Trabajaremos desde la observación y la conciencia corporal, respetando la experiencia particular de cada mujer.",
      ] },
      { q: "¿El taller es para mujeres en perimenopausia?", a: [
        "Sí.",
        "La perimenopausia es precisamente una etapa en la que el cuerpo puede comenzar a cambiar sus ritmos: los ciclos pueden hacerse más largos o más cortos, variar en intensidad o presentarse de manera diferente.",
        "El taller puede ser un espacio para escuchar esos cambios, en lugar de vivirlos únicamente desde la exigencia de que el cuerpo siga funcionando como antes.",
      ] },
      { q: "¿Puedo hacer el taller si ya estoy en la menopausia?", a: [
        "Sí.",
        "Aunque ya no exista menstruación, la relación con tu propia energía, tu cuerpo, tus emociones y tus ritmos internos continúa.",
        "En este caso, la propuesta no se centra en \"seguir\" un ciclo que ya terminó, sino en reconocer la sabiduría de esta nueva etapa y establecer una relación más consciente con tu cuerpo.",
      ] },
      { q: "¿Y si ya no menstrúo por otras razones?", a: [
        "También puedes participar.",
        "La ausencia de menstruación puede tener diferentes causas, por lo que no sería adecuado asumir que todas las mujeres que no menstrúan están viviendo la misma experiencia.",
        "El taller propone observar y escuchar el cuerpo desde la realidad particular de cada mujer, sin comparaciones ni exigencias.",
      ] },
      { q: "¿Importa en qué momento de mi ciclo esté el día del taller?", a: [
        "No.",
        "Si ese día estás menstruando, podrás observar esa experiencia; si estás en otra fase, trabajarás desde el momento vital y corporal en el que te encuentres. No tienes que esperar la \"fase correcta\".",
      ] },
    ],
  },
  {
    title: "La práctica",
    items: [
      { q: "¿Este es un taller de yoga o sobre el ciclo menstrual?", a: [
        "Es un taller que integra las dos.",
        "Sabiduría Cíclica, Esencia Femenina parte de la práctica del Kundalini Yoga y de la comprensión yóguica del cuerpo para explorar cómo el movimiento, la respiración y la meditación acompañan cada momento del ciclo.",
        "No es una charla médica ni psicológica sobre la menstruación, ni una clase convencional de yoga: es una experiencia práctica para reconectar con tus ritmos.",
      ] },
      { q: "¿Necesito experiencia previa en yoga?", a: [
        "No.",
        "El taller está pensado para que te acerques a la práctica desde tu propio nivel. No necesitas saber hacer posturas avanzadas ni tener experiencia previa en Kundalini Yoga.",
        "La práctica será un medio para desarrollar presencia, conciencia corporal y conexión contigo misma, no una prueba de flexibilidad.",
      ] },
      { q: "¿Necesito saber meditar?", a: [
        "No.",
        "La meditación se abordará como una práctica de observación y conciencia. No necesitas \"saber meditar\" ni conseguir dejar la mente en blanco: esa expectativa suele ser el primer obstáculo.",
      ] },
      { q: "¿Tengo que creer en una determinada espiritualidad para participar?", a: [
        "No.",
        "La propuesta parte de la visión del Kundalini Yoga y de una comprensión espiritual del ser humano, pero no busca imponerte una creencia.",
        "La invitación es a explorar, experimentar y observar qué ocurre en ti a través de la práctica.",
      ] },
      { q: "¿Este taller busca enseñarme a controlar mi ciclo?", a: [
        "No.",
        "El objetivo no es controlar tu cuerpo ni conseguir que funcione de una determinada manera. Es una invitación a relacionarte con él desde un lugar diferente: menos exigencia y más escucha; menos lucha contra tus ritmos y más conciencia de ellos.",
        "La sabiduría cíclica no consiste en controlar el ciclo. Consiste en aprender a escucharlo y a conocerte.",
      ] },
      { q: "¿El taller reemplaza una consulta médica o ginecológica?", a: [
        "No.",
        "Este taller tiene un propósito corporal, espiritual y de autoconocimiento desde el yoga. No sustituye una valoración médica, ginecológica, endocrinológica o psicológica cuando sea necesaria.",
        "Si presentas cambios importantes o persistentes en tu ciclo, dolor, sangrado inusual, ausencia de menstruación u otros síntomas que te preocupen, consulta con un profesional de la salud.",
      ] },
    ],
  },
  {
    title: "Inscripción y día del taller",
    items: [
      { q: "¿Qué necesito para el taller?", a: [
        "Principalmente, disposición para observarte y escucharte.",
        "Además, un celular o computador con internet, un espacio tranquilo donde puedas moverte, un tapete de yoga, mat o aquello con lo que te sientas cómoda, y un cuaderno. No necesitas experiencia en yoga ni conocimientos previos sobre el ciclo femenino.",
      ] },
      { q: "¿A qué hora es en mi país?", a: [
        "El taller es de 10:00 a. m. a 2:00 p. m., hora Colombia. Equivale a 9:00 a. m. a 1:00 p. m. en Ciudad de México, y a 11:00 a. m. a 3:00 p. m. en Miami y Nueva York. Si estás en otro país, escríbeme y te confirmo tu horario.",
      ] },
      { q: "¿Cómo pago?", a: [
        "En línea y de forma segura a través de Bold, con el botón \"Quiero mi cupo\". El cobro se hace en la moneda local de tu tarjeta.",
        "Si vienes con una amiga, cada una paga USD 60 con el enlace para amigas que encuentras en la sección \"Tu inversión\".",
      ] },
      { q: "¿Qué pasa después de inscribirme?", a: [
        "Te contactaremos a tu correo o WhatsApp registrado para confirmar tu participación.",
      ] },
    ],
  },
];

const PAGE_URL = "https://santoshayoga.com.co/sabiduria-ciclica-esencia-femenina";
const SEO_TITLE = "Taller Sabiduría Cíclica | Ciclo femenino y yoga";
const SEO_DESC = "Comprende tu naturaleza cíclica y vívela en tu cuerpo con el yoga, en cualquier etapa de tu vida. Taller en vivo, sábado 17 de octubre por Google Meet.";
const SEO_IMAGE = "https://santoshayoga.com.co/sabiduria-ciclica-hero.webp";

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
  })),
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Sabiduría Cíclica, Esencia Femenina",
  description: SEO_DESC,
  startDate: "2026-10-17T10:00:00-05:00",
  endDate: "2026-10-17T14:00:00-05:00",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "VirtualLocation", url: PAGE_URL },
  image: SEO_IMAGE,
  organizer: { "@type": "Person", name: "Fransury González", url: "https://santoshayoga.com.co" },
  performer: { "@type": "Person", name: "Fransury González" },
  inLanguage: "es",
  offers: [
    { "@type": "Offer", price: "60", priceCurrency: "USD", availability: "https://schema.org/InStock", url: PAGE_URL, validFrom: "2026-09-25", priceValidUntil: "2026-10-10" },
    { "@type": "Offer", price: "75", priceCurrency: "USD", availability: "https://schema.org/InStock", url: PAGE_URL, validFrom: "2026-10-11" },
  ],
};

const INCLUYE = [
  "Taller en vivo de 4 horas por Google Meet",
  "Práctica de yoga, respiración y meditación para habitar cada fase de tu ciclo",
  "Las fases de tu ciclo y cómo se expresan en tu cuerpo, tu energía y tus emociones",
  "Herramientas prácticas para observar tu ciclo en tu día a día",
  "Círculo de mujeres para compartir y hacer preguntas",
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const inView = { initial: (REDUCED_MOTION ? false : "hidden") as false | "hidden", whileInView: "show" as const, viewport: { once: true, margin: "-60px" } };

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
          className="inline-block"
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
        >
          {w}
        </motion.span>
      )).flatMap((el, i) => (i ? [" ", el] : [el]))}
    </Tag>
  );
};

/** Texto que aparece palabra por palabra (opcional: desenfoque a nitidez) */
const RevealWords = ({ text, className = "", blur = false, stagger = 0.06, as = "p" }: { text: string; className?: string; blur?: boolean; stagger?: number; as?: "p" | "h2" }) => {
  const Tag = as === "h2" ? motion.h2 : motion.p;
  const hidden = blur ? { opacity: 0, filter: "blur(6px)", y: 6 } : { opacity: 0, y: 12 };
  const show = blur ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 1, y: 0 };
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span key={i} aria-hidden="true" className="inline-block"
          variants={{ hidden, show: { ...show, transition: { duration: blur ? 0.9 : 0.5, ease: EASE } } }}>{w}</motion.span>
      )).flatMap((el, i) => (i ? [" ", el] : [el]))}
    </Tag>
  );
};

const FRASES: { phase: Phase; a: string; b: string }[] = [
  { phase: "creciente", a: "Tu cuerpo", b: "tiene memoria." },
  { phase: "media", a: "Tu ciclo", b: "guarda sabiduría." },
  { phase: "llena", a: "Tu esencia", b: "conoce el camino." },
];

/** Frase rotativa bajo los botones del hero */
const RotatingPhrases = () => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % FRASES.length), 3500);
    return () => clearInterval(t);
  }, [reduce, paused]);

  if (reduce) {
    return (
      <p className="font-serif text-lg md:text-xl text-foreground text-center md:text-left">
        {FRASES.map((f, k) => (
          <span key={f.a}>
            {k > 0 && <span className="text-[#B8977E]"> · </span>}
            {f.a} <em className="italic text-[#795D64]">{f.b}</em>
          </span>
        ))}
      </p>
    );
  }

  const f = FRASES[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="flex flex-col items-center md:items-start gap-2">
      <div className="flex items-center gap-2.5 h-8 md:h-9 font-serif text-lg md:text-xl text-foreground">
        <span className="relative w-4 h-4 shrink-0 text-[#B8977E]">
          <AnimatePresence initial={false}>
            <motion.span
              key={f.phase}
              className="absolute inset-0"
              initial={{ opacity: 0, rotate: -60 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 60 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <MoonPhase phase={f.phase} className="w-4 h-4" />
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="relative overflow-hidden h-full flex items-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={f.a}
              className="block whitespace-nowrap"
              initial={{ opacity: 0, y: 14, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(3px)" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {f.a} <em className="italic text-[#795D64]">{f.b}</em>
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {FRASES.map((x, k) => (
          <span key={x.a} className={`h-1.5 rounded-full bg-[#B8977E] transition-all duration-500 ${k === i ? "w-4 opacity-90" : "w-1.5 opacity-35"}`} />
        ))}
      </div>
    </div>
  );
};

/** Enlace secundario "Quiero mi cupo" con subrayado dorado que se dibuja */
const CupoLink = () => {
  const reduce = useReducedMotion();
  return (
    <a href="#ciclica-precio" onClick={scrollTo("#ciclica-precio")} className="group relative inline-flex items-center gap-1.5 text-sm font-semibold text-primary pb-1">
      <motion.span aria-hidden="true" animate={reduce ? {} : { opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="inline-flex">
        <Sparkles className="w-3.5 h-3.5 text-[#B8977E]" />
      </motion.span>
      Quiero mi cupo
      <motion.span aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
        className="absolute left-0 right-0 bottom-0 h-px group-hover:h-[2.5px] bg-[#B8977E] origin-left transition-[height] duration-300" />
    </a>
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
              <figure className="h-full max-w-2xl mx-auto flex flex-col justify-center bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/40 text-center">
                <blockquote className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed italic">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center justify-center gap-3">
                  <span className="relative w-11 h-11 bg-warm-mauve flex items-center justify-center">
                    <span className="font-serif text-lg font-semibold text-primary">{t.name.charAt(0)}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-card flex items-center justify-center text-primary">
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
        {LEARNING_POINTS.map(({ phase, text, bold }, i) => {
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
                {bold && text.includes(bold) ? (
                  <>
                    {text.split(bold)[0]}
                    <span className="font-semibold">{bold}</span>
                    {text.split(bold)[1]}
                  </>
                ) : text}
              </p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

const SabiduriaCiclica = () => {
  useReplaceStaticMeta();
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
  const [heroParallax, setHeroParallax] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const u = () => setHeroParallax(mq.matches);
    u(); mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  // Subtle scroll zoom (top-center origin) so the top of the image is never cropped.
  void heroParallax;
  const heroImgScale = useTransform(scrollY, [0, 600], [1, 1 + 0.06 * k], { clamp: true });

  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(photoProgress, [0, 1], [30 * k, -30 * k]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col overflow-x-hidden`}>
        <Helmet>
          <title>{SEO_TITLE}</title>
          <meta name="description" content={SEO_DESC} />
          <meta property="og:title" content={SEO_TITLE} />
          <meta property="og:description" content={SEO_DESC} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={SEO_IMAGE} />
          <meta property="og:url" content={PAGE_URL} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={SEO_TITLE} />
          <meta name="twitter:description" content={SEO_DESC} />
          <meta name="twitter:image" content={SEO_IMAGE} />
          <link rel="canonical" href={PAGE_URL} />
          <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
          <script type="application/ld+json">{JSON.stringify(EVENT_JSONLD)}</script>
        </Helmet>

        <Header palette={palette} brandName={settings?.brandName} />

        <main className="flex-grow relative">

          {/* (1) HERO */}
          <section className="relative pt-0 pb-12 md:pb-0 px-4 md:px-0 bg-background">
            <div className="relative max-w-6xl md:max-w-none mx-auto grid md:grid-cols-2 gap-16 md:gap-10 items-center md:pl-8 lg:pl-12 md:py-10">
              <div className="relative flex justify-center md:justify-end">
                <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/2] w-[85%] md:w-full max-w-[560px] lg:max-w-[620px] bg-[#8E8F93]">
                  <img
                    src="/sabiduria-ciclica-hero.webp"
                    alt="Fransury González con vestido blanco caminando en un campo con niebla, en tres momentos superpuestos"
                    width={1536}
                    height={1024}
                    loading="eager"
                    {...{ fetchpriority: "high" }}
                    className="absolute inset-0 w-full h-full object-cover object-[50%_40%] md:object-center block"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#482A3A] opacity-[0.26]" />
                  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.07]">
                    <filter id="sc-hero-grain">
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#sc-hero-grain)" />
                  </svg>
                </div>
              </div>


              <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-5 text-center md:text-left md:pr-8 lg:pr-12 md:py-10 md:max-w-xl">
                <motion.span variants={fadeUp} className="block text-[11px] tracking-[0.3em] uppercase text-primary">
                  Taller en vivo · Virtual
                </motion.span>
                <RevealTitle as="h1" text="Sabiduría Cíclica, Esencia Femenina" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
                <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                  Comprende tu naturaleza cíclica e intégrala a tu cuerpo a través del yoga, en cualquier etapa de tu vida.
                </motion.p>
                <motion.p variants={fadeUp} className="text-[11px] md:text-xs uppercase tracking-[0.22em] leading-loose text-foreground/80 font-light">
                  <span>Sábado 17 de octubre</span><span aria-hidden="true" className="mx-2 text-[#B8977E]">·</span><span>10:00 a. m. a 2:00 p. m. hora Colombia</span><span aria-hidden="true" className="mx-2 text-[#B8977E]">·</span><span>4 horas en vivo por Google Meet</span>
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-1">
                  <a
                    href="#que-es"
                    onClick={scrollTo("#que-es")}
                    className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group bg-[#795D64] hover:bg-[#6A5057] text-white`}
                  >
                    Ver detalles del taller
                    <span className="inline-flex transition-transform duration-300 group-hover:translate-y-1">
                      <motion.span className="inline-flex" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                        <ArrowDown className="w-4 h-4" />
                      </motion.span>
                    </span>
                  </a>
                  <CupoLink />
                </motion.div>
                <motion.div variants={fadeUp} className="pt-4 md:pt-5">
                  <RotatingPhrases />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* (2) QUÉ ES EL TALLER */}
          <section id="que-es" className="relative py-12 md:py-16 px-6 scroll-mt-20 overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 md:right-[6%] top-6 w-56 h-56 md:w-72 md:h-72 opacity-40">
              <motion.svg viewBox="0 0 200 200" className="w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#B8977E" strokeWidth="0.8" strokeDasharray="2 7" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#795D64" strokeWidth="0.5" strokeOpacity="0.6" />
                <circle cx="100" cy="10" r="5" fill="#B8977E" fillOpacity="0.7" />
                <circle cx="30" cy="100" r="3" fill="#795D64" fillOpacity="0.5" />
              </motion.svg>
            </div>
            <RevealWords stagger={0.035} className="relative max-w-3xl mx-auto text-center font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground/95"
              text={'"¿Y si aquello que has interpretado como confusión, cansancio, sensibilidad intensa, desconexión o contradicción… fuera en realidad un lenguaje profundo de tu cuerpo intentando hablarte?"'} />
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.35, delayChildren: 0.2 } } }} className="relative max-w-3xl mx-auto space-y-6 text-center mt-6">
              <motion.p variants={fadeUp} className="text-foreground/90 leading-relaxed font-light text-lg">
                Durante años aprendiste a funcionar igual todos los días. Pero tu cuerpo siempre ha tenido su propio ritmo. En este encuentro vamos a escucharlo juntas.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                Vivimos en una cultura que nos enseñó a funcionar de forma lineal, constante y productiva, desconectándonos de una verdad esencial: <strong className="relative inline-block text-foreground font-medium">
                  <motion.span aria-hidden="true" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, delay: 0.5, ease: EASE } } }}
                    className="absolute left-0 right-0 -bottom-0.5 h-px -z-0 bg-[#B8977E] origin-left" />
                  <span className="relative">la mujer es cíclica por naturaleza.</span>
                </strong>
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                <strong className="text-foreground font-medium">Sabiduría Cíclica, Esencia Femenina</strong> es un viaje de autoconocimiento y reconexión con tu ritmo interno, donde la comprensión de tu ciclo y la práctica del yoga se acompañan. Un espacio donde aprenderás a ver tu ciclo no como algo que hay que aguantar, sino como información valiosa sobre tu energía, tu ánimo y lo que necesitas.
              </motion.p>
            </motion.div>

            <motion.figure {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-2xl mx-auto mt-10 text-center">
              <motion.div
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
                className="h-px w-24 mx-auto bg-[#B8977E] origin-center"
              />
              <motion.blockquote variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } } }} className="font-serif text-2xl md:text-3xl font-light italic text-foreground leading-snug py-5">
                Tu ciclo no está en tu contra.<br />Tu cuerpo no es un problema que debas corregir.
              </motion.blockquote>
              <motion.figcaption variants={fadeUp} className="ciclica-marquee text-[11px] md:text-xs uppercase tracking-[0.25em] text-primary" aria-label="Vuelve a tu ritmo · Vuelve a tu cuerpo · Vuelve a tu esencia">
                <div className="ciclica-marquee-track" aria-hidden="true">
                  {[0, 1].map((g) => (
                    <span key={g} className="ciclica-marquee-group">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="px-3">Vuelve a tu ritmo · Vuelve a tu cuerpo · Vuelve a tu esencia ·</span>
                      ))}
                    </span>
                  ))}
                </div>
                <span className="ciclica-marquee-static">Vuelve a tu ritmo · Vuelve a tu cuerpo · Vuelve a tu esencia</span>
              </motion.figcaption>
              <motion.div
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
                className="h-px w-24 mx-auto mt-5 bg-[#B8977E] origin-center"
              />
            </motion.figure>
          </section>

          {/* (3) POR QUÉ NACE + QUIÉN TE GUÍA */}
          <section className="relative py-12 md:py-16 px-6 bg-brand-cream">
            <div className="max-w-5xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 items-center">
              <motion.div ref={photoRef} style={{ y: photoY }} className="max-w-[300px] md:max-w-[340px] mx-auto w-full">
                <div className="relative">
                  <div className="relative overflow-hidden">
                    <img src="/fransury-sabiduria-ciclica.webp" alt="Fransury González, psicóloga y maestra de Kundalini Yoga" width={800} height={1394} loading="lazy" className="w-full h-auto block" />
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground tracking-wide">Fransury González · Psicóloga y maestra de Kundalini Yoga</p>
              </motion.div>

              <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="space-y-5 text-center md:text-left">
                <RevealWords as="h2" stagger={0.12} text="Por qué nace este taller" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
                <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                  Desde mi experiencia clínica, terapéutica y vivencial, he acompañado a muchas mujeres que viven alejadas de su cuerpo, peleadas con su periodo, con sus cambios hormonales o, peor aún, en desconocimiento de estos, confundidas por sus cambios emocionales o desconectadas de su intuición natural.
                </motion.p>
                <RevealWords blur stagger={0.13} className={`font-serif text-lg font-medium ${palette.primaryText} italic`}
                  text="Este taller nace para abrir un camino distinto: uno donde puedas comprenderte, escucharte y volver a ti." />
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
          <section className="relative py-12 md:py-16 px-6 bg-brand-cream">
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="max-w-3xl mx-auto text-center space-y-6">
              <RevealTitle text="Este taller es para todas las mujeres" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed font-light">
                No importa en qué etapa estés. Si menstrúas cada mes, si tus ciclos son irregulares, si usas anticonceptivos, si estás en la perimenopausia o si ya viviste la menopausia, tu cuerpo sigue teniendo ritmos: cambian tu energía, tu ánimo y tu forma de relacionarte. En este taller aprenderás a reconocerlos y a escucharlos desde la etapa en la que estás hoy.
              </motion.p>
              <motion.div variants={fadeUp} className="ciclica-marquee py-1" aria-label={ETAPAS.join(" · ")}>
                <div className="ciclica-marquee-track" aria-hidden="true">
                  {[0, 1].map((g) => (
                    <ul key={g} className="ciclica-marquee-group">
                      {ETAPAS.map((e) => (
                        <li key={e} className="mr-1.5 md:mr-2.5 flex items-center gap-1.5 md:gap-2 whitespace-nowrap bg-card/80 border border-primary/20 rounded-full px-2.5 py-1 text-xs md:px-4 md:py-2 md:text-sm text-foreground">
                          <Moon className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {e}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                <div className="ciclica-marquee-static">
                  <ul className="flex flex-wrap justify-center gap-1.5 md:gap-2.5">
                    {ETAPAS.map((e) => (
                      <li key={e} className="flex items-center gap-1.5 md:gap-2 whitespace-nowrap bg-card/80 border border-primary/20 rounded-full px-2.5 py-1 text-xs md:px-4 md:py-2 md:text-sm text-foreground">
                        <Moon className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
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
          <section id="ciclica-precio" className="relative py-12 md:py-16 px-6 scroll-mt-20 bg-brand-cream">
            <motion.div {...inView} variants={fadeUp} className="max-w-md mx-auto space-y-6">
              <RevealTitle text="Tu inversión" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <div className="bg-[#795D64] rounded-3xl p-6 md:p-7 shadow-lg">
                <div className="space-y-2 text-center text-white">
                  <h3 className="font-serif text-2xl font-semibold">Taller Sabiduría Cíclica</h3>
                  {launch && <p className="text-xs font-semibold uppercase tracking-wider text-white">Precio de lanzamiento hasta el 10 de octubre</p>}
                  <div className="flex justify-center items-baseline gap-3">
                    <span className="text-5xl font-bold">USD {launch ? 60 : 75}</span>
                    {launch && <span className="text-xl line-through text-brand-cream">USD 75</span>}
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/10 border border-brand-gold/70 px-4 py-3 text-white text-center">
                  <p className="font-serif text-xl font-bold text-brand-cream">¿Vienes con una amiga?</p>
                  <p className="text-sm text-white">Inscríbanse juntas y cada una paga USD 60, incluso después del 10 de octubre.</p>
                </div>
                <ul className="mt-5 space-y-3 border-t border-white/20 pt-5">
                  {INCLUYE.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-white">
                      <Flower2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm leading-relaxed font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={CUPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block w-full py-3.5 text-center rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-brand-cream text-brand-ink hover:bg-brand-cream/90"
                >
                  Quiero mi cupo
                </a>
                <p className="mt-3 text-xs text-white text-center">El cobro se hace en la moneda local de tu tarjeta.</p>
              </div>
            </motion.div>
          </section>

          {/* (8) PREGUNTAS FRECUENTES */}
          <section className="relative py-12 md:py-16 px-6">
            <motion.div {...inView} variants={fadeUp} className="max-w-3xl mx-auto space-y-6">
              <RevealTitle text="Preguntas frecuentes" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <Accordion type="single" collapsible className="w-full">
                {FAQ_GROUPS.map((g, gi) => (
                  <AccordionItem key={g.title} value={`grupo-${gi}`} className="border-border/40">
                    <AccordionTrigger className="text-left font-serif text-xl text-foreground py-5 hover:no-underline">{g.title}</AccordionTrigger>
                    <AccordionContent className="pl-2 md:pl-4">
                      <Accordion type="single" collapsible className="w-full">
                        {g.items.map((f, i) => (
                          <AccordionItem key={i} value={`faq-${gi}-${i}`} className="border-border/40">
                            <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                              <div className="space-y-2">
                                {f.a.map((p, pi) => <p key={pi}>{p}</p>)}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </section>

          {/* (9) CIERRE */}
          <section id="ciclica-contacto" className="relative py-12 md:py-16 px-6 bg-brand-cream">
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-2xl mx-auto text-center space-y-5">
              <RevealTitle text="¿Tienes alguna duda antes de inscribirte?" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground font-light text-lg">Escríbeme y te respondo personalmente.</motion.p>
              <motion.div variants={fadeUp}>
                <a
                  href={DUDA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white`}
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

        <SiteFooter palette={palette} />

        <AiChatWidget pageSlug="sabiduria-ciclica" />
      </div>
    </MotionConfig>
  );
};


export default SabiduriaCiclica;
