import { Fragment, useEffect, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, ArrowRight, Leaf, Info, MessageCircle, Gift, PlayCircle, User, Users } from "lucide-react";
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
import { getWhatsAppUrl } from "@/lib/utils";
import Header from "@/components/Header";
import fransuryImage from "@/assets/fransury-retrato.webp";
import heroBackground from "@/assets/hero-sunrise.png.asset.json";
import { fadeUp, inView, RevealTitle, LandingSection, SplitHero } from "@/components/landing";

// Foto del hero: cambiar solo esta línea para usar otra imagen.
const HERO_IMAGE = heroBackground.url;

const BTN_SOLID = "inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold shadow-md justify-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white";
const BTN_OUTLINE = "inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold justify-center bg-card border border-[#795D64]/40 text-foreground hover:bg-muted/40 transition-all duration-300";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
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
    icon: Leaf,
    title: "Salir del modo supervivencia",
    text: "Gran parte del sufrimiento emerge cuando vivimos reaccionando, controlando y desconectados del cuerpo. Santosha propone restaurar el sistema nervioso para volver a habitar el presente.",
    bg: "bg-brand-cream",
  },
  {
    icon: Info,
    title: "¿Qué es Santosha?",
    text: "Santosha es un Niyama sánscrito que habla de contentamiento. Para mí, va más allá de conformarse: es cultivar una presencia profunda, calma consciente y equilibrio tanto en la expansión como en la incertidumbre.",
    bg: "bg-warm-mauve/40",
  },
];

const START_OPTIONS = [
  { text: "Quiero comprender por qué me pasa lo que me pasa", to: "/mi-proceso-individual" },
  { text: "Mi relación atraviesa un conflicto", to: "/proceso-de-pareja" },
  { text: "Quiero calmar mi cuerpo y mi mente", to: "/acompanamiento-individual" },
  { text: "Quiero aprender yoga desde cero", to: "/curso-iniciacion-yoga" },
  { text: "Quiero comprender mi ciclo", to: "/sabiduria-ciclica-esencia-femenina" },
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
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>
      <Seo
        title="SantoSha | Psicoterapia, yoga y meditación online"
        description="Psicoterapia individual y de pareja, Kundalini Yoga y meditación con Fransury Gonzáles. Atención virtual desde cualquier lugar."
        path="/"
      />

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

        {/* ¿Por dónde empiezo? */}
        <LandingSection tone="plain">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Por dónde empiezo?" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Elige lo que más se parece a tu momento.</p>
            </div>
            <div className="-mx-6 px-6 md:mx-0 md:px-0 flex md:grid md:grid-cols-6 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-3 md:pb-0">
              {START_OPTIONS.map(({ text, to }, i) => (
                <Link key={to} to={to}
                  className={`group snap-start shrink-0 w-[78%] sm:w-[46%] md:w-auto ${i < 3 ? "md:col-span-2" : "md:col-span-3"} flex flex-col justify-between gap-6 p-6 rounded-3xl bg-card border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${FOCUS}`}>
                  <span className="font-serif text-5xl font-semibold text-brand-gold leading-none" aria-hidden="true">{i + 1}</span>
                  <span className="font-serif text-xl text-foreground leading-snug">{text}</span>
                  <ArrowRight className="w-5 h-5 text-[#795D64] transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </LandingSection>

        {/* Banner clase gratuita */}
        <section className="bg-brand-ink text-brand-cream px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <p className="space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-brand-cream/15 align-middle">Entrada Gratuita</span>
              <strong className="font-serif text-xl md:text-2xl font-semibold align-middle">¿Sufres de ansiedad o agotamiento mental?</strong>
              <span className="block md:inline text-brand-cream/90 font-light mt-1 md:mt-0">Una clase online de 30 minutos donde aprendes una técnica somática para ayudar a calmar tu sistema nervioso.</span>
            </p>
            <button type="button" onClick={() => setFreeClassOpen(true)}
              className={`shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold bg-brand-cream text-brand-ink hover:bg-card transition-colors ${FOCUS}`}>
              <PlayCircle className="w-5 h-5" /> Comenzar Clase Maestra
            </button>
          </div>
        </section>

        {/* Programas */}
        <LandingSection id="programas" tone="plain">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Formación & Acompañamiento</span>
              <RevealTitle text="Mis programas y espacios" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Recorridos para comprender lo que vives y recuperar tu equilibrio.</p>
            </div>
            <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="border-t border-border/50">
              {PROGRAMS.map(({ title, subtitle, desc, features, href }, i) => (
                <motion.li key={title} variants={fadeUp} className="border-b border-border/50">
                  <Link to={href} className={`group relative grid md:grid-cols-[110px_1fr_auto] gap-4 md:gap-8 items-start md:items-center py-8 md:py-10 ${FOCUS}`}>
                    <span aria-hidden="true" className="font-serif text-5xl md:text-6xl font-semibold text-brand-gold leading-none transition-transform duration-300 group-hover:translate-x-2">0{i + 1}</span>
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">{title}</h3>
                      <p className="text-sm italic text-[#795D64]">{subtitle}</p>
                      <p className="text-base text-muted-foreground font-light leading-relaxed max-w-2xl">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {features.map((f) => (
                          <span key={f} className="text-xs font-medium px-3 py-1 rounded-full bg-card border border-border/50 text-[#795D64]">{f}</span>
                        ))}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#795D64] whitespace-nowrap">
                      Ver detalles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="absolute left-0 bottom-0 h-0.5 w-full origin-left scale-x-0 bg-brand-gold transition-transform duration-500 group-hover:scale-x-100" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </LandingSection>

        {/* Quién te acompaña */}
        <LandingSection tone="plain" className="bg-card">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[2fr_3fr] gap-10 items-center">
            <motion.img {...inView} variants={fadeUp} src={fransuryImage} alt="Fransury Gonzáles" loading="lazy"
              className="w-full max-w-sm mx-auto rounded-3xl object-cover object-top aspect-[3/4]" />
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-5 text-center md:text-left">
              <motion.span variants={fadeUp} className="block text-xs font-semibold tracking-wider uppercase text-[#795D64]">Acompañamiento Humano</motion.span>
              <RevealTitle text="Quién te acompaña" className={H2} />
              <motion.p variants={fadeUp} className="text-foreground/80 leading-relaxed font-light text-lg">
                Hola, soy <strong className="text-foreground font-medium">Fransury Gonzáles (Sury)</strong>. Soy psicóloga, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante de la psique y el alma humana.
              </motion.p>
              <motion.p variants={fadeUp} className="text-foreground/80 leading-relaxed font-light text-lg">
                Mi propósito es acompañarte a sanar experiencias difíciles, a transformar el significado de lo que viviste y a habitar una vida en mayor plenitud. Lo haremos integrando el yoga, como medicina ancestral, con la comprensión de algunos factores psicológicos, para que aprendas a regular tu sistema nervioso.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link to="/quien-soy" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-[#795D64]/50 text-[#795D64] hover:bg-brand-cream transition-colors ${FOCUS}`}>
                  Conoce mi historia <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </LandingSection>

        {/* Filosofía */}
        <LandingSection tone="plain">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Manifiesto Santosha</span>
              <RevealTitle text="Mi filosofía de trabajo" className={H2} />
            </div>
            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
              {PHILOSOPHY_PILLARS.map(({ icon: Icon, title, text, bg }, i) => (
                <Fragment key={title}>
                  {i === 1 && (
                    <div className="flex items-center justify-center" aria-hidden="true">
                      <ArrowRight className="w-8 h-8 text-brand-gold rotate-90 md:rotate-0" />
                    </div>
                  )}
                  <motion.div variants={fadeUp} className={`space-y-3 p-8 md:p-10 rounded-3xl ${bg}`}>
                    <Icon className="w-6 h-6 text-[#795D64]" />
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">{title}</h3>
                    <p className="text-base text-foreground/80 font-light leading-relaxed">{text}</p>
                  </motion.div>
                </Fragment>
              ))}
            </motion.div>
            <div className="text-center">
              <Link to="/filosofia" className={`inline-flex items-center gap-2 text-sm font-semibold hover:underline text-[#795D64] rounded ${FOCUS}`}>
                Leer el manifiesto completo de Santosha →
              </Link>
            </div>
          </div>
        </LandingSection>

        {/* CTA final */}
        <LandingSection tone="plain">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-3xl mx-auto text-center space-y-6">
            <RevealTitle text="¿Quieres empezar? Escríbeme." className={H2} />
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              <a href={getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.")} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp
              </a>
              <button type="button" onClick={() => setFreeClassOpen(true)} className={BTN_OUTLINE}>
                <Gift className="w-5 h-5 text-[#795D64]" /> Acceder a la Clase Gratis
              </button>
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
