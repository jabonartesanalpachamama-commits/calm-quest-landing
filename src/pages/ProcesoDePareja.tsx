import type React from "react";
import { motion } from "framer-motion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowDown, MessageCircle, Minus, Monitor, Plus, Video } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { faqJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { fadeUp, inView, EASE, RevealTitle, PriceCard, PriceCardLight } from "@/components/landing";

// Estructura "dos voces": hero partido en color, situaciones como diálogo.
const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información para iniciar un proceso de psicoterapia de pareja.");

const FOR_WHOM = [
  "Se les dificulta comunicarse sin que termine en discusión.",
  "Los conflictos se repiten y no logran resolverlos.",
  "Notan patrones que están deteriorando la relación.",
  "Hay heridas y experiencias que siguen afectando el vínculo.",
  "Les cuesta poner límites que los cuiden a los dos.",
  "Quieren recuperar la cercanía, la confianza y la intimidad.",
  "Necesitan construir acuerdos y nuevas formas de relacionarse.",
];

const FAQS = [
  { q: "¿La terapia de pareja es presencial?", a: "No. Todas mis sesiones son virtuales, por Google Meet. Cada uno puede conectarse desde donde esté." },
  { q: "¿Tienen que asistir los dos?", a: "Las sesiones de pareja se hacen en una sesión virtual compartida. En el paquete de 4 sesiones, cada uno tiene además un espacio individual." },
  { q: "¿Cuántas sesiones necesitamos?", a: "Para iniciar un proceso de pareja recomiendo mínimo 3 sesiones." },
  { q: "¿Lo que contamos es confidencial?", a: "Sí. Todo lo que hablamos en sesión es confidencial y trato sus datos personales según la Ley 1581 de 2012." },
  { q: "¿Atiendes crisis o emergencias?", a: "No. Mi consulta no es un servicio de urgencias. Si hay riesgo para alguno de los dos, llamen al 123 o acudan al servicio de urgencias más cercano." },
  { q: "¿Cómo se paga?", a: "En línea con tarjeta débito o crédito, por transferencia o por PayPal. Desde Colombia el pago se hace en pesos a la TRM del día." },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicoterapia de pareja",
  serviceType: "Psicoterapia de pareja en línea",
  provider: { "@type": "Person", name: "Fransury Gonzáles", jobTitle: "Psicóloga" },
  offers: [
    { "@type": "Offer", name: "1 sesión", price: "80", priceCurrency: "USD" },
    { "@type": "Offer", name: "3 sesiones", price: "216", priceCurrency: "USD" },
    { "@type": "Offer", name: "4 sesiones", price: "288", priceCurrency: "USD" },
  ],
};

const ProcesoDePareja = () => {
  const { settings, palette } = useVisualSettings();

  const goTarifas = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#tarifas")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cta1Session = "https://checkout.bold.co/payment/LNK_F9YHBRBQLU";
  const cta3Sessions = "https://checkout.bold.co/payment/LNK_7IOCCI6CQ4";
  const cta4Sessions = "https://checkout.bold.co/payment/LNK_TG1CNBMOKY";

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Psicoterapia de pareja online | SantoSha"
        description="Psicoterapia de pareja virtual con la psicóloga Fransury Gonzáles. Sesiones por Google Meet para ambos en la misma sesión."
        path="/proceso-de-pareja"
        jsonLd={[faqJsonLd(FAQS), SERVICE_JSONLD]}
      />
      <FloatingCTA scrollTo="#tarifas" ctaText="Elegir mi proceso" subText="Psicoterapia de pareja" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        {/* HERO 50/50 */}
        <section className="relative grid md:grid-cols-2">
          <div aria-hidden="true" className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-brand-gold z-10" />
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="bg-[#795D64] text-brand-cream px-6 py-14 md:px-12 lg:px-16 md:py-24 flex flex-col justify-center space-y-6">
            <motion.span variants={fadeUp} className="self-start px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-brand-cream/40 text-brand-cream">
              Psicoterapia de pareja
            </motion.span>
            <RevealTitle as="h1" text="¿Por qué siempre discutimos por lo mismo?" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-brand-cream" />
          </motion.div>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="bg-brand-cream px-6 py-12 md:px-12 lg:px-16 md:py-24 flex flex-col justify-center space-y-6">
            <motion.div variants={fadeUp} className="text-lg text-foreground/85 leading-relaxed font-light space-y-4">
              <p>
                Una relación no cambia únicamente cuando cambia el otro. En terapia de pareja trabajamos para comprender las dinámicas que se han construido entre ambos: la comunicación, los conflictos, las heridas emocionales, los patrones repetitivos, los límites, la confianza y la manera en que cada uno participa en la relación.
              </p>
              <p>
                El objetivo es crear un espacio donde ambos puedan observar lo que está ocurriendo y asumir responsabilidad sobre aquello que sí pueden transformar.
              </p>
            </motion.div>
            <motion.ul variants={fadeUp} className="flex flex-wrap gap-2 text-sm">
              <li className={PILL}><Monitor className="w-4 h-4 text-primary" /> 100% virtual</li>
              <li className={PILL}><Video className="w-4 h-4 text-primary" /> Google Meet</li>
            </motion.ul>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
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

        {/* Situaciones como diálogo */}
        <section className="px-6 py-14 md:py-20">
          <div className="max-w-3xl mx-auto space-y-10">
            <RevealTitle text="¿Se reconocen en alguna de estas situaciones?" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
            <ul className="flex flex-col gap-4">
              {FOR_WHOM.map((item, i) => {
                const left = i % 2 === 0;
                return (
                  <motion.li key={item}
                    initial={{ opacity: 0, x: left ? -32 : 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`max-w-[85%] md:max-w-[70%] px-6 py-4 text-base md:text-lg leading-relaxed text-foreground/90 rounded-3xl ${
                      left ? "self-start bg-warm-mauve/50 rounded-bl-md" : "self-end bg-warm-peach/70 rounded-br-md text-right"
                    }`}>
                    {item}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </section>

        <Quote variant="side">Y cuando continuar juntos deja de ser el camino, la terapia también puede ayudar a transitar una separación de manera más consciente, especialmente cuando existen vínculos familiares que necesitan ser cuidados.</Quote>
        <Quote variant="side">La terapia de pareja los acompaña a relacionarse desde mayor conciencia, responsabilidad y respeto, sigan juntos o no.</Quote>

        {/* Tarifas */}
        <section id="tarifas" className="scroll-mt-24 px-6 py-14 md:py-20 bg-brand-cream/70">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <RevealTitle text="Inicien su proceso" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground font-light text-lg">
                Elijan la opción que mejor se adapte a su momento actual
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-md lg:max-w-none mx-auto items-center">
              <PriceCardLight
                title="1 Sesión"
                price="80"
                href={cta1Session}
                description={<p>Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico en pareja.</p>}
                cta={<>Quiero 1 sesión <span className="font-bold border-l border-white/30 pl-2 ml-1">80 USD</span></>}
              />
              <div className="order-first lg:order-none lg:[&>div]:py-12">
                <PriceCard
                  badge="Recomendado"
                  title="4 Sesiones"
                  price="288"
                  href={cta4Sessions}
                  description={<>
                    <p>Es el paquete que recomiendo: cada uno tiene un espacio individual y compartimos 2 espacios juntos.</p>
                    <p className="text-xs">(descuento ya aplicado del 10%)</p>
                  </>}
                  cta={<>Quiero 4 sesiones <span className="font-bold border-l border-brand-ink/20 pl-2 ml-1">288 USD</span></>}
                />
              </div>
              <PriceCardLight
                title="3 Sesiones"
                price="216"
                href={cta3Sessions}
                description={<>
                  <p>Proceso de acompañamiento más profundo para trabajar patrones relacionales y generar verdaderas herramientas de cambio.</p>
                  <p className="text-[#795D64] text-xs">(descuento ya aplicado del 10%)</p>
                </>}
                cta={<>Quiero 3 sesiones <span className="font-bold border-l border-white/30 pl-2 ml-1">216 USD</span></>}
              />
            </div>

            <motion.div variants={fadeUp} className="text-center space-y-2 max-w-2xl mx-auto text-sm">
              <p className="text-muted-foreground">
                Desde Colombia pagan en pesos a la TRM del día. Si prefieren transferencia o PayPal, escríbanme y lo coordinamos.
              </p>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-[#795D64] underline underline-offset-4 hover:opacity-80">
                Escríbeme por WhatsApp
              </a>
              <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ ancho completo con más/menos */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <RevealTitle text="Preguntas frecuentes" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
            <AccordionPrimitive.Root type="single" collapsible className="border-t border-border/60">
              {FAQS.map((f, i) => (
                <AccordionPrimitive.Item key={i} value={`f-${i}`} className="border-b border-border/60">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="group w-full min-h-[56px] flex items-center justify-between gap-6 py-5 text-left font-serif text-lg md:text-xl text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm">
                      {f.q}
                      <span className="shrink-0 w-9 h-9 rounded-full border border-[#795D64]/40 flex items-center justify-center text-[#795D64]">
                        <Plus className="w-4 h-4 group-data-[state=open]:hidden" aria-hidden="true" />
                        <Minus className="w-4 h-4 hidden group-data-[state=open]:block" aria-hidden="true" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <p className="pb-5 pr-14 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </div>
        </section>

        {/* Cierre: franja ciruela */}
        <section className="bg-brand-ink text-brand-cream px-6 py-12 md:py-14">
          <motion.div {...inView} variants={fadeUp} className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">¿Quieren empezar? Escríbanme.</h2>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-brand-cream text-brand-ink hover:scale-[1.02] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink">
              <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
            </a>
          </motion.div>
        </section>

        <NextSteps exclude="/proceso-de-pareja" />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="proceso-de-pareja" />
    </div>
  );
};

export default ProcesoDePareja;
