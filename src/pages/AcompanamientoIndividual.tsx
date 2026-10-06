/**
 * YOGA Y MEDITACIÓN 1:1 — lenguaje editorial de lujo (Lote Q), el mismo de la portada:
 * blanco / #FBF9F8 alternados, display fino en mayúsculas, filetes dorados que se dibujan,
 * fade + 14 px. Única animación firma: la franja de palabras en movimiento.
 */
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ChevronDown } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { Highlight } from "@/components/landing/Highlight";
import { faqJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import yogaPhoto from "@/assets/fransury-yoga.webp";
import yogaPhotoWide from "@/assets/fransury-yoga-ancha.webp";
import { fadeUp, inView, PriceCard, PriceCardLight } from "@/components/landing";

// Foto del hero: vertical para móvil, recorte ancho para computador.
const HERO_IMAGE = yogaPhoto;
const HERO_IMAGE_WIDE = yogaPhotoWide;

const FOCUS = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-4";
const BTN_LINE = `inline-flex items-center justify-center gap-3 px-9 py-4 border border-brand-ink text-brand-ink text-[11px] tracking-[0.3em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500 ${FOCUS}`;
const BTN_SOLID = `inline-flex items-center justify-center gap-3 px-9 py-4 border border-brand-mauve bg-brand-mauve text-primary-foreground text-[11px] tracking-[0.3em] uppercase hover:bg-brand-ink hover:border-brand-ink transition-colors duration-500 ${FOCUS}`;
const LABEL = "block text-[10px] uppercase tracking-[0.35em] text-brand-mauve";
const H2 = "!font-light text-foreground !leading-[1.35]";
const SECTION = "px-6 py-24 md:py-36";
const LINK_GOLD = `underline decoration-brand-gold decoration-1 underline-offset-[6px] hover:text-brand-ink transition-colors ${FOCUS}`;
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información sobre las sesiones 1 a 1 de yoga y meditación.");

const SERVICES = [
  {
    title: "Clases Privadas de Kundalini Yoga y Meditación",
    desc: "Diseñadas según tu proceso personal, intención terapéutica o camino espiritual.",
    tags: ["1 a 1", "Personalizada", "Virtual"],
  },
  {
    title: "Procesos de Acompañamiento Integrativo",
    desc: "Programas de varias sesiones orientados a profundizar en objetivos específicos de regulación, autoconocimiento, integración emocional o transformación humana.",
    tags: ["Multi-sesión", "Integrativo", "Virtual"],
  },
];

const FOR_WHOM = [
  "Quieres profundizar en tu camino de autoconocimiento.",
  "Necesitas fortalecer tus recursos internos y tu conciencia corporal.",
  "Estás atravesando un proceso emocional o un momento de transición.",
  "Buscas una práctica espiritual más consciente.",
  "Vives en modo supervivencia y quieres una relación más coherente, presente y compasiva con tu vida.",
];

const WHAT_CULTIVATES = ["Claridad", "Regulación interna", "Autoconocimiento", "Conexión espiritual", "Coherencia con tu esencia"];

const STEPS = [
  { title: "Conversación inicial", desc: "Nos conocemos, comprendes el espacio y evaluamos juntos qué proceso se adapta mejor a tu momento." },
  { title: "Diseño personalizado", desc: "Adaptamos el formato, la frecuencia y la intención de cada sesión a tu historia y objetivos." },
  { title: "Acompañamiento continuo", desc: "Sesiones 1:1 con seguimiento, recursos entre encuentros y ajustes según tu proceso." },
];

const KEY_INFO = [
  { label: "Modalidad", value: "100% Virtual" },
  { label: "Duración", value: "Por sesión acordada" },
  { label: "Frecuencia", value: "Adaptable a ti" },
  { label: "Formato", value: "1 a 1 exclusivo" },
];

const FAQS = [
  { q: "¿Las sesiones son presenciales?", a: "No. Todas son virtuales, por videollamada. Puedes conectarte desde donde estés." },
  { q: "¿Necesito saber yoga o meditar?", a: "No. La práctica se adapta a tu nivel y a tu momento." },
  { q: "¿Cuánto dura cada sesión?", a: "La duración se acuerda contigo antes de empezar." },
  { q: "¿Cómo pago?", a: "Escríbeme por WhatsApp y coordinamos el pago." },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Yoga y meditación 1:1",
  serviceType: "Clases privadas de Kundalini Yoga y meditación",
  provider: { "@type": "Person", name: "Fransury Gonzáles" },
  offers: [
    { "@type": "Offer", name: "1 sesión", price: "17", priceCurrency: "USD" },
    { "@type": "Offer", name: "8 sesiones", price: "116", priceCurrency: "USD" },
  ],
};

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

/** Rombo dorado diminuto. */
const Diamond = ({ className = "" }: { className?: string }) => (
  <span aria-hidden="true" className={`inline-block w-1.5 h-1.5 rotate-45 bg-brand-gold shrink-0 ${className}`} />
);

const Benefits = ({ items, light }: { items: string[]; light?: boolean }) => (
  <ul className="space-y-3 text-left">
    {items.map((b) => (
      <li key={b} className="flex items-start gap-3">
        <span aria-hidden="true" className={`mt-2 inline-block w-1.5 h-1.5 rotate-45 shrink-0 ${light ? "bg-brand-gold" : "bg-primary-foreground/80"}`} />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const stagger = (s = 0.12) => ({ show: { transition: { staggerChildren: s } } });

/* ───────────── Hero ───────────── */
const Hero = ({ onPrecios }: { onPrecios: (e: React.MouseEvent) => void }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const mask = desktop
    ? "linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)"
    : "linear-gradient(to bottom, #000 0%, #000 84%, transparent 100%)";
  return (
    <section ref={ref} className="relative min-h-[calc(100svh-88px)] md:min-h-[calc(100svh-104px)] overflow-hidden flex flex-col md:flex-row md:items-center"
      style={{ background: desktop ? "linear-gradient(90deg, #FFFFFF 0%, #F6F2F3 32%, #DDD3D6 58%, #CEC3C6 100%)" : "linear-gradient(180deg, #D9CCCD 0%, #CDBDBF 100%)" }}>
      <div className="absolute inset-0 md:left-auto md:w-[62%] overflow-hidden"
        style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskComposite: desktop ? "source-in" : undefined, maskComposite: desktop ? "intersect" : undefined } as React.CSSProperties}>
        <motion.picture style={reduce || !desktop ? undefined : { y }} className="absolute inset-0 block will-change-transform">
          <source media="(min-width: 768px)" srcSet={HERO_IMAGE_WIDE} />
          <img src={HERO_IMAGE} alt="Fransury Gonzales en postura de cobra sobre un tapete de yoga, con los ojos cerrados" fetchPriority="high"
            width={941} height={1672} className="absolute inset-0 w-full h-full object-cover object-[72%_100%] md:object-[50%_60%] md:scale-[1.06]" />
        </motion.picture>
      </div>
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }}
        className="relative w-full max-w-6xl mx-auto px-6 pt-10 pb-[52svh] md:py-32">
        <div className="max-w-[30rem] text-center md:text-left">
          <motion.span variants={fadeUp} className={LABEL}>Sesiones 1 a 1 · Virtual</motion.span>
          <motion.h1 variants={fadeUp} className="mt-6 !text-[clamp(1.9rem,4.4vw,3.4rem)] !tracking-[0.16em] !font-extralight !leading-[1.2] text-foreground">
            Yoga y meditación 1:1
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-base md:text-[17px] text-foreground">YogaTerapia, Kundalini Yoga y Meditación</motion.p>
          <Rule className="mx-auto md:mx-0 my-7 md:my-9" />
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center md:items-center gap-5 sm:gap-8">
            <a href="#precios" onClick={onPrecios} className={`${BTN_SOLID} group`}>
              Quiero saber más
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-y-0.5" strokeWidth={1.25} />
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={`text-sm text-foreground ${LINK_GOLD}`}>
              Escríbeme por WhatsApp
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ───────────── Franja de palabras en movimiento ───────────── */
const WordsMarquee = () => {
  const reduce = useReducedMotion();
  const word = (w: string, i: number) => (
    <span className={`font-serif font-extralight uppercase tracking-[0.24em] text-xl md:text-3xl whitespace-nowrap ${i % 2 ? "text-brand-mauve" : "text-brand-ink"}`}>{w}</span>
  );
  const half = [...WHAT_CULTIVATES, ...WHAT_CULTIVATES];
  return (
    <section aria-label="Lo que cultivas" className="bg-background">
      <div aria-hidden="true" className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, hsl(var(--brand-gold) / 0.45), transparent)" }} />
      <div className="py-14 md:py-20">
        {reduce ? (
          <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-5 px-6 text-center">
            {WHAT_CULTIVATES.map((w, i) => <li key={w} className="flex items-center gap-8">{i > 0 && <Diamond />}{word(w, i)}</li>)}
          </ul>
        ) : (
          <div className="logo-marquee" tabIndex={0}>
            <ul className="sr-only">{WHAT_CULTIVATES.map((w) => <li key={w}>{w}</li>)}</ul>
            <div className="logo-marquee-track" aria-hidden="true" style={{ animationDuration: "60s" }}>
              {[0, 1].map((g) => (
                <div key={g} className="flex shrink-0 items-center">
                  {half.map((w, i) => (
                    <div key={`${g}-${i}`} className="flex items-center gap-10 md:gap-16 pr-10 md:pr-16">{word(w, i)}<Diamond /></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div aria-hidden="true" className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, hsl(var(--brand-gold) / 0.45), transparent)" }} />
    </section>
  );
};

/* ───────────── Preguntas frecuentes (acordeón) ───────────── */
const FaqAccordion = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <motion.ul {...inView} variants={stagger()} className="border-t border-border">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <motion.li key={f.q} variants={fadeUp} className="border-b border-border">
            <h3 className="!text-base !tracking-normal !normal-case">
              <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-btn-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`w-full flex items-center justify-between gap-6 py-7 text-left ${FOCUS}`}>
                <span className="font-serif font-light uppercase tracking-[0.1em] text-[15px] md:text-lg leading-relaxed text-brand-ink">{f.q}</span>
                <ChevronDown aria-hidden="true" strokeWidth={1}
                  className={`shrink-0 w-5 h-5 text-brand-gold transition-transform duration-[400ms] ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="pb-8 pr-10 text-base text-muted-foreground leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

/* ───────────── Línea de pasos que se dibuja con el scroll ───────────── */
const StepsLine = () => {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  return (
    <motion.ol ref={ref} {...inView} variants={stagger(0.15)} className="relative max-w-3xl mx-auto">
      <span aria-hidden="true" className="absolute left-[1.9rem] md:left-[2.6rem] top-3 bottom-3 w-px bg-brand-gold/20" />
      <motion.span aria-hidden="true" style={reduce ? undefined : { scaleY: scrollYProgress }}
        className="absolute left-[1.9rem] md:left-[2.6rem] top-3 bottom-3 w-px bg-brand-gold origin-top" />
      {STEPS.map(({ title, desc }, i) => (
        <motion.li key={title} variants={fadeUp} className="relative grid grid-cols-[3.8rem_1fr] md:grid-cols-[5.2rem_1fr] gap-6 md:gap-10 pb-14 md:pb-20 last:pb-0">
          <span className="relative z-10 bg-brand-cream py-1 text-center font-serif font-extralight text-4xl md:text-5xl text-brand-mauve leading-none">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pt-1">
            <h3 className="!text-lg md:!text-xl text-foreground">{title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed mt-3">{desc}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
};

const AcompanamientoIndividual = () => {
  const { settings, palette } = useVisualSettings();

  const goPrecios = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#precios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col pb-20 md:pb-0">
      <Seo
        title="Yoga y meditación 1:1 online | SantoSha"
        description="Clases privadas de Kundalini Yoga y meditación 1 a 1 con Fransury Gonzáles, por videollamada."
        path="/acompanamiento-individual"
        jsonLd={[SERVICE_JSONLD, faqJsonLd(FAQS)]}
      />
      <FloatingCTA scrollTo="#precios" ctaText="Reservar sesión" subText="Yoga y meditación 1:1" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <Hero onPrecios={goPrecios} />
        <WordsMarquee />

        {/* ¿Deseas un proceso personalizado? */}
        <section className={`${SECTION} bg-background`}>
          <motion.div {...inView} variants={stagger(0.15)} className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={fadeUp} className={H2}>¿Deseas un proceso personalizado?</motion.h2>
            <Rule className="mx-auto my-10" />
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/85 leading-[1.9]">
              Te acompaño 1 a 1 en clases privadas donde el <Highlight>Kundalini Yoga</Highlight>, la meditación y la <Highlight delay={0.4}>conciencia corporal</Highlight> se ponen al servicio de tu transformación humana.
            </motion.p>
          </motion.div>
        </section>

        {/* ¿Qué ofrezco? */}
        <section className={`${SECTION} bg-background pt-0 md:pt-0`}>
          <div className="max-w-6xl mx-auto">
            <motion.div {...inView} variants={fadeUp} className="text-center mb-16 md:mb-24">
              <h2 className={H2}>¿Qué ofrezco?</h2>
              <Rule className="mx-auto my-8" />
              <p className="text-muted-foreground text-lg">Dos modalidades de acompañamiento, ambas adaptadas a tu proceso.</p>
            </motion.div>
            <motion.div {...inView} variants={stagger(0.15)} className="grid md:grid-cols-2 border-t border-border md:border-t-0">
              {SERVICES.map(({ title, desc, tags }, i) => (
                <motion.article key={title} variants={fadeUp}
                  className={`py-12 md:py-4 md:px-14 ${i === 0 ? "md:pl-0 border-b border-border md:border-b-0 md:border-r" : "md:pr-0"}`}>
                  <span className="block font-serif font-extralight text-5xl md:text-6xl text-brand-mauve leading-none">0{i + 1}</span>
                  <h3 className="mt-8 !text-lg md:!text-xl text-foreground !leading-[1.5]">{title}</h3>
                  <p className="mt-5 text-base text-muted-foreground leading-relaxed">{desc}</p>
                  <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-brand-mauve">{tags.join(" · ")}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <Quote variant="lux-band" cite="Procesos adaptados a tu momento vital, tu historia y tu camino personal.">
          Un espacio diseñado para ayudarte a cultivar mayor claridad, regulación interna, autoconocimiento, conexión espiritual y coherencia con tu esencia.
        </Quote>

        {/* ¿Cómo funciona? */}
        <section className={`${SECTION} bg-background`}>
          <div className="max-w-5xl mx-auto">
            <motion.div {...inView} variants={fadeUp} className="text-center mb-16 md:mb-24">
              <h2 className={H2}>¿Cómo funciona?</h2>
              <Rule className="mx-auto my-8" />
              <p className="text-muted-foreground text-lg">Un proceso simple, claro y completamente a tu medida.</p>
            </motion.div>
            <div className="bg-brand-cream px-6 py-16 md:px-16 md:py-20">
              <StepsLine />
            </div>
            <motion.dl {...inView} variants={stagger()} className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4">
              {KEY_INFO.map(({ label, value }, i) => (
                <motion.div key={label} variants={fadeUp}
                  className={`px-4 md:px-6 py-6 text-center border-border ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 1 ? "md:border-r" : ""}`}>
                  <dt className={LABEL}>{label}</dt>
                  <dd className="mt-4 font-serif font-extralight uppercase tracking-[0.1em] text-base md:text-lg text-foreground leading-snug">{value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* ¿Para quién es este espacio? */}
        <section className={`${SECTION} bg-brand-cream`}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-[4fr_7fr] gap-12 md:gap-20">
            <motion.div {...inView} variants={fadeUp}>
              <h2 className={H2}>¿Para quién es este espacio?</h2>
              <Rule className="mt-8" />
            </motion.div>
            <motion.ul {...inView} variants={stagger(0.12)}>
              {FOR_WHOM.map((item) => (
                <motion.li key={item} variants={fadeUp} className="relative flex items-center justify-between gap-6 py-7 md:py-8">
                  <span className="text-base md:text-lg text-foreground leading-relaxed">{item}</span>
                  <Diamond />
                  <motion.span aria-hidden="true" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } } }}
                    className="absolute left-0 right-0 bottom-0 h-px bg-border origin-left" />
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Tu inversión */}
        <section id="precios" className={`scroll-mt-24 ${SECTION} bg-background`}>
          <motion.div {...inView} variants={stagger(0.15)} className="max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className={H2}>Tu inversión</h2>
              <Rule className="mx-auto my-8" />
              <p className="text-muted-foreground text-lg">Elige el plan que mejor acompañe tu proceso</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <PriceCardLight
                variant="lux"
                title="1 Sesión"
                price="17"
                href={getWhatsAppUrl("Hola, me gustaría agendar 1 Sesión de Acompañamiento.")}
                description={<>
                  <p>Pago por cada sesión individual</p>
                  <Benefits light items={["Duración según lo acordado", "Atención 100% personalizada", "Sin compromisos a largo plazo", "Enfoque en temas específicos"]} />
                </>}
                cta="Inscribirme a 1 Sesión"
              />
              <PriceCard
                variant="lux"
                badge="15% de descuento"
                title="Mensualidad"
                price="116"
                href={getWhatsAppUrl("Hola, me gustaría inscribirme a la Mensualidad de Acompañamiento.")}
                description={<>
                  <p>Paquete de 8 sesiones</p>
                  <Benefits items={["8 Sesiones adaptables a tu ritmo", "Seguimiento constante de tu progreso", "Recursos y herramientas entre sesiones", "Ideal para procesos de transformación humana"]} />
                </>}
                cta="Inscribirme a la Mensualidad"
              />
            </div>
          </motion.div>
        </section>

        {/* Preguntas frecuentes */}
        <section className={`${SECTION} bg-brand-cream`}>
          <div className="max-w-3xl mx-auto">
            <motion.div {...inView} variants={fadeUp} className="text-center mb-14">
              <h2 className={H2}>Preguntas frecuentes</h2>
              <Rule className="mx-auto mt-8" />
            </motion.div>
            <FaqAccordion />
          </div>
        </section>

        {/* Cierre */}
        <section id="individual-contacto" className={`${SECTION} bg-background text-center`}>
          <motion.div {...inView} variants={stagger(0.15)} className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className={H2}>Reserva tu sesión</motion.h2>
            <Rule className="mx-auto my-10" />
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
              Cuéntame qué necesitas y lo conversamos. El primer paso es simplemente llegar.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-10">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_LINE}>Escríbeme por WhatsApp</a>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-5 text-xs text-muted-foreground">Te respondo personalmente.</motion.p>
            <motion.div variants={fadeUp} className="mt-16 pt-10 border-t border-border">
              <p className={LABEL}>¿Buscas un programa grupal?</p>
              <Link to="/curso-iniciacion-yoga" className={`group mt-5 inline-flex items-center gap-3 text-base md:text-lg text-foreground ${LINK_GOLD}`}>
                Curso de Iniciación al Yoga
                <ArrowRight aria-hidden="true" className="w-4 h-4 text-brand-gold transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1} />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <NextSteps exclude="/acompanamiento-individual" />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="acompanamiento-individual" />
    </div>
  );
};

export default AcompanamientoIndividual;
