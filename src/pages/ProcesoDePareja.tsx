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
import bannerImage from "@/assets/banner-acompanamiento.webp";
import {
  fadeUp, inView, RevealTitle, RevealWords, RotatingOrnament,
  LandingSection, SplitHero, PriceCard, PriceCardLight,
} from "@/components/landing";

// Foto del hero: cambiar solo esta línea cuando llegue la foto definitiva.
const HERO_IMAGE = bannerImage;

const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white";
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

// ─── Component ────────────────────────────────────────────────────────────────
const ProcesoDePareja = () => {
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

      <FloatingCTA
        scrollTo="#tarifas"
        ctaText="Elegir mi proceso"
        subText="Psicoterapia de pareja"
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        <SplitHero image={HERO_IMAGE} alt="Psicoterapia de pareja online con Fransury Gonzáles">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
            Psicoterapia de pareja
          </motion.span>
          <RevealTitle as="h1" text="¿Por qué siempre discutimos por lo mismo?" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
          <motion.div variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light space-y-4">
            <p>
              Una relación no cambia únicamente cuando cambia el otro. En terapia de pareja trabajamos para comprender las dinámicas que se han construido entre ambos: la comunicación, los conflictos, las heridas emocionales, los patrones repetitivos, los límites, la confianza y la manera en que cada uno participa en la relación.
            </p>
            <p>
              El objetivo es crear un espacio donde ambos puedan observar lo que está ocurriendo y asumir responsabilidad sobre aquello que sí pueden transformar.
            </p>
          </motion.div>
          <motion.ul variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            <li className={PILL}><Monitor className="w-4 h-4 text-primary" /> 100% virtual</li>
            <li className={PILL}><Video className="w-4 h-4 text-primary" /> Google Meet</li>
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
            <RevealTitle text="¿Se reconocen en alguna de estas situaciones?" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center" />
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
          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <RevealWords stagger={0.03} className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground"
              text={'"Y cuando continuar juntos deja de ser el camino, la terapia también puede ayudar a transitar una separación de manera más consciente, especialmente cuando existen vínculos familiares que necesitan ser cuidados."'} />
            <div aria-hidden="true" className="h-px w-16 mx-auto bg-[#B8977E]" />
            <RevealWords stagger={0.04} className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground"
              text={'"La terapia de pareja los acompaña a relacionarse desde mayor conciencia, responsabilidad y respeto, sigan juntos o no."'} />
          </div>
        </LandingSection>

        <LandingSection id="tarifas" tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <RevealTitle text="Inicien su proceso" className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
              <motion.p variants={fadeUp} className="text-muted-foreground font-light text-lg">
                Elijan la opción que mejor se adapte a su momento actual
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-md lg:max-w-none mx-auto items-stretch">
              <PriceCardLight
                title="1 Sesión"
                price="80"
                href={cta1Session}
                description={<p>Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico en pareja.</p>}
                cta={<>Quiero 1 sesión <span className="font-bold border-l border-white/30 pl-2 ml-1">80 USD</span></>}
              />
              <PriceCardLight
                title="3 Sesiones"
                price="216"
                href={cta3Sessions}
                description={<>
                  <p>Proceso de acompañamiento más profundo para trabajar patrones relacionales y generar verdaderas herramientas de cambio.</p>
                  <p className="text-primary/80 text-xs">(descuento ya aplicado del 10%)</p>
                </>}
                cta={<>Quiero 3 sesiones <span className="font-bold border-l border-white/30 pl-2 ml-1">216 USD</span></>}
              />
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

            <motion.div variants={fadeUp} className="text-center space-y-2 max-w-2xl mx-auto text-sm">
              <p className="text-muted-foreground">
                Desde Colombia pagan en pesos a la TRM del día. Si prefieren transferencia o PayPal, escríbanme y lo coordinamos.
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
            <RevealTitle text="¿Quieren empezar? Escríbanme." className="font-serif text-3xl md:text-4xl font-semibold text-foreground" />
            <motion.div variants={fadeUp}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </LandingSection>

      </main>

      <SiteFooter palette={palette} />

      <AiChatWidget pageSlug="proceso-de-pareja" />
    </div>
  );
};

export default ProcesoDePareja;
