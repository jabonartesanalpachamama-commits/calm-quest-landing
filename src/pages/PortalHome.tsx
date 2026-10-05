import { useEffect, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, Leaf, Info, MessageCircle, Gift, PlayCircle, User, Users } from "lucide-react";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import FreeClassDialog from "@/components/FreeClassDialog";
import FloatingCTA from "@/components/FloatingCTA";
import Header from "@/components/Header";
import fransuryImage from "@/assets/fransury-retrato.webp";
import heroBackground from "@/assets/hero-sunrise.png.asset.json";
import { fadeUp, inView, RevealTitle, LandingSection, SplitHero } from "@/components/landing";

// Foto del hero: cambiar solo esta línea para usar otra imagen.
const HERO_IMAGE = heroBackground.url;

const BTN_SOLID = "inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold shadow-md justify-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white";
const BTN_OUTLINE = "inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold justify-center bg-card border border-[#795D64]/40 text-foreground hover:bg-muted/40 transition-all duration-300";
const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground";

const PROGRAMS = [
  {
    icon: User,
    title: "Mi Proceso Individual",
    subtitle: "Psicoterapia Individual",
    desc: "Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.",
    features: ["1 o 3 Sesiones", "Espacio Terapéutico", "100% Virtual"],
    href: "/mi-proceso-individual",
  },
  {
    icon: Users,
    title: "Proceso de Pareja",
    subtitle: "Psicoterapia de Pareja",
    desc: "Un espacio donde ambos puedan observar lo que está ocurriendo, mejorar la comunicación y asumir responsabilidad sobre aquello que sí pueden transformar.",
    features: ["Mejorar la comunicación", "Gestión de conflictos", "100% Virtual"],
    href: "/proceso-de-pareja",
  },
  {
    icon: Leaf,
    title: "Cultivar Mi Bienestar",
    subtitle: "Kundalini Yoga",
    desc: "Espacios diseñados para habitar el cuerpo, encontrar equilibrio y conectar con tu verdadera esencia a través de la práctica constante.",
    features: ["Curso de Iniciación", "Sabiduría Cíclica", "Acompañamiento 1:1"],
    href: "/cultivar-bienestar",
  },
];

const PHILOSOPHY_PILLARS = [
  {
    icon: Info,
    title: "¿Qué es Santosha?",
    text: "Santosha es un Niyama sánscrito que habla de contentamiento. Para mí, va más allá de conformarse: es cultivar una presencia profunda, calma consciente y equilibrio tanto en la expansión como en la incertidumbre.",
  },
  {
    icon: Leaf,
    title: "Salir del Modo Supervivencia",
    text: "Gran parte del sufrimiento emerge cuando vivimos reaccionando, controlando y desconectados del cuerpo. Santosha propone restaurar el sistema nervioso para volver a habitar el presente.",
  },
];

const PortalHome = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());
  const [freeClassOpen, setFreeClassOpen] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((i) => i.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as unknown as VisualIdentity;
        }
      } catch { /* fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

  const goProgramas = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#programas")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="SantoSha | Psicoterapia, yoga y meditación online"
        description="Psicoterapia individual y de pareja, Kundalini Yoga y meditación con Fransury Gonzáles. Atención virtual desde cualquier lugar."
        path="/"
      />
      <FloatingCTA scrollTo="#programas" ctaText="Ver programas" subText="Psicoterapia, yoga y meditación" />

      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <SplitHero image={HERO_IMAGE} imageClassName="object-[70%_20%]" maskClassName="hero-bleed-narrow" alt="Mujer meditando al amanecer sobre las montañas">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary shadow-sm">
            <Leaf className="w-3.5 h-3.5" /> Conciencia · Calma · Transformación humana
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground">
            Del modo supervivencia a la <span className="text-primary">calma consciente</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
            Kundalini Yoga, regulación del sistema nervioso y sabiduría somática para recordar tu esencia y habitar tu vida.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3 pt-1 [&>*]:w-full sm:[&>*]:w-auto [&>*]:whitespace-nowrap md:[&>*]:text-[15px] md:[&>*]:px-5">
            <a href="#programas" onClick={goProgramas} className={BTN_SOLID}>
              Ver programas formativos
              <motion.span className="inline-flex" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </a>
            <button type="button" onClick={() => setFreeClassOpen(true)} className={BTN_OUTLINE}>
              <Gift className="w-5 h-5 text-primary" /> Acceder a Clase Gratuita
            </button>
          </motion.div>
        </SplitHero>

        {/* Banner clase gratuita */}
        <LandingSection tone="mauve" className="!py-10 md:!py-12">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-card/80 text-primary">
                Entrada Gratuita
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                ¿Sufres de ansiedad o agotamiento mental?
              </h2>
              <p className="text-base font-light text-muted-foreground max-w-xl">
                Una clase online de 30 minutos donde aprendes una técnica somática para ayudar a calmar tu sistema nervioso.
              </p>
            </div>
            <button type="button" onClick={() => setFreeClassOpen(true)} className={BTN_SOLID + " shrink-0"}>
              <PlayCircle className="w-5 h-5" /> Comenzar Clase Maestra
            </button>
          </div>
        </LandingSection>

        {/* Programas */}
        <LandingSection id="programas" tone="plain">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground/70">Formación & Acompañamiento</span>
              <RevealTitle text="Mis programas y espacios" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Recorridos para comprender lo que vives y recuperar tu equilibrio.</p>
            </div>
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid md:grid-cols-3 gap-5">
              {PROGRAMS.map(({ icon: Icon, title, subtitle, desc, features, href }) => (
                <motion.div key={title} variants={fadeUp} className="bg-card border border-border/40 rounded-3xl p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">{title}</h3>
                      <p className="text-sm italic text-primary">{subtitle}</p>
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground font-light leading-relaxed flex-grow">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f) => (
                      <span key={f} className="text-xs font-medium px-3 py-1 rounded-full bg-background border border-border/40 text-primary">{f}</span>
                    ))}
                  </div>
                  <Link to={href} className="mt-1 w-full py-3 rounded-full text-sm font-semibold text-center bg-[#795D64] hover:bg-[#6A5057] text-white transition-colors">
                    Ver detalles
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </LandingSection>

        {/* Quién te acompaña */}
        <LandingSection tone="mauve">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <motion.img {...inView} variants={fadeUp} src={fransuryImage} alt="Fransury Gonzáles" loading="lazy"
              className="w-full max-w-sm mx-auto rounded-3xl object-cover object-top aspect-[4/5]" />
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-5 text-center md:text-left">
              <motion.span variants={fadeUp} className="block text-xs font-semibold tracking-wider uppercase text-primary">Acompañamiento Humano</motion.span>
              <RevealTitle text="Quién te acompaña" className={H2} />
              <motion.p variants={fadeUp} className="text-foreground/80 leading-relaxed font-light text-lg">
                Hola, soy <strong className="text-foreground font-medium">Fransury Gonzáles (Sury)</strong>. Soy psicóloga, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante de la psique y el alma humana.
              </motion.p>
              <motion.p variants={fadeUp} className="text-foreground/80 leading-relaxed font-light text-lg">
                Mi propósito es acompañarte a sanar experiencias difíciles, a transformar el significado de lo que viviste y a habitar una vida en mayor plenitud. Lo haremos integrando el yoga, como medicina ancestral, con la comprensión de algunos factores psicológicos, para que aprendas a regular tu sistema nervioso.
              </motion.p>
            </motion.div>
          </div>
        </LandingSection>

        {/* Filosofía */}
        <LandingSection tone="plain">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground/70">Manifiesto Santosha</span>
              <RevealTitle text="Mi filosofía de trabajo" className={H2} />
            </div>
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="grid md:grid-cols-2">
              {PHILOSOPHY_PILLARS.map(({ icon: Icon, title, text }, i) => (
                <motion.div key={title} variants={fadeUp}
                  className={`space-y-3 py-6 md:py-0 md:px-8 ${i === 1 ? "border-t md:border-t-0 md:border-l border-[#B8977E]/50" : ""}`}>
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-xl font-semibold text-foreground">{title}</h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center">
              <Link to="/filosofia" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline text-primary">
                Leer el manifiesto completo de Santosha →
              </Link>
            </div>
          </div>
        </LandingSection>

        {/* CTA final */}
        <LandingSection tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-3xl mx-auto text-center space-y-6">
            <RevealTitle text="¿Quieres empezar? Escríbeme." className={H2} />
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setFreeClassOpen(true)} className={BTN_SOLID}>
                <Gift className="w-5 h-5" /> Acceder a la Clase Gratis
              </button>
              <a href="https://wa.me/573105679517" target="_blank" rel="noopener noreferrer" className={BTN_OUTLINE}>
                <MessageCircle className="w-5 h-5 text-primary" /> Escribir por WhatsApp
              </a>
            </motion.div>
            <p className="text-xs text-muted-foreground">Atención virtual desde cualquier lugar del mundo.</p>
          </motion.div>
        </LandingSection>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="home" />
      <FreeClassDialog open={freeClassOpen} onOpenChange={setFreeClassOpen} />
    </div>
  );
};

export default PortalHome;
