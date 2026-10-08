import type React from "react";
import { motion } from "framer-motion";
import sessionPhoto from "@/assets/fransury-individual.webp";
import FullBleedPhoto from "@/components/landing/FullBleedPhoto";
import ServiceHero from "@/components/landing/ServiceHero";
import SituationsGrid from "@/components/landing/SituationsGrid";
import { Clock, MessageCircle, Monitor, Video } from "lucide-react";
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
import { fadeUp, inView, RevealTitle, PriceCard, PriceCardLight } from "@/components/landing";

// Estructura "tipográfica y calmada": sin foto en el hero.
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
  "Quieres conocerte mejor y crecer como persona, aunque hoy no estés en crisis.",
];

const FAQS = [
  { q: "¿La terapia es presencial?", a: "Mis sesiones son virtuales, por Google Meet. Puedes conectarte desde donde estés, en un lugar donde te sientas a gusto y puedas hablar con libertad." },
  { q: "¿Una sesión dura más de una hora?", a: "Sí, cada sesión dura entre 60 y 75 minutos. Así tenemos tiempo para ir a fondo, sin afán." },
  { q: "¿Necesito saber qué quiero trabajar antes de empezar?", a: "Puedes llegar con una sola frase, o solo con la sensación de que algo necesita atención. Lo vamos aclarando juntos durante la sesión." },
  { q: "¿Lo que cuento es confidencial?", a: "Todo lo que hablamos en sesión es confidencial. Cuidar lo que me confías es parte esencial de mi trabajo, y trato tus datos personales conforme a la Ley 1581 de 2012." },
  { q: "¿Atiendes crisis o emergencias?", a: "Mi consulta no es un servicio de urgencias. Si en algún momento sientes que estás en riesgo, llama al 123 o acude al servicio de urgencias más cercano: tu seguridad es lo primero." },
  { q: "¿Puedo pagar con tarjeta?", a: "Sí. Puedes pagar en línea con tarjeta débito o crédito, por transferencia o por PayPal, la que te quede mejor. Desde Colombia el pago se hace en pesos a la TRM del día." },
  { q: "¿Hay descuento por paquete?", a: "Sí. El paquete de 3 sesiones cuesta 203 USD e incluye una sesión adicional de 30 minutos para acompañar tu proceso." },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Acompañamiento individual en psicoterapia",
  serviceType: "Acompañamiento individual en psicoterapia",
  provider: { "@type": "Person", name: "Fransury González", jobTitle: "Psicóloga" },
  offers: [
    { "@type": "Offer", name: "1 sesión", price: "75", priceCurrency: "USD" },
    { "@type": "Offer", name: "3 sesiones", price: "203", priceCurrency: "USD" },
  ],
};



const MiProcesoIndividual = () => {
  const { settings, palette } = useVisualSettings();


  const cta1Session = "https://checkout.bold.co/payment/LNK_2BNPOWDQ8L";
  const cta3Sessions = "https://checkout.bold.co/payment/LNK_43NGG631N3";

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Acompañamiento individual en psicoterapia online | SantoSha"
        description="Psicoterapia individual virtual con la psicóloga Fransury González. Sesiones por Google Meet de 60 a 75 minutos."
        path="/mi-proceso-individual"
        jsonLd={[faqJsonLd(FAQS), SERVICE_JSONLD]}
      />
      <FloatingCTA scrollTo="#tarifas" ctaText="Elegir mi sesión" subText="Psicoterapia individual" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <ServiceHero title="Acompañamiento individual" subtitle="Comprende el para qué."
          image={{ src: sessionPhoto, alt: "Fransury González sonriendo en un sillón beige con su libreta, frente a una consultante desenfocada", width: 1122, height: 1402, position: "object-[62%_30%]" }}
          meta={[[Monitor, "100% virtual"], [Video, "Google Meet"], [Clock, "60 a 75 minutos"]]}
          primary={{ text: "Ver opciones de consulta", target: "#tarifas" }}
          secondary={{ text: "Escríbeme por WhatsApp", href: WA_URL }}>
          <p>Todo lo que atravesamos tiene un propósito y un aprendizaje, incluso cuando duele o incomoda. Entiende tu para qué y transítalo en paz, aunque hoy estés en medio de tu propio caos.</p>
          <p>Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y relacionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.</p>
          <p>A terapia se llega en crisis y también en calma: para conocerte mejor, crecer como persona y vivir con mayor conciencia.</p>
        </ServiceHero>


        <SituationsGrid title="¿Por qué siempre me pasa lo mismo?" subtitle="¿Te reconoces en alguna de estas situaciones?" items={FOR_WHOM} />

        <Quote variant="band">Entender el para qué es el comienzo. Aprender qué hacer con lo que comprendes es el proceso.</Quote>

        {/* Tarifas */}
        <section id="tarifas" className="scroll-mt-24 px-6 py-24 md:py-36 bg-background border-t border-border">
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
