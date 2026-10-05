import { useState, useEffect } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, Book, Smile, Wind, MessageCircle, Home, BookOpen, FileText, Headphones, Flame, Users } from "lucide-react";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import AiChatWidget from "@/components/AiChatWidget";
import FloatingCTA from "@/components/FloatingCTA";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { getWhatsAppUrl } from "@/lib/utils";
import cursoHero from "@/assets/curso-hero.png.asset.json";
import {
  fadeUp, inView, RevealTitle, RevealWords, RotatingOrnament,
  LandingSection, SplitHero, PriceCard, PriceCardLight,
} from "@/components/landing";

// Foto del hero: cambiar solo esta línea para usar otra imagen.
const HERO_IMAGE = cursoHero.url;

const PILL = "h-10 flex items-center gap-2 whitespace-nowrap bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-3.5";
const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white";
const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground text-center";
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
  { title: "Principiantes en el camino", desc: "Si eres nuevo en el yoga y quieres comenzar desde los fundamentos con una guía progresiva y profunda." },
  { title: "Practicantes que desean profundizar", desc: "Si ya tienes experiencia y buscas comprender más a fondo la filosofía, la anatomía yóguica y las herramientas del Kundalini Yoga." },
  { title: "Personas en búsqueda de bienestar", desc: "Si atraviesas estrés, ansiedad, desconexión o una búsqueda de sentido y quieres herramientas reales de transformación." },
  { title: "Buscadores espirituales", desc: "Si sientes el llamado a explorar el desarrollo espiritual con disciplina, apertura y desde una tradición probada." },
];

const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Curso de Iniciación al Yoga",
  description: "Curso de iniciación al Kundalini Yoga: 6 módulos en un año con encuentros bimensuales, 100% virtual.",
  provider: { "@type": "Person", name: "Fransury Gonzáles" },
  offers: [
    { "@type": "Offer", name: "Pago por módulo", price: "220", priceCurrency: "USD" },
    { "@type": "Offer", name: "Anualidad", price: "990", priceCurrency: "USD" },
  ],
};

const GoldRow = ({ children }: { children: React.ReactNode }) => (
  <motion.li variants={fadeUp} className="flex items-start gap-4 py-4 border-b border-border/30">
    <span aria-hidden="true" className="mt-1 w-px h-5 shrink-0 bg-[#B8977E]" />
    <div className="text-base text-foreground/90 leading-relaxed">{children}</div>
  </motion.li>
);

const Benefits = ({ items, light }: { items: string[]; light?: boolean }) => (
  <ul className="space-y-3 text-left">
    {items.map((b) => (
      <li key={b} className="flex items-start gap-3">
        <span aria-hidden="true" className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${light ? "bg-[#B8977E]" : "bg-brand-cream"}`} />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const stagger = (s = 0.06) => ({ show: { transition: { staggerChildren: s } } });

const CursoIniciacionYoga = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((item) => item.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as unknown as VisualIdentity;
        }
      } catch { /* use local fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

  const goInscripcion = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#curso-inscripcion")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Curso de Iniciación al Yoga online | SantoSha"
        description="Curso de iniciación al Kundalini Yoga con Fransury Gonzáles: 6 módulos en un año con encuentros bimensuales, 100% virtual."
        path="/curso-iniciacion-yoga"
        jsonLd={COURSE_JSONLD}
      />
      <FloatingCTA scrollTo="#curso-inscripcion" ctaText="Inscribirme" subText="Curso de iniciación al yoga" />

      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <SplitHero image={HERO_IMAGE} alt="Espacio sereno de práctica de yoga con mat, cojín y velas">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
            Curso de iniciación · 6 módulos bimensuales
          </motion.span>
          <RevealTitle as="h1" text="Curso de Iniciación al Yoga" className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
            Habitar el yoga como una práctica del día a día
          </motion.p>
          <motion.ul variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            {["6 Módulos", "Encuentros Bimensuales", "Práctica Progresiva", "Material de Apoyo"].map((b) => (
              <li key={b} className={PILL}>
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#B8977E]" /> {b}
              </li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp} className="pt-1">
            <a href="#curso-inscripcion" onClick={goInscripcion} className={BTN_SOLID}>
              Quiero inscribirme
              <motion.span className="inline-flex" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </a>
          </motion.div>
        </SplitHero>

        {/* Introducción */}
        <LandingSection tone="plain">
          <div className="max-w-3xl mx-auto space-y-6">
            <RevealTitle text="Introducción del Curso" className={H2} />
            <div className="space-y-5 text-foreground/80 leading-relaxed text-lg font-light">
              <p>
                Vivimos en un tiempo de aceleración, exceso de estímulos, desconexión del cuerpo, ansiedad mental y búsqueda profunda de sentido. En medio de esta realidad, el <strong className="text-foreground font-semibold">Kundalini Yoga</strong> surge como una tecnología ancestral para recordar algo esencial: la capacidad humana de vivir con mayor conciencia, vitalidad, claridad y conexión espiritual.
              </p>
              <p>
                En este curso te propongo un recorrido progresivo por las bases filosóficas, prácticas y experienciales del Kundalini Yoga. El curso te invita a:
              </p>
            </div>
            <motion.ul {...inView} variants={stagger()}>
              {INVITES.map((i) => <GoldRow key={i}>{i}</GoldRow>)}
            </motion.ul>
            <div className="pt-4 space-y-4">
              <h3 className="font-serif text-2xl font-semibold text-foreground text-center">Cada encuentro incluirá:</h3>
              <motion.ul {...inView} variants={stagger()} className="grid sm:grid-cols-2 gap-x-8">
                {ENCOUNTER.map(({ icon: Icon, text }) => (
                  <motion.li key={text} variants={fadeUp} className="flex items-center gap-3 py-3 border-b border-border/30 text-base text-foreground/90">
                    <Icon className="w-5 h-5 text-primary shrink-0" /> {text}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </LandingSection>

        <LandingSection tone="mauve" className="overflow-hidden">
          <RotatingOrnament className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 opacity-25" />
          <RevealWords stagger={0.04} className="relative max-w-3xl mx-auto text-center font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground"
            text={'"Este curso está dirigido tanto a personas nuevas en el camino del yoga como a practicantes que desean profundizar su comprensión y experiencia del Kundalini Yoga."'} />
        </LandingSection>

        <LandingSection tone="peach">
          <motion.div {...inView} variants={stagger(0.15)} className="max-w-2xl mx-auto text-center space-y-1 font-serif text-xl md:text-2xl text-foreground">
            <motion.p variants={fadeUp} className="italic font-light">Porque el yoga no ocurre únicamente en el mat.</motion.p>
            <motion.p variants={fadeUp} className="italic font-light">Ocurre en cómo respiras. En cómo eliges.</motion.p>
            <motion.p variants={fadeUp} className="italic font-light">En cómo sostienes tu energía.</motion.p>
            <motion.p variants={fadeUp} className="font-semibold pt-1">En cómo habitas tu humanidad y tu espiritualidad.</motion.p>
          </motion.div>
        </LandingSection>

        {/* Módulos */}
        <LandingSection tone="plain">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="Los 6 Módulos del Curso" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Un recorrido progresivo a lo largo de un año, con encuentros bimensuales.</p>
            </div>
            <motion.ol {...inView} variants={stagger(0.08)}>
              {MODULES.map((m, i) => (
                <motion.li key={m.num} variants={fadeUp} className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr] gap-3 md:gap-5">
                  <span className="font-serif text-3xl md:text-4xl text-[#B8977E] leading-none pt-1">{m.num}</span>
                  <div className={`relative border-l border-border/60 pl-5 ${i === MODULES.length - 1 ? "pb-0" : "pb-8"}`}>
                    <span aria-hidden="true" className="absolute -left-[4px] top-2.5 w-2 h-2 rounded-full bg-[#B8977E]" />
                    <h3 className="font-semibold text-lg text-foreground leading-snug">{m.title}</h3>
                    <p className="text-base text-muted-foreground font-light mt-1 leading-relaxed">{m.theme}</p>
                    <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full border border-border/50 text-muted-foreground">Bimensual</span>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </LandingSection>

        {/* Recursos entre módulos */}
        <LandingSection tone="mauve">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <RevealTitle text="Recursos Entre Módulos" className={H2} />
              <p className="text-muted-foreground font-light text-lg">
                Porque el verdadero aprendizaje del Kundalini Yoga no ocurre cada dos meses. Ocurre en la repetición, la observación y la experiencia cotidiana.
              </p>
            </div>
            <motion.ul {...inView} variants={stagger()} className="grid sm:grid-cols-2 gap-x-8">
              {BETWEEN_MODULES.map(({ icon: Icon, label }) => (
                <motion.li key={label} variants={fadeUp} className="flex items-center gap-3 py-3 border-b border-border/30 text-base text-foreground/90">
                  <Icon className="w-5 h-5 text-primary shrink-0" /> {label}
                </motion.li>
              ))}
            </motion.ul>
            <blockquote className="text-center pt-6">
              <p className="font-serif text-xl md:text-2xl italic font-light text-foreground leading-relaxed">
                "La disciplina primero negocia contigo… luego empieza a revelarte cosas."
              </p>
              <p className="text-sm mt-3 text-muted-foreground">
                — Como diría cualquier practicante después del día 17 de una práctica de 40 días
              </p>
            </blockquote>
          </div>
        </LandingSection>

        {/* Para quién */}
        <LandingSection tone="plain">
          <div className="max-w-4xl mx-auto space-y-6">
            <RevealTitle text="¿Para quién es este curso?" className={H2} />
            <motion.ul {...inView} variants={stagger()} className="grid md:grid-cols-2 gap-x-10">
              {FOR_WHOM.map(({ title, desc }) => (
                <GoldRow key={title}>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-muted-foreground font-light mt-1">{desc}</p>
                </GoldRow>
              ))}
            </motion.ul>
          </div>
        </LandingSection>

        {/* Inversión */}
        <LandingSection tone="peach">
          <motion.div {...inView} variants={stagger(0.1)} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="Tu inversión" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Elige la modalidad que mejor se adapte a tu proceso.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-3">
              <PriceCardLight
                title="Pago por Módulo"
                price="220"
                href={BOLD_MODULO}
                description={<>
                  <p>Pago bimensual por cada módulo</p>
                  <Benefits light items={["Acceso completo al módulo en curso", "Material teórico y de apoyo", "Audio de meditación o pranayama", "Prácticas sugeridas entre encuentros"]} />
                </>}
                cta="Inscribirme por Módulo"
              />
              <PriceCard
                badge="25% de descuento"
                title="Anualidad"
                price="990"
                href={BOLD_ANUAL}
                description={<>
                  <p>Ahorra y comprométete con tu formación completa</p>
                  <Benefits items={["Acceso asegurado a los 6 módulos", "Material teórico y de apoyo completo", "Prácticas de 21 o 40 días ininterrumpidas", "Proceso integrado a lo largo del año"]} />
                </>}
                cta="Inscribirme al Año Completo"
              />
            </div>
          </motion.div>
        </LandingSection>

        {/* Cierre */}
        <LandingSection id="curso-inscripcion" tone="plain">
          <motion.div {...inView} variants={stagger(0.1)} className="max-w-2xl mx-auto text-center space-y-6">
            <RevealTitle text="¿Quieres inscribirte? Escríbeme." className={H2} />
            <motion.div variants={fadeUp}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
              </a>
            </motion.div>
            <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
          </motion.div>
        </LandingSection>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="curso-iniciacion-yoga" />
    </div>
  );
};

export default CursoIniciacionYoga;
