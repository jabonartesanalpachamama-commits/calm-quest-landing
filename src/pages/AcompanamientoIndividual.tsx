import { useEffect, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, User, Leaf, Search, Sparkles, Zap, Sun, MessageCircle, Smartphone, Clock, Calendar, Users, Moon } from "lucide-react";
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
import paraQuienImage from "@/assets/para-quien-image.webp";
import {
  fadeUp, inView, RevealTitle, RotatingOrnament,
  LandingSection, SplitHero, PriceCard, PriceCardLight,
} from "@/components/landing";

// Foto del hero: cambiar solo esta línea cuando llegue la foto definitiva.
const HERO_IMAGE = fransuryRetrato;

const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white";
const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground";
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información sobre las sesiones 1 a 1 de yoga y meditación.");

const SERVICES = [
  {
    icon: User,
    title: "Clases Privadas de Kundalini Yoga y Meditación",
    desc: "Diseñadas según tu proceso personal, intención terapéutica o camino espiritual.",
    tags: ["1 a 1", "Personalizada", "Virtual"],
  },
  {
    icon: Leaf,
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

const WHAT_CULTIVATES = [
  { icon: Search, label: "Claridad" },
  { icon: Zap, label: "Regulación interna" },
  { icon: Sun, label: "Autoconocimiento" },
  { icon: Sparkles, label: "Conexión espiritual" },
  { icon: Leaf, label: "Coherencia con tu esencia" },
];

const STEPS = [
  { title: "Conversación inicial", desc: "Nos conocemos, comprendes el espacio y evaluamos juntos qué proceso se adapta mejor a tu momento." },
  { title: "Diseño personalizado", desc: "Adaptamos el formato, la frecuencia y la intención de cada sesión a tu historia y objetivos." },
  { title: "Acompañamiento continuo", desc: "Sesiones 1:1 con seguimiento, recursos entre encuentros y ajustes según tu proceso." },
];

const KEY_INFO = [
  { icon: Smartphone, label: "Modalidad", value: "100% Virtual" },
  { icon: Clock, label: "Duración", value: "Por sesión acordada" },
  { icon: Calendar, label: "Frecuencia", value: "Adaptable a ti" },
  { icon: Users, label: "Formato", value: "1 a 1 exclusivo" },
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

const Benefits = ({ items, light }: { items: string[]; light?: boolean }) => (
  <ul className="space-y-3 text-left">
    {items.map((b) => (
      <li key={b} className="flex items-start gap-3">
        <Leaf className={`w-4 h-4 mt-0.5 shrink-0 ${light ? "text-primary" : "text-white"}`} />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const AcompanamientoIndividual = () => {
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

  const goPrecios = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#precios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Yoga y meditación 1:1 online | SantoSha"
        description="Clases privadas de Kundalini Yoga y meditación 1 a 1 con Fransury Gonzáles, por videollamada."
        path="/acompanamiento-individual"
        jsonLd={[SERVICE_JSONLD, faqJsonLd(FAQS)]}
      />

      <FloatingCTA scrollTo="#precios" ctaText="Reservar sesión" subText="Yoga y meditación 1:1" />

      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <SplitHero image={HERO_IMAGE} imagePosition="object-top" maskClassName="hero-bleed-narrow" alt="Fransury Gonzáles, psicóloga y maestra de Kundalini Yoga">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
            Sesiones 1 a 1 · Virtual
          </motion.span>
          <RevealTitle as="h1" text="Yoga y meditación 1:1" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
            YogaTerapia, Kundalini Yoga y Meditación
          </motion.p>
          <motion.ul variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            {WHAT_CULTIVATES.map(({ icon: Icon, label }) => (
              <li key={label} className={PILL}><Icon className="w-4 h-4 text-primary" /> {label}</li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-1">
            <a href="#precios" onClick={goPrecios} className={BTN_SOLID + " group"}>
              Quiero saber más
              <motion.span className="inline-flex" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline decoration-brand-gold underline-offset-4 hover:opacity-80">
              Escríbeme por WhatsApp
            </a>
          </motion.div>
        </SplitHero>

        {/* Qué es */}
        <LandingSection tone="plain">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-3xl mx-auto text-center space-y-5">
            <RevealTitle text="¿Deseas un proceso personalizado?" className={H2} />
            <motion.p variants={fadeUp} className="text-lg text-foreground/80 leading-relaxed font-light">
              Te acompaño 1 a 1 en clases privadas donde el <strong className="text-foreground font-semibold">Kundalini Yoga</strong>, la <strong className="text-foreground font-semibold">meditación</strong> y la <strong className="text-foreground font-semibold">conciencia corporal</strong> se ponen al servicio de tu transformación humana.
            </motion.p>
          </motion.div>
        </LandingSection>

        <LandingSection tone="mauve" className="overflow-hidden">
          <RotatingOrnament className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 opacity-25" />
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="relative max-w-3xl mx-auto text-center space-y-4">
            <motion.p variants={fadeUp} className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground">
              Un espacio diseñado para ayudarte a cultivar mayor claridad, regulación interna, autoconocimiento, conexión espiritual y coherencia con tu esencia.
            </motion.p>
            <motion.p variants={fadeUp} className="font-serif text-lg md:text-xl font-light italic text-foreground/80">
              Procesos adaptados a tu momento vital, tu historia y tu camino personal.
            </motion.p>
          </motion.div>
        </LandingSection>

        {/* Qué ofrezco */}
        <LandingSection tone="plain">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Qué ofrezco?" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Dos modalidades de acompañamiento, ambas adaptadas a tu proceso.</p>
            </div>
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid md:grid-cols-2 gap-5">
              {SERVICES.map(({ icon: Icon, title, desc, tags }) => (
                <motion.div key={title} variants={fadeUp} className="bg-card border border-border/40 rounded-3xl p-6 md:p-7 space-y-4">
                  <div className="flex items-start gap-4">
                    <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">{title}</h3>
                  </div>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-background border border-border/40 text-primary">{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </LandingSection>

        {/* Para quién */}
        <LandingSection tone="plain">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.img
              {...inView}
              variants={fadeUp}
              src={paraQuienImage}
              alt="Postura de yoga durante una sesión de acompañamiento"
              loading="lazy"
              className="w-full max-w-md mx-auto rounded-3xl aspect-square object-cover"
            />
            <div className="space-y-6">
              <RevealTitle text="¿Para quién es este espacio?" className={H2 + " text-center md:text-left"} />
              <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
                {FOR_WHOM.map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-start gap-4 py-4 border-b border-border/30">
                    <span aria-hidden="true" className="mt-1 w-px h-5 shrink-0 bg-[#B8977E]" />
                    <span className="text-base text-foreground/90 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </LandingSection>

        {/* Cómo funciona */}
        <LandingSection tone="mauve">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Cómo funciona?" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Un proceso simple, claro y completamente a tu medida.</p>
            </div>
            <motion.ol {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="relative grid md:grid-cols-3 gap-8">
              <span aria-hidden="true" className="hidden md:block absolute top-5 left-[16.6%] right-[16.6%] h-px bg-[#B8977E]/60" />
              {STEPS.map(({ title, desc }, i) => (
                <motion.li key={title} variants={fadeUp} className="relative text-center space-y-3">
                  <span className="relative z-10 mx-auto w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[#795D64] text-white">{i + 1}</span>
                  <p className="font-serif text-xl font-semibold text-foreground">{title}</p>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">{desc}</p>
                </motion.li>
              ))}
            </motion.ol>
            <ul className="flex flex-wrap justify-center gap-2 text-sm">
              {KEY_INFO.map(({ icon: Icon, label, value }) => (
                <li key={label} className={PILL}>
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </LandingSection>

        {/* Precios */}
        <LandingSection id="precios" tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="Tu inversión" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Elige el plan que mejor acompañe tu proceso</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-3">
              <PriceCardLight
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
        </LandingSection>

        <LandingSection tone="plain">
          <div className="max-w-3xl mx-auto">
            <FaqSection
              items={FAQS}
              titleSlot={<RevealTitle text="Preguntas frecuentes" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-6" />}
            />
          </div>
        </LandingSection>

        {/* Cierre */}
        <LandingSection id="individual-contacto" tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-2xl mx-auto text-center space-y-6">
            <RevealTitle text="Reserva tu sesión" className={H2} />
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed">
              Cuéntame qué necesitas y lo conversamos. El primer paso es simplemente llegar.
            </motion.p>
            <motion.div variants={fadeUp}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
              </a>
            </motion.div>
            <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
            <ul className="flex flex-wrap justify-center gap-2 text-sm">
              {["Proceso personalizado", "100% virtual", "Acompañamiento real"].map((b) => (
                <li key={b} className={PILL}><Leaf className="w-4 h-4 text-primary" /> {b}</li>
              ))}
            </ul>
            <div className="pt-4 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">¿Buscas un programa grupal?</p>
              <Link to="/curso-iniciacion-yoga" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary bg-card border border-border/40 px-5 py-3 rounded-full">
                <Moon className="w-4 h-4 text-primary" /> Curso de Iniciación al Yoga
              </Link>
            </div>
          </motion.div>
        </LandingSection>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="acompanamiento-individual" />
    </div>
  );
};

export default AcompanamientoIndividual;
