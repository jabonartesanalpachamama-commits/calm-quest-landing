import type React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Book, Smile, Wind, MessageCircle, Home, BookOpen, FileText, Headphones, Flame, Users, Sprout, Compass, HeartPulse, Sparkles, Check } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import FloatingCTA from "@/components/FloatingCTA";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import cursoHero from "@/assets/curso-hero.png.asset.json";
import { RevealImage } from "@/components/landing/ScrollReveal";
import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { fadeUp, inView, RevealTitle } from "@/components/landing";

// Estructura "programa académico": hero de ancho completo con imagen de fondo.
/** Número gigante de fondo con parallax suave. */
const ModuleNumber = ({ num }: { num: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  return <motion.span ref={ref} aria-hidden="true" style={reduce ? undefined : { y }} className="absolute -top-4 right-2 font-serif text-[8rem] leading-none text-brand-gold/20 select-none">{num}</motion.span>;
};

const HERO_IMAGE = cursoHero.url;

const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground";
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información para inscribirme al Curso de Iniciación al Yoga.");
const BOLD_MODULO = "https://checkout.bold.co/payment/LNK_FGBEX3L6X9";
const BOLD_ANUAL = "https://checkout.bold.co/payment/LNK_XB1KU5ZXEA";

const MODULES = [
  { num: "01", title: "Fundamentos y Despertar de la Conciencia", theme: "¿Qué es Kundalini Yoga y por qué emerge con fuerza en esta era?" },
  { num: "02", title: "Las Herramientas del Kundalini Yoga", theme: "Cómo funciona el yoga y por qué transforma nuestra vida." },
  { num: "03", title: "Anatomía Yóguica y Desarrollo Humano", theme: "Comprender la arquitectura energética del ser humano." },
  { num: "04", title: "La Mente, las Emociones y la Transformación Interna", theme: "El yoga como tecnología para relacionarnos diferente con la mente." },
  { num: "05", title: "Relaciones, Propósito y Estilo de Vida Consciente", theme: "Llevar el yoga fuera del mat." },
  { num: "06", title: "Integración, Liderazgo Interior y Camino Espiritual", theme: "Habitar el Yoga como una práctica del día a día." },
];

const INVITES = [
  "Comprender el yoga como camino de transformación interna",
  "Explorar las herramientas del Kundalini Yoga",
  "Profundizar en la relación con el cuerpo, la mente, la energía y el espíritu",
  "Desarrollar una práctica consciente que pueda integrarse en la vida cotidiana",
];

const ENCOUNTER = [
  { icon: Book, text: "Enseñanza teórica" },
  { icon: Smile, text: "Experiencia práctica de Kundalini Yoga" },
  { icon: Wind, text: "Respiración, kriyas, mantra y meditación" },
  { icon: MessageCircle, text: "Espacios de reflexión e integración" },
  { icon: Home, text: "Práctica sugerida entre módulos" },
  { icon: BookOpen, text: "Material de apoyo y profundización" },
];

const BETWEEN_MODULES = [
  { icon: FileText, label: "PDF de apoyo temático" },
  { icon: Headphones, label: "Audio de meditación o pranayama" },
  { icon: Flame, label: "Práctica de 21 o 40 días" },
  { icon: Book, label: "Bitácora de integración personal" },
  { icon: Users, label: "Grupo de acompañamiento (opcional)" },
];

const FOR_WHOM = [
  { icon: Sprout, tone: "bg-warm-mauve/40", title: "Principiantes en el camino", desc: "Si eres nuevo en el yoga y quieres comenzar desde los fundamentos con una guía progresiva y profunda." },
  { icon: Compass, tone: "bg-warm-peach/60", title: "Practicantes que desean profundizar", desc: "Si ya tienes experiencia y buscas comprender más a fondo la filosofía, la anatomía yóguica y las herramientas del Kundalini Yoga." },
  { icon: HeartPulse, tone: "bg-brand-cream", title: "Personas en búsqueda de bienestar", desc: "Si atraviesas estrés, ansiedad, desconexión o una búsqueda de sentido y quieres herramientas reales de transformación." },
  { icon: Sparkles, tone: "bg-brand-gold/20", title: "Buscadores espirituales", desc: "Si sientes el llamado a explorar el desarrollo espiritual con disciplina, apertura y desde una tradición probada." },
];

const PLAN_MODULO = ["Acceso completo al módulo en curso", "Material teórico y de apoyo", "Audio de meditación o pranayama", "Prácticas sugeridas entre encuentros"];
const PLAN_ANUAL = ["Acceso asegurado a los 6 módulos", "Material teórico y de apoyo completo", "Prácticas de 21 o 40 días ininterrumpidas", "Proceso integrado a lo largo del año"];

const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso de Iniciación al Yoga",
  description: "Curso de iniciación al Kundalini Yoga: 6 módulos en un año con encuentros bimensuales, 100% virtual.",
  provider: { "@type": "Person", name: "Fransury González" },
  offers: [
    { "@type": "Offer", name: "Pago por módulo", price: "220", priceCurrency: "USD" },
    { "@type": "Offer", name: "Anualidad", price: "990", priceCurrency: "USD" },
  ],
};

const stagger = (s = 0.06) => ({ show: { transition: { staggerChildren: s } } });

const CursoIniciacionYoga = () => {
  const { settings, palette } = useVisualSettings();

  const goInscripcion = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#curso-inscripcion")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Curso de Iniciación al Yoga online | SantoSha"
        description="Curso de iniciación al Kundalini Yoga con Fransury González: 6 módulos en un año con encuentros bimensuales, 100% virtual."
        path="/curso-iniciacion-yoga"
        jsonLd={COURSE_JSONLD}
      />
      <FloatingCTA scrollTo="#curso-inscripcion" ctaText="Inscribirme" subText="Curso de iniciación al yoga" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        {/* HERO ancho completo */}
        <section className="relative overflow-hidden min-h-[560px] md:min-h-[620px] flex items-center">
          <RevealImage src={HERO_IMAGE} alt="Espacio sereno de práctica de yoga con mat, cojín y velas" eager
            className="absolute inset-0" imgClassName="object-cover object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/50 md:via-brand-ink/70 md:to-brand-ink/5" />
          <motion.div initial="hidden" animate="show" variants={stagger(0.1)}
            className="relative w-full max-w-6xl mx-auto px-6 py-16 md:py-24 text-brand-cream">
            <div className="max-w-xl space-y-6">
              <motion.span variants={fadeUp} className="inline-flex px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-brand-cream/40">
                Curso de iniciación · 6 módulos bimensuales
              </motion.span>
              <RevealTitle as="h1" text="Curso de Iniciación al Yoga" className="font-serif text-4xl md:text-6xl font-semibold leading-[1.05] text-brand-cream" />
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-brand-cream/90 leading-relaxed font-light">
                Habitar el yoga como una práctica del día a día
              </motion.p>
              <motion.ul variants={fadeUp} className="flex flex-wrap gap-2 text-sm">
                {["6 Módulos", "Encuentros Bimensuales", "Práctica Progresiva", "Material de Apoyo"].map((b) => (
                  <li key={b} className="h-10 flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 bg-brand-cream/10 border border-brand-cream/30">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> {b}
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp}>
                <a href="#curso-inscripcion" onClick={goInscripcion}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-brand-cream text-brand-ink hover:scale-[1.02] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink">
                  Quiero inscribirme
                  <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Introducción en dos columnas */}
        <section className="px-6 py-14 md:py-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start">
            <div className="space-y-6">
              <RevealTitle text="Introducción del Curso" className={H2} />
              <div className="space-y-5 text-foreground/80 leading-relaxed text-lg font-light">
                <p>
                  Vivimos en un tiempo de aceleración, exceso de estímulos, desconexión del cuerpo, ansiedad mental y búsqueda profunda de sentido. En medio de esta realidad, el <strong className="text-foreground font-semibold">Kundalini Yoga</strong> surge como una tecnología ancestral para recordar algo esencial: la capacidad humana de vivir con mayor conciencia, vitalidad, claridad y conexión espiritual.
                </p>
                <p>
                  En este curso te propongo un recorrido progresivo por las bases filosóficas, prácticas y experienciales del Kundalini Yoga. El curso te invita a:
                </p>
              </div>
              <motion.div {...inView} variants={stagger(0.15)} className="pt-4 space-y-1 font-serif text-xl md:text-2xl text-foreground">
                <motion.p variants={fadeUp} className="italic font-light">Porque el yoga no ocurre únicamente en el mat.</motion.p>
                <motion.p variants={fadeUp} className="italic font-light">Ocurre en cómo respiras. En cómo eliges.</motion.p>
                <motion.p variants={fadeUp} className="italic font-light">En cómo sostienes tu energía.</motion.p>
                <motion.p variants={fadeUp} className="font-semibold pt-1">En cómo habitas tu humanidad y tu espiritualidad.</motion.p>
              </motion.div>
            </div>
            <motion.aside {...inView} variants={fadeUp} className="rounded-[2rem] bg-card border border-border/50 shadow-sm p-7 md:p-9 space-y-7">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-semibold text-foreground">El curso te invita a:</h3>
                <ul className="space-y-3">
                  {INVITES.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-foreground/90 leading-relaxed">
                      <Check className="w-5 h-5 text-[#795D64] shrink-0 mt-0.5" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 pt-6 border-t border-border/50">
                <h3 className="font-serif text-2xl font-semibold text-foreground">Cada encuentro incluirá:</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {ENCOUNTER.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-sm text-foreground/90">
                      <Icon className="w-5 h-5 text-[#795D64] shrink-0" /> {text}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* Módulos: rejilla / carrusel */}
        <section className="py-14 md:py-16 bg-gradient-to-b from-background via-warm-mauve/20 to-background">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-3 px-6">
              <RevealTitle text="Los 6 Módulos del Curso" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Un recorrido progresivo a lo largo de un año, con encuentros bimensuales.</p>
            </div>
            <motion.ol {...inView} variants={stagger(0.08)}
              className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 pb-4 md:pb-0">
              {MODULES.map((m) => (
                <motion.li key={m.num} variants={fadeUp}
                  className="relative snap-start shrink-0 w-[80%] sm:w-[55%] md:w-auto overflow-hidden rounded-3xl bg-card border border-border/50 p-7 min-h-[15rem] flex flex-col justify-end transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <ModuleNumber num={m.num} />
                  <p className="relative text-xs font-semibold tracking-widest uppercase text-[#795D64]">Módulo {m.num} · Bimensual</p>
                  <h3 className="relative mt-2 font-serif text-xl md:text-2xl font-semibold text-foreground leading-snug">{m.title}</h3>
                  <p className="relative mt-2 text-base text-muted-foreground font-light leading-relaxed">{m.theme}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* Recursos entre módulos */}
        <section className="px-6 py-14 md:py-16 bg-brand-cream">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <RevealTitle text="Recursos Entre Módulos" className={H2} />
              <p className="text-muted-foreground font-light text-lg">
                Porque el verdadero aprendizaje del Kundalini Yoga no ocurre cada dos meses. Ocurre en la repetición, la observación y la experiencia cotidiana.
              </p>
            </div>
            <motion.ul {...inView} variants={stagger()} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {BETWEEN_MODULES.map(({ icon: Icon, label }) => (
                <motion.li key={label} variants={fadeUp} className="flex flex-col items-center text-center gap-3">
                  <span className="w-16 h-16 rounded-full bg-card border border-brand-gold/50 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#795D64]" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm text-foreground/90 leading-snug">{label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <Quote variant="side" cite="— Como diría cualquier practicante después del día 17 de una práctica de 40 días">
          "La disciplina primero negocia contigo… luego empieza a revelarte cosas."
        </Quote>

        {/* Para quién: 2x2 */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <RevealTitle text="¿Para quién es este curso?" className={H2} />
              <p className="max-w-3xl mx-auto text-muted-foreground font-light text-lg">
                Este curso está dirigido tanto a personas nuevas en el camino del yoga como a practicantes que desean profundizar su comprensión y experiencia del Kundalini Yoga.
              </p>
            </div>
            <motion.ul {...inView} variants={stagger(0.1)} className="grid md:grid-cols-2 gap-5">
              {FOR_WHOM.map(({ icon: Icon, tone, title, desc }) => (
                <motion.li key={title} variants={fadeUp} className={`${tone} rounded-3xl p-7 space-y-3`}>
                  <span className="w-12 h-12 rounded-2xl bg-card/80 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#795D64]" />
                  </span>
                  <p className="font-serif text-xl font-semibold text-foreground">{title}</p>
                  <p className="text-base text-foreground/75 font-light leading-relaxed">{desc}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Inversión: tabla comparativa */}
        <section id="inversion" className="px-4 md:px-6 py-14 md:py-16 bg-gradient-to-b from-background via-warm-peach/40 to-background">
          <motion.div {...inView} variants={stagger(0.1)} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="Tu inversión" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Elige la modalidad que mejor se adapte a tu proceso.</p>
            </div>
            <motion.div variants={fadeUp} role="table" aria-label="Comparación de modalidades de pago"
              className="grid grid-cols-2 rounded-3xl overflow-hidden border border-border/50 shadow-lg">
              {/* Por módulo */}
              <div role="rowgroup" className="bg-card flex flex-col">
                <div className="p-4 md:p-8 text-center space-y-2 border-b border-border/50 min-h-[14rem] md:min-h-[13.5rem] flex flex-col justify-center">
                  <h3 className="font-serif text-lg md:text-2xl font-semibold text-foreground">Pago por Módulo</h3>
                  <p className="flex items-baseline justify-center gap-1 text-foreground"><span className="text-3xl md:text-5xl font-bold">220</span><span className="text-xs md:text-sm font-semibold">USD</span></p>
                  <p className="text-xs md:text-sm text-muted-foreground">Pago bimensual por cada módulo</p>
                </div>
                {PLAN_MODULO.map((b) => (
                  <div key={b} role="row" className="px-3 md:px-8 py-3 md:py-4 border-b border-border/40 text-xs md:text-sm text-foreground/85 flex items-start gap-2 min-h-[4.5rem] md:min-h-[3.75rem]">
                    <Check className="w-4 h-4 text-[#795D64] shrink-0 mt-0.5" /> {b}
                  </div>
                ))}
                <div className="p-3 md:p-6 mt-auto">
                  <a href={BOLD_MODULO} target="_blank" rel="noopener noreferrer"
                    className="block w-full py-3 px-2 text-center rounded-2xl font-bold text-xs md:text-sm bg-[#795D64] hover:bg-[#6A5057] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                    Inscribirme por Módulo
                  </a>
                </div>
              </div>
              {/* Anualidad */}
              <div role="rowgroup" className="relative bg-[#795D64] text-white flex flex-col">
                <div className="relative p-4 md:p-8 text-center space-y-2 border-b border-white/20 min-h-[14rem] md:min-h-[13.5rem] flex flex-col justify-center">
                  <span className="mx-auto mb-1 px-2.5 py-1 rounded-full bg-brand-gold text-brand-ink text-[9px] md:text-[10px] font-bold uppercase tracking-widest">25% de descuento</span>
                  <h3 className="font-serif text-lg md:text-2xl font-semibold">Anualidad</h3>
                  <p className="flex items-baseline justify-center gap-1"><span className="text-3xl md:text-5xl font-bold">990</span><span className="text-xs md:text-sm font-semibold">USD</span></p>
                  <p className="text-xs md:text-sm text-white/90">Ahorra y comprométete con tu formación completa</p>
                </div>
                {PLAN_ANUAL.map((b) => (
                  <div key={b} role="row" className="px-3 md:px-8 py-3 md:py-4 border-b border-white/15 text-xs md:text-sm flex items-start gap-2 min-h-[4.5rem] md:min-h-[3.75rem]">
                    <Check className="w-4 h-4 text-brand-cream shrink-0 mt-0.5" /> {b}
                  </div>
                ))}
                <div className="p-3 md:p-6 mt-auto">
                  <a href={BOLD_ANUAL} target="_blank" rel="noopener noreferrer"
                    className="block w-full py-3 px-2 text-center rounded-2xl font-bold text-xs md:text-sm bg-brand-cream text-brand-ink hover:bg-brand-cream/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#795D64]">
                    Inscribirme al Año Completo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Cierre */}
        <section id="curso-inscripcion" className="scroll-mt-24 px-6 py-12 md:py-16">
          <motion.div {...inView} variants={stagger(0.1)}
            className="max-w-4xl mx-auto rounded-[2.5rem] bg-warm-mauve/40 px-6 py-12 text-center space-y-6">
            <RevealTitle text="¿Quieres inscribirte? Escríbeme." className={H2} />
            <motion.div variants={fadeUp}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
              </a>
            </motion.div>
            <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
          </motion.div>
        </section>

        <NextSteps exclude="/curso-iniciacion-yoga" />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="curso-iniciacion-yoga" />
    </div>
  );
};

export default CursoIniciacionYoga;
