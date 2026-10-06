/**
 * YOGA Y MEDITACIÓN 1:1 — editorial, poco texto (Lote AA):
 * hero con el color plano del telón de la foto, índice interno discreto, secciones planas
 * alternando blanco / #FBF9F8, titular + máx. 2 líneas por sección. Sin barra flotante.
 */
import { useRef, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Monitor, Video } from "lucide-react";
import ServiceHero from "@/components/landing/ServiceHero";
import SituationsGrid from "@/components/landing/SituationsGrid";
import FullBleedPhoto from "@/components/landing/FullBleedPhoto";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import { faqJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import yogaPhoto from "@/assets/fransury-yoga-nueva.webp";
import { fadeUp, inView, PriceCard, PriceCardLight } from "@/components/landing";

// Foto del hero (misma en móvil y escritorio) y color plano de su telón.

const FOCUS = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-4";
const BTN_LINE = `inline-flex items-center justify-center gap-3 px-9 py-4 border border-brand-ink text-brand-ink text-[11px] tracking-[0.3em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500 ${FOCUS}`;
const LABEL = "block text-[10px] uppercase tracking-[0.35em] text-brand-mauve";
const H2 = "!font-light text-foreground !leading-[1.35]";
const SECTION = "px-6 py-24 md:py-36";
const LINK_GOLD = `underline decoration-brand-gold decoration-1 underline-offset-[6px] hover:text-brand-ink transition-colors ${FOCUS}`;
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información sobre las sesiones 1 a 1 de yoga y meditación.");

const SERVICES = [
  {
    title: "Clases Privadas de Kundalini Yoga y Meditación",
    desc: "Diseñadas según tu proceso, tu intención y tu momento.",
    tags: ["1 a 1", "Personalizada", "Virtual"],
  },
  {
    title: "Procesos de Acompañamiento Integrativo",
    desc: "Varias sesiones para profundizar en regulación y autoconocimiento.",
    tags: ["Multi-sesión", "Integrativo", "Virtual"],
  },
];

const FOR_WHOM = [
  "Quieres conocerte más a fondo.",
  "Atraviesas un momento de transición.",
  "Buscas una práctica espiritual consciente.",
  "Vives en modo supervivencia y quieres soltar.",
];

const WHAT_CULTIVATES = ["Claridad", "Regulación interna", "Autoconocimiento", "Conexión espiritual", "Coherencia con tu esencia"];

const STEPS = [
  { title: "Conversación inicial", desc: "Nos conocemos y elegimos el proceso adecuado." },
  { title: "Diseño personalizado", desc: "Formato y frecuencia a tu medida." },
  { title: "Acompañamiento continuo", desc: "Sesiones 1:1 con seguimiento y recursos." },
];

const KEY_INFO = [
  { label: "Modalidad", value: "100% Virtual" },
  { label: "Duración", value: "60 minutos" },
  { label: "Frecuencia", value: "Adaptable a ti" },
  { label: "Formato", value: "1 a 1 exclusivo" },
];

const FAQS = [
  { q: "¿Las sesiones son presenciales?", a: "Todas mis sesiones son virtuales, por videollamada. Puedes conectarte desde tu casa o desde donde estés, en un lugar donde te sientas a gusto." },
  { q: "¿Necesito saber yoga o meditar?", a: "Puedes llegar sin haber practicado nunca. Adapto cada sesión a tu nivel, a tu cuerpo y a tu momento, y empezamos desde donde estás." },
  { q: "¿Cuánto dura cada sesión?", a: "Cada clase dura 60 minutos. Es un tiempo pensado para que llegues, te sueltes y salgas sintiéndote en calma." },
  { q: "¿Cómo pago?", a: "Escríbeme por WhatsApp y coordinamos el pago de la forma que te resulte más cómoda." },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Yoga y meditación 1:1",
  serviceType: "Clases privadas de Kundalini Yoga y meditación",
  description: "Clases privadas de Kundalini Yoga y meditación de 60 minutos.",
  provider: { "@type": "Person", name: "Fransury González" },
  offers: [
    { "@type": "Offer", name: "1 sesión", price: "17", priceCurrency: "USD" },
    { "@type": "Offer", name: "8 sesiones", price: "116", priceCurrency: "USD" },
  ],
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

const HERO_ALT = "Fransury González en postura de meditación con las manos en el pecho y el abdomen";

/* ───────────── Índice interno ───────────── */
const SUBNAV: [string, string][] = [["que-ofrezco", "Qué ofrezco"], ["como-funciona", "Cómo funciona"], ["precios", "Inversión"], ["preguntas", "Preguntas"]];
const SubNav = () => (
  <nav aria-label="En esta página" className="bg-background border-b border-border">
    <ul className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-brand-ink">
      {SUBNAV.map(([id, label], i) => (
        <li key={id} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="text-brand-gold">·</span>}
          <a href={`#${id}`} className={`py-2 hover:text-brand-mauve transition-colors ${FOCUS}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", `#${id}`); }}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

/* ───────────── Franja de palabras en movimiento ───────────── */
const WordsMarquee = () => {
  const reduce = useReducedMotion();
  const word = (w: string, i: number) => (
    <span className={`font-serif font-extralight uppercase tracking-[0.3em] text-xs md:text-sm whitespace-nowrap ${i % 2 ? "text-brand-mauve" : "text-brand-ink"}`}>{w}</span>
  );
  const half = [...WHAT_CULTIVATES, ...WHAT_CULTIVATES];
  return (
    <section aria-label="Lo que cultivas" className="bg-background">
      <div className="py-5 md:py-6 border-b border-border">
        {reduce ? (
          <ul className="flex flex-nowrap overflow-hidden justify-center items-center gap-x-5 px-6 text-center">
            {WHAT_CULTIVATES.map((w, i) => <li key={w} className="flex items-center gap-5">{i > 0 && <Diamond />}{word(w, i)}</li>)}
          </ul>
        ) : (
          <div className="logo-marquee" tabIndex={0}>
            <ul className="sr-only">{WHAT_CULTIVATES.map((w) => <li key={w}>{w}</li>)}</ul>
            <div className="logo-marquee-track" aria-hidden="true" style={{ animationDuration: "60s" }}>
              {[0, 1].map((g) => (
                <div key={g} className="flex shrink-0 items-center">
                  {half.map((w, i) => (
                    <div key={`${g}-${i}`} className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12">{word(w, i)}<Diamond /></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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


  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Seo
        title="Yoga y meditación online 1:1 | Fransury González"
        description="Clases privadas de Kundalini Yoga y meditación 1 a 1 por videollamada con Fransury González, desde Medellín para todo el mundo. 60 min, desde 17 USD."
        path="/acompanamiento-individual"
        jsonLd={[SERVICE_JSONLD, faqJsonLd(FAQS)]}
      />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <ServiceHero label="Sesiones 1 a 1 · Virtual" title="Yoga y meditación 1:1"
          meta={[[Monitor, "100% virtual"], [Video, "Google Meet"], [Clock, "60 minutos"]]}
          primary={{ text: "Reservar sesión", target: "#precios" }}
          secondary={{ text: "Escríbeme por WhatsApp", href: WA_URL }}>
          <p>YogaTerapia, Kundalini Yoga y Meditación</p>
          <p>Clases privadas donde tu cuerpo, tu respiración y la meditación te devuelven a ti.</p>
        </ServiceHero>
        <FullBleedPhoto src={yogaPhoto} label="Fransury en meditación" alt={HERO_ALT} width={1122} height={1402} position="object-[50%_22%]"
          desktop={{ src: yogaPhoto, width: 1122, height: 1402, background: "#B8A8AB" }} />
        <SituationsGrid title="¿Para quién es este espacio?" items={FOR_WHOM} />
        <SubNav />
        <WordsMarquee />

        {/* ¿Qué ofrezco? */}
        <section id="que-ofrezco" className={`scroll-mt-24 ${SECTION} bg-background`}>
          <div className="max-w-6xl mx-auto">
            <motion.div {...inView} variants={fadeUp} className="text-center mb-14 md:mb-20">
              <h2 className={H2}>¿Qué ofrezco?</h2>
              <Rule className="mx-auto my-8" />
              <p className="text-muted-foreground text-lg">Dos modalidades, ambas a tu medida.</p>
            </motion.div>
            <motion.div {...inView} variants={stagger(0.15)} className="grid md:grid-cols-2 border-t border-border md:border-t-0">
              {SERVICES.map(({ title, desc, tags }, i) => (
                <motion.article key={title} variants={fadeUp}
                  className={`py-12 md:py-4 md:px-14 ${i === 0 ? "md:pl-0 border-b border-border md:border-b-0 md:border-r" : "md:pr-0"}`}>
                  <span className="block font-serif font-extralight text-5xl md:text-6xl text-brand-mauve leading-none">0{i + 1}</span>
                  <h3 className="mt-8 !text-lg md:!text-xl text-foreground !leading-[1.5]">{title}</h3>
                  <p className="mt-4 text-base text-muted-foreground leading-relaxed">{desc}</p>
                  <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-brand-mauve">{tags.join(" · ")}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ¿Cómo funciona? */}
        <section id="como-funciona" className={`scroll-mt-24 ${SECTION} bg-brand-cream`}>
          <div className="max-w-5xl mx-auto">
            <motion.div {...inView} variants={fadeUp} className="text-center mb-16 md:mb-24">
              <h2 className={H2}>¿Cómo funciona?</h2>
              <Rule className="mx-auto my-8" />
              <p className="text-muted-foreground text-lg">Simple, claro y a tu medida.</p>
            </motion.div>
            <StepsLine />
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

        {/* Tu inversión */}
        <section id="precios" className={`scroll-mt-24 ${SECTION} bg-brand-cream`}>
          <motion.div {...inView} variants={stagger(0.15)} className="relative max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className={H2}>Tu inversión</h2>
              <Rule className="mx-auto my-8" />
              <p className="text-muted-foreground text-lg">Elige el plan que acompañe tu proceso.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <PriceCardLight
                variant="lux"
                title="1 Sesión"
                price="17"
                href={getWhatsAppUrl("Hola, me gustaría agendar 1 Sesión de Acompañamiento.")}
                description={<>
                  <p>Pago por cada sesión individual</p>
                  <Benefits light items={["Clases de 60 minutos", "Atención personalizada", "Sin compromisos"]} />
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
                  <Benefits items={["8 sesiones a tu ritmo", "Seguimiento de tu progreso", "Recursos entre sesiones"]} />
                </>}
                cta="Inscribirme a la Mensualidad"
              />
            </div>
          </motion.div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className={`scroll-mt-24 ${SECTION} bg-background`}>
          <div className="max-w-3xl mx-auto">
            <motion.div {...inView} variants={fadeUp} className="text-center mb-14">
              <h2 className={H2}>Preguntas frecuentes</h2>
              <Rule className="mx-auto mt-8" />
            </motion.div>
            <FaqAccordion />
          </div>
        </section>

        {/* Cierre */}
        <section id="individual-contacto" className={`${SECTION} bg-brand-cream text-center`}>
          <motion.div {...inView} variants={stagger(0.15)} className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className={H2}>Reserva tu sesión</motion.h2>
            <Rule className="mx-auto my-10" />
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
              Cuéntame qué necesitas y lo conversamos.
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
