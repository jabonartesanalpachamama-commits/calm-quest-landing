import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Users, Leaf, Sparkles, HeartHandshake, Settings, Star, Anchor } from "lucide-react";
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

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
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

        {/* ── HERO ── */}
        <section className="relative py-32 md:py-48 px-6 overflow-hidden border-b border-border/10 flex items-center min-h-[90vh] w-full">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0 w-full">
            <img 
              src={bannerImage} 
              alt="Psicoterapia de Pareja Background" 
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="w-full max-w-3xl md:mr-auto md:ml-8 lg:ml-16 text-center md:text-left space-y-8 relative z-10"
          >
            <span className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-sm">
              <Users className="w-4 h-4" /> Psicoterapia de pareja
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
              ¿Por qué siempre discutimos por lo mismo?
            </h1>

            <div className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow mx-auto md:mx-0 space-y-4">
              <p>
                Una relación no cambia únicamente cuando cambia el otro. En terapia de pareja trabajamos para comprender las dinámicas que se han construido entre ambos: la comunicación, los conflictos, las heridas emocionales, los patrones repetitivos, los límites, la confianza y la manera en que cada uno participa en la relación.
              </p>
              <p>
                El objetivo es crear un espacio donde ambos puedan observar lo que está ocurriendo y asumir responsabilidad sobre aquello que sí pueden transformar.
              </p>
            </div>

            <div className="pt-8">
              <a
                href="#tarifas"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#tarifas")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white text-gray-900 hover:bg-gray-50"
              >
                Ver opciones de consulta <Anchor className="w-4 h-4 ml-1 text-gray-700" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── PARA QUÉ AYUDA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center space-y-3">
              <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Se reconocen en alguna de estas situaciones?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {FOR_WHOM.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, delay: idx * 0.05 } } }}
                  className="flex items-start gap-4 bg-background border border-border/40 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed font-light">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── RECUADRO DESTACADO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto"
          >
            <div className={`rounded-3xl p-10 md:p-14 text-center space-y-8 ${palette.secondary} shadow-lg relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
              <div className="relative z-10 space-y-6">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className={`font-serif text-2xl md:text-3xl font-medium leading-relaxed ${palette.secondaryText}`}>
                  "Y cuando continuar juntos deja de ser el camino, la terapia también puede ayudar a transitar una separación de manera más consciente, especialmente cuando existen vínculos familiares que necesitan ser cuidados."
                </p>
                <div className="h-px w-24 bg-primary/30 mx-auto" />
                <p className={`font-serif text-xl font-light italic leading-relaxed ${palette.secondaryText} opacity-90`}>
                  "La terapia de pareja los acompaña a relacionarse desde mayor conciencia, responsabilidad y respeto, sigan juntos o no."
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── TARIFAS / BOTONES ── */}
        <section id="tarifas" className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center space-y-3">
              <Settings className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Inicien su proceso
              </h2>
              <p className="text-muted-foreground font-light text-lg">
                Elijan la opción que mejor se adapte a su momento actual
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Opción 1 Sesión */}
              <div className="relative group bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    1 Sesión
                  </h3>
                  <p className="text-muted-foreground text-sm font-light mb-8 flex-grow">
                    Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico en pareja.
                  </p>
                  
                  <a
                    href={cta1Session}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 ${palette.primary} ${palette.primaryText} hover:opacity-90`}
                  >
                    Quiero 1 sesión <span className="font-bold border-l border-black/20 pl-2 ml-1">80 USD</span>
                  </a>
                </div>
              </div>

              {/* Opción 3 Sesiones */}
              <div className="relative group bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    3 Sesiones
                  </h3>
                  <p className="text-muted-foreground text-sm font-light mb-8 flex-grow">
                    Proceso de acompañamiento más profundo para trabajar patrones relacionales y generar verdaderas herramientas de cambio.
                    <br/><br/>
                    <span className="text-primary/80 text-xs">(descuento ya aplicado del 10%)</span>
                  </p>
                  
                  <a
                    href={cta3Sessions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 ${palette.primary} ${palette.primaryText} hover:opacity-90`}
                  >
                    Quiero 3 sesiones <span className="font-bold border-l border-black/20 pl-2 ml-1">216 USD</span>
                  </a>
                </div>
              </div>

              {/* Opción 4 Sesiones */}
              <div className="relative group bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-sm z-20">
                    Recomendado
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    4 Sesiones
                  </h3>
                  <p className="text-muted-foreground text-sm font-light mb-8 flex-grow">
                    Es el paquete que recomiendo: cada uno tiene un espacio individual y compartimos 2 espacios juntos.
                    <br/><br/>
                    <span className="text-primary/80 text-xs">(descuento ya aplicado del 10%)</span>
                  </p>
                  
                  <a
                    href={cta4Sessions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${palette.primary} ${palette.primaryText} hover:opacity-90`}
                  >
                    Quiero 4 sesiones <span className="font-bold border-l border-black/20 pl-2 ml-1">288 USD</span>
                  </a>
                </div>
              </div>

            </div>

            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-muted-foreground font-light">
                Desde Colombia pagan en pesos a la TRM del día. Si prefieren transferencia o PayPal, escríbanme y lo coordinamos.
              </p>
              <a
                href={getWhatsAppUrl("Hola Fransury, quiero información para iniciar un proceso de psicoterapia de pareja.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-semibold text-primary underline underline-offset-4 hover:opacity-80"
              >
                Escríbeme por WhatsApp
              </a>
              <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
            </div>
          </motion.div>
        </section>

        <section className={`py-20 md:py-28 px-6 ${palette.background}`}>
          <div className="max-w-3xl mx-auto">
            <FaqSection title="Preguntas frecuentes" items={FAQS} />
          </div>
        </section>

      </main>

      <SiteFooter palette={palette} />

      <AiChatWidget pageSlug="proceso-de-pareja" />
    </div>
  );
};

export default ProcesoDePareja;
