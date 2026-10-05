import { useEffect, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, Clock, MessageCircle, Monitor, Video } from "lucide-react";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { faqJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import fransuryRetrato from "@/assets/fransury-retrato.webp";
import {
  fadeUp, inView, RevealTitle, RevealWords, RotatingOrnament,
  LandingSection, SplitHero, PriceCard, PriceCardLight,
} from "@/components/landing";

// Foto del hero: cambiar solo esta línea cuando llegue la foto definitiva.
const HERO_IMAGE = fransuryRetrato;

const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white";
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

// ─── Component ────────────────────────────────────────────────────────────────
const MiProcesoIndividual = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());

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

  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

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

      <FloatingCTA
        scrollTo="#tarifas"
        ctaText="Elegir mi sesión"
        subText="Psicoterapia individual"
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        <SplitHero image={HERO_IMAGE} imagePosition="object-top" maskClassName="hero-bleed-narrow" alt="Fransury Gonzáles, psicóloga y maestra de Kundalini Yoga">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
            Psicoterapia individual
          </motion.span>
          <RevealTitle as="h1" text="Acompañamiento individual" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
          <motion.p variants={fadeUp} className="font-serif text-2xl md:text-3xl font-light italic text-foreground">
            Comprende el para qué.
          </motion.p>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
            Todo lo que atravesamos tiene un propósito y un aprendizaje, incluso cuando duele o incomoda. Entiende tu para qué y transítalo en paz, aunque hoy estés en medio de tu propio caos.
          </motion.p>
          <motion.p variants={fadeUp} className="text-base text-foreground/70 leading-relaxed font-light">
            Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y relacionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.
          </motion.p>
          <motion.ul variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            <li className={PILL}><Monitor className="w-4 h-4 text-primary" /> 100% virtual</li>
            <li className={PILL}><Video className="w-4 h-4 text-primary" /> Google Meet</li>
            <li className={PILL}><Clock className="w-4 h-4 text-primary" /> 60 a 75 minutos</li>
          </motion.ul>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-1">
            <a href="#tarifas" onClick={goTarifas} className={BTN_SOLID + " group"}>
              Ver opciones de consulta
              <span className="inline-flex transition-transform duration-300 group-hover:translate-y-1">
                <motion.span className="inline-flex" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowDown className="w-4 h-4" />
                </motion.span>
              </span>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline decoration-brand-gold underline-offset-4 hover:opacity-80">
              Escríbeme por WhatsApp
            </a>
          </motion.div>
        </SplitHero>

        <LandingSection tone="plain">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Por qué siempre me pasa lo mismo?" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
              <p className="text-muted-foreground font-light text-lg">¿Te reconoces en alguna de estas situaciones?</p>
            </div>
            <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="grid md:grid-cols-2 gap-x-10">
              {FOR_WHOM.map((item) => (
                <motion.li key={item} variants={fadeUp} className="flex items-start gap-4 py-4 border-b border-border/30">
                  <span aria-hidden="true" className="mt-1 w-px h-5 shrink-0 bg-[#B8977E]" />
                  <span className="text-base text-foreground/90 leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </LandingSection>

        <LandingSection tone="mauve" className="overflow-hidden">
          <RotatingOrnament className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 opacity-25" />
          <RevealWords stagger={0.04} className="relative max-w-3xl mx-auto text-center font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground"
            text={'"Entender el para qué es el comienzo. Aprender qué hacer con lo que comprendes es el proceso."'} />
        </LandingSection>

        <LandingSection id="tarifas" tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <RevealTitle text="Inicia tu proceso" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground font-light text-lg">
                Elige la opción que mejor se adapte a tu momento actual
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
              <PriceCardLight
                title="1 Sesión"
                price="75"
                href={cta1Session}
                description={<p>Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico.</p>}
                cta={<>Quiero 1 sesión <span className="font-bold border-l border-white/30 pl-2 ml-1">75 USD</span></>}
              />
              <PriceCard
                badge="Recomendado"
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

            <motion.div variants={fadeUp} className="text-center space-y-2 max-w-2xl mx-auto text-sm">
              <p className="text-muted-foreground">
                Desde Colombia pagas en pesos a la TRM del día. Si prefieres transferencia o PayPal, escríbeme y lo coordinamos.
              </p>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-primary underline underline-offset-4 hover:opacity-80">
                Escríbeme por WhatsApp
              </a>
              <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
            </motion.div>
          </motion.div>
        </LandingSection>

        <LandingSection tone="plain">
          <div className="max-w-3xl mx-auto">
            <FaqSection
              items={FAQS}
              titleSlot={<RevealTitle text="Preguntas frecuentes" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-6" />}
            />
          </div>
        </LandingSection>

        <LandingSection tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-2xl mx-auto text-center space-y-6">
            <RevealTitle text="¿Quieres empezar? Escríbeme." className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
            <motion.div variants={fadeUp}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </LandingSection>

      </main>

      <SiteFooter palette={palette} />

      <AiChatWidget pageSlug="mi-proceso-individual" />
    </div>
  );
};

export default MiProcesoIndividual;
