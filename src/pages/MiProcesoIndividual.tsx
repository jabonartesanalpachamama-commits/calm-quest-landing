import type React from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import sessionPhoto from "@/assets/fransury-sillon.webp";
import { ArrowDown, Clock, MessageCircle, Monitor, Video } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { faqJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { fadeUp, inView, RevealTitle, RevealWords, PriceCard, PriceCardLight } from "@/components/landing";

// Estructura "tipográfica y calmada": sin foto en el hero.
const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión de psicoterapia individual.");

const FOR_WHOM = [
  "Tienes dificultades en tus relaciones.",
  "Sientes dependencia emocional o miedo a la soledad.",
  "Tu autoestima está baja y buscas aprobación todo el tiempo.",
  "No sabes poner límites y, cuando lo intentas, sientes miedo.",
  "Estás pasando por un duelo o una pérdida: familia, amistades, una mascota o cualquier cierre que estés viviendo.",
  "Atraviesas una crisis o un momento de cambio.",
  "Repites un mismo patrón en tus relaciones.",
  "Te cuesta entender y manejar lo que sientes.",
  "Sientes que te has desconectado de ti.",
  "Necesitas replantear tu proyecto de vida.",
  "Quieres sanar patrones que vienen de tu familia.",
];

const FAQS = [
  { q: "¿La terapia es presencial?", a: "No. Todas mis sesiones son virtuales, por Google Meet. Puedes conectarte desde donde estés." },
  { q: "¿Una sesión dura más de una hora?", a: "Sí. Dura entre 60 y 75 minutos." },
  { q: "¿Necesito saber qué quiero trabajar antes de empezar?", a: "No. Puedes llegar con una sola frase y lo vamos aclarando durante la sesión." },
  { q: "¿Lo que cuento es confidencial?", a: "Sí. Todo lo que hablamos en sesión es confidencial y trato tus datos personales según la Ley 1581 de 2012." },
  { q: "¿Atiendes crisis o emergencias?", a: "No. Mi consulta no es un servicio de urgencias. Si sientes que estás en riesgo, llama al 123 o acude al servicio de urgencias más cercano." },
  { q: "¿Puedo pagar con tarjeta?", a: "Sí. Puedes pagar en línea con tarjeta débito o crédito, por transferencia o por PayPal. Desde Colombia el pago se hace en pesos a la TRM del día." },
  { q: "¿Hay descuento por paquete?", a: "Sí. El paquete de 3 sesiones cuesta 203 USD e incluye una sesión adicional de 30 minutos." },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Acompañamiento individual en psicoterapia",
  serviceType: "Acompañamiento individual en psicoterapia",
  provider: { "@type": "Person", name: "Fransury Gonzáles", jobTitle: "Psicóloga" },
  offers: [
    { "@type": "Offer", name: "1 sesión", price: "75", priceCurrency: "USD" },
    { "@type": "Offer", name: "3 sesiones", price: "203", priceCurrency: "USD" },
  ],
};

const SessionPhoto = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <motion.section ref={ref} aria-label="Fransury en sesión"
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-[110vw] max-h-[640px] md:h-[78vh] md:max-h-[760px] overflow-hidden bg-background">
      <motion.img src={sessionPhoto} alt="Fransury Gonzáles en sesión, sentada en un sillón con su libreta" loading="lazy"
        width={1122} height={1402} style={reduce ? undefined : { y }}
        className="absolute inset-x-0 -top-[30px] w-full h-[calc(100%+60px)] object-cover object-[62%_35%] md:object-[50%_38%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
    </motion.section>
  );
};


const MiProcesoIndividual = () => {
  const { settings, palette } = useVisualSettings();

  const goTarifas = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#tarifas")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cta1Session = "https://checkout.bold.co/payment/LNK_2BNPOWDQ8L";
  const cta3Sessions = "https://checkout.bold.co/payment/LNK_43NGG631N3";

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Acompañamiento individual en psicoterapia online | SantoSha"
        description="Psicoterapia individual virtual con la psicóloga Fransury Gonzáles. Sesiones por Google Meet de 60 a 75 minutos."
        path="/mi-proceso-individual"
        jsonLd={[faqJsonLd(FAQS), SERVICE_JSONLD]}
      />
      <FloatingCTA scrollTo="#tarifas" ctaText="Elegir mi sesión" subText="Psicoterapia individual" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        {/* HERO tipográfico */}
        <section className="relative overflow-hidden bg-brand-cream px-6 pt-16 pb-16 md:pt-24 md:pb-24">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] md:w-[52rem] md:h-[52rem] rounded-full bg-gradient-to-br from-warm-mauve/60 via-warm-peach/50 to-transparent blur-3xl opacity-70" />
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="relative max-w-5xl mx-auto text-center space-y-7">
            <motion.h1 variants={fadeUp} className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-[#795D64]" style={{ fontVariant: "small-caps" }}>
              Acompañamiento individual
            </motion.h1>
            <RevealWords blur stagger={0.12} text="Comprende el para qué."
              className="font-serif font-light italic leading-[1.02] text-brand-ink text-[clamp(3rem,10vw,7rem)]" />
            <motion.p variants={fadeUp} className="mx-auto max-w-[62ch] text-lg md:text-xl text-foreground/85 leading-relaxed font-light">
              Todo lo que atravesamos tiene un propósito y un aprendizaje, incluso cuando duele o incomoda. Entiende tu para qué y transítalo en paz, aunque hoy estés en medio de tu propio caos.
            </motion.p>
            <motion.p variants={fadeUp} className="mx-auto max-w-[62ch] text-base text-foreground/75 leading-relaxed font-light">
              Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y relacionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.
            </motion.p>
            <motion.ul variants={fadeUp} className="flex flex-wrap justify-center gap-2 text-sm">
              <li className={PILL}><Monitor className="w-4 h-4 text-primary" /> 100% virtual</li>
              <li className={PILL}><Video className="w-4 h-4 text-primary" /> Google Meet</li>
              <li className={PILL}><Clock className="w-4 h-4 text-primary" /> 60 a 75 minutos</li>
            </motion.ul>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-5 pt-1">
              <a href="#tarifas" onClick={goTarifas} className={BTN_SOLID + " group"}>
                Ver opciones de consulta
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#795D64] underline decoration-brand-gold underline-offset-4 hover:opacity-80">
                Escríbeme por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </section>

        <SessionPhoto />


        {/* Situaciones en masonry numerado */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Por qué siempre me pasa lo mismo?" className="font-serif text-3xl md:text-5xl font-semibold text-foreground" />
              <p className="text-muted-foreground font-light text-lg">¿Te reconoces en alguna de estas situaciones?</p>
            </div>
            <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="columns-1 md:columns-2 gap-5">
              {FOR_WHOM.map((item, i) => (
                <motion.li key={item} variants={fadeUp}
                  className="group break-inside-avoid mb-5 flex items-start gap-5 rounded-3xl bg-card border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="font-serif text-4xl md:text-5xl leading-none text-brand-gold/50 transition-colors duration-300 group-hover:text-[#795D64]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base md:text-lg text-foreground/90 leading-relaxed pt-1">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <Quote variant="band">Entender el para qué es el comienzo. Aprender qué hacer con lo que comprendes es el proceso.</Quote>

        {/* Tarifas */}
        <section id="tarifas" className="scroll-mt-24 px-6 py-14 md:py-20 bg-gradient-to-b from-background to-warm-peach/30">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.6fr] gap-10 lg:gap-14 items-start">
            <div className="lg:sticky lg:top-28 space-y-4 text-center lg:text-left">
              <RevealTitle text="Inicia tu proceso" className="font-serif text-3xl md:text-5xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground font-light text-lg">
                Elige la opción que mejor se adapte a tu momento actual
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-2 text-sm pt-2">
                <p className="text-muted-foreground">
                  Desde Colombia pagas en pesos a la TRM del día. Si prefieres transferencia o PayPal, escríbeme y lo coordinamos.
                </p>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-[#795D64] underline underline-offset-4 hover:opacity-80">
                  Escríbeme por WhatsApp
                </a>
                <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <PriceCardLight
                title="1 Sesión"
                price="75"
                href={cta1Session}
                description={<p>Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico.</p>}
                cta={<>Quiero 1 sesión <span className="font-bold border-l border-white/30 pl-2 ml-1">75 USD</span></>}
              />
              <div className="relative md:scale-[1.06] md:-translate-y-2">
                <span className="absolute -top-3 right-5 z-10 px-3 py-1 rounded-full bg-brand-gold text-brand-ink text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Recomendado
                </span>
                <PriceCard
                  title="3 Sesiones"
                  price="203"
                  href={cta3Sessions}
                  description={<>
                    <p>Proceso de acompañamiento más profundo para trabajar patrones y generar verdaderas herramientas de cambio.</p>
                    <p>Incluye una sesión adicional de 30 minutos, de psicoterapia o de yoga y meditación. Precio válido hasta el 31 de diciembre de 2026.</p>
                  </>}
                  cta={<>Quiero 3 sesiones <span className="font-bold border-l border-brand-ink/20 pl-2 ml-1">203 USD</span></>}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ dos columnas */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.6fr] gap-8 lg:gap-14 items-start">
            <div className="lg:sticky lg:top-28">
              <RevealTitle text="Preguntas frecuentes" className="font-serif text-3xl md:text-5xl font-semibold text-foreground text-center lg:text-left" />
            </div>
            <FaqSection items={FAQS} />
          </div>
        </section>

        {/* Cierre */}
        <section className="px-6 pb-4">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="max-w-4xl mx-auto rounded-[2.5rem] bg-warm-mauve/45 px-6 py-12 md:py-16 text-center space-y-6">
            <RevealTitle text="¿Quieres empezar? Escríbeme." className="font-serif text-3xl md:text-5xl font-semibold text-foreground" />
            <motion.div variants={fadeUp}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </section>

        <NextSteps exclude="/mi-proceso-individual" />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="mi-proceso-individual" />
    </div>
  );
};

export default MiProcesoIndividual;
