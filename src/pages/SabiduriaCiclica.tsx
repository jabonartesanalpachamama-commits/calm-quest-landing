import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Leaf, Sparkles, Sun, MessageCircle, Moon, ShieldCheck, Settings } from "lucide-react";
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
import TestimonialsSection, { Testimonial } from "@/components/TestimonialsSection";
import santoshaLogo from "@/assets/santosha-logo.webp";

const LEARNING_POINTS = [
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Comprender tu naturaleza cíclica y las cuatro fases que habitan tu experiencia femenina.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Reconocer tus propios patrones emocionales, energéticos y corporales, entendiendo cómo se expresa tu ciclo en tu vida cotidiana.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Desarrollar herramientas prácticas de observación y autoconocimiento, para interpretar las señales de tu cuerpo con mayor claridad y compasión.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Transformar tu relación con tu ciclo y tu menstruación, dejando atrás la desconexión, la culpa o la lucha constante.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Habitar tu ciclo como una fuente de poder, creatividad, intuición y sabiduría femenina.",
  },
];

const CICLICA_TESTIMONIALS: Testimonial[] = [
  {
    name: "Lucía F.",
    role: "Creativa",
    age: 31,
    initials: "LF",
    quote: "Entender mi ciclicidad ha sido un antes y un después. Dejé de pelear con mis bajones de energía y empecé a usarlos a mi favor. Este espacio es medicina pura.",
    timeframe: "Participante"
  },
  {
    name: "Mariana R.",
    role: "Terapeuta",
    age: 38,
    initials: "MR",
    quote: "Las prácticas me ayudaron a reconectar con mi cuerpo femenino desde un lugar de profunda aceptación. El círculo de mujeres que se forma es invaluable y sostenedor.",
    timeframe: "Participante"
  },
  {
    name: "Ana P.",
    role: "Contadora",
    age: 27,
    initials: "AP",
    quote: "Crecí desconectada de mis propios ritmos. Este programa me enseñó a honrar mis fases y a entender que la productividad lineal no es el único camino.",
    timeframe: "Participante"
  },
  {
    name: "Camila N.",
    role: "Artista",
    age: 35,
    initials: "CN",
    quote: "Una experiencia transformadora. La combinación de saberes ancestrales con herramientas prácticas me devolvió el poder sobre mi propia energía vital.",
    timeframe: "Participante"
  }
];

const SabiduriaCiclica = () => {
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

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>

      <FloatingCTA
        formAnchor="#ciclica-contacto"
        ctaText="Quiero unirme al viaje"
        subText={<><Flower2 className="w-3.5 h-3.5 inline-block mr-1 text-primary" /> Sabiduría Cíclica · 100% Virtual</>}
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO BANNER ── */}
        <section className={`pt-12 md:pt-20 px-4 md:px-6 relative overflow-hidden ${palette.background}`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-[1672px] mx-auto relative z-10">
            <h1 className="sr-only">Sabiduría Cíclica, Esencia Femenina</h1>
            <motion.div 
              className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/20"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/sabiduria-ciclica-banner.webp" 
                alt="Sabiduría Cíclica, esencia femenina - Un viaje de autoconocimiento" 
                className="w-full h-auto block"
              />
            </motion.div>
          </div>
        </section>

        {/* ── HERO CTA ── */}
        <section className={`py-10 md:py-14 px-6 text-center relative z-10 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <span className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              <Flower2 className="w-4 h-4 text-primary" /> Programa Grupal · Virtual
            </span>

            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
              Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.
            </p>
            
            <div className="pt-2">
              <a
                href="#ciclica-contacto"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#ciclica-contacto")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
              >
                Reservar información <Leaf className="w-4 h-4 text-primary-foreground ml-1" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── INTRODUCCIÓN DILUIDA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-10"
          >
            <div className="bg-card border border-border/40 rounded-3xl p-8 md:p-10 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl md:text-2xl text-center font-light italic leading-relaxed text-foreground/95">
                "¿Y si aquello que has interpretado como confusión, cansancio, sensibilidad intensa, desconexión o contradicción… fuera en realidad un lenguaje profundo de tu cuerpo intentando hablarte?"
              </h3>
              <div className="h-px bg-border/40 w-24 mx-auto" />
              <p className="text-muted-foreground leading-relaxed text-base font-light text-center">
                Vivimos en una cultura que nos enseñó a funcionar de forma lineal, constante y productiva, desconectándonos de una verdad esencial: <strong className="text-foreground font-medium">la mujer es cíclica por naturaleza.</strong>
              </p>
            </div>

            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                <strong className="text-foreground font-medium">Sabiduría Cíclica, Esencia Femenina</strong> es un viaje de autoconocimiento, conciencia corporal y reconexión profunda con tu ritmo interno.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                Un espacio donde aprenderás a comprender tu ciclo femenino no como una carga, un problema o un inconveniente que debes controlar, sino como una brújula de sabiduría, energía, intuición y transformación.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── PERSPECTIVA DE SURY ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Flower2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                El Origen del Curso
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-base text-center max-w-2xl mx-auto">
              <p>
                Desde mi experiencia clínica, terapéutica y vivencial, he acompañado a muchas mujeres que viven alejadas de su cuerpo, peleadas con su menstruación, con sus cambios hormonales o peor aún en desconocimiento de estos, confundidas por sus cambios emocionales o desconectadas de su intuición natural.
              </p>
              <p className={`font-serif text-lg font-medium ${palette.primaryText} italic`}>
                Este curso nace para abrir un camino distinto: uno donde puedas comprenderte, escucharte y volver a ti.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── QUÉ APRENDERÁS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Columna Izquierda: Imagen del Programa */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-2xl relative border border-border/10 flex">
                   <img src="/sabiduria-ciclica-flyer.webp" alt="Programa Sabiduría Cíclica" className="w-full h-auto object-contain" />
                </div>
              </motion.div>

              {/* Columna Derecha: Bloques Nuevos */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="space-y-10"
              >
                <div className="space-y-3">
                  <Sparkles className="w-10 h-10 text-primary mb-2" />
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                    En este viaje aprenderás a:
                  </h2>
                </div>

                <div className="space-y-4">
                  {LEARNING_POINTS.map(({ icon, text }, idx) => (
                    <motion.div
                      key={text}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: idx * 0.08 } } }}
                      className="flex items-start gap-4 bg-background/50 backdrop-blur-sm border border-border/40 rounded-2xl px-6 py-6 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className={`shrink-0 leading-none mt-0.5 group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
                      <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── MENSAJE MAGNÉTICO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Sun className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-2xl md:text-3xl font-light italic text-foreground">
                "Tu ciclo no está en tu contra.<br />
                Tu cuerpo no es un problema que debas corregir."
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base font-light max-w-2xl mx-auto">
              <strong className="text-foreground font-medium">Sabiduría Cíclica, Esencia Femenina</strong> es una experiencia de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación y convertir su ciclo en una herramienta de autoconocimiento, poder interior e intuición.
            </p>

            <div className={`rounded-3xl p-6 inline-block ${palette.secondary}`}>
              <p className={`font-serif text-base md:text-lg font-semibold tracking-wide ${palette.secondaryText}`}>
                Vuelve a tu ritmo. Vuelve a tu cuerpo. Vuelve a tu esencia.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── NOTA DE CIERRE ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Columna Izquierda: Texto */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                className="space-y-8 bg-background/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-border/40 shadow-sm"
              >
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light">
                  Este no es solo un curso sobre menstruación. Es una invitación a recordar una parte de ti que quizás ha permanecido silenciada por años.
                </p>
                <div className="space-y-3 font-serif text-2xl md:text-3xl font-medium text-foreground">
                  <p>Tu cuerpo tiene memoria.</p>
                  <p>Tu ciclo tiene mensajes.</p>
                  <p>Tu esencia conoce el camino.</p>
                </div>
                <div className="pt-4 border-t border-border/20">
                  <p className={`font-serif text-2xl md:text-3xl font-bold ${palette.primaryText}`}>
                    ¿Estás lista para volver a escucharte?
                  </p>
                </div>
              </motion.div>

              {/* Columna Derecha: Imagen */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-2xl relative border border-border/10 flex">
                   <img src="/sabiduria-cierre.webp" alt="Sabiduría Cíclica" className="w-full h-auto object-contain" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <TestimonialsSection 
          testimonials={CICLICA_TESTIMONIALS} 
          title={<>Historias de <span className="text-primary">Sabiduría Femenina</span></>}
          subtitle="Mujeres que han abrazado su ciclicidad y reconectado con su ritmo natural."
        />

        {/* ── CTA FINAL / CONTACTO ── */}
        <section id="ciclica-contacto" className={`py-24 md:py-32 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Flower2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Inicia tu Viaje
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-lg max-w-xl mx-auto">
                Escríbenos para enviarte la información completa sobre fechas, horarios y cómo asegurar tu cupo.
              </p>
            </div>

            <a
              href="https://wa.link/1yymd8"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              <MessageCircle className="w-5 h-5" /> Consultar Info por WhatsApp
            </a>

            <p className="text-xs text-muted-foreground">
              Sin compromiso · Te respondemos personalmente con toda la información
            </p>

            <div className="flex flex-wrap justify-center gap-5 pt-2">
              {["Femenino & Cíclico", "100% Virtual", "Comunidad de apoyo", "Acompañamiento por Sury"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>

            {/* Otros programas */}
            <div className="pt-6 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Explorar otros espacios
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/curso-iniciacion-yoga"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-3 rounded-full hover:border-primary/30"
                >
                  <Moon className="w-4 h-4" /> Curso de Iniciación al Yoga
                </Link>
                <Link
                  to="/santosha-somatico"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-3 rounded-full hover:border-primary/30"
                >
                  <ShieldCheck className="w-4 h-4" /> Santosha Somático®
                </Link>
                <Link
                  to="/acompanamiento-individual"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-3 rounded-full hover:border-primary/30"
                >
                  <Leaf className="w-4 h-4" /> Acompañamiento 1:1
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-serif font-semibold text-foreground">
            {settings?.brandName || "SantoSha"}
          </p>
          <p className="font-light">
            {settings?.footerText || "Bienestar · Conciencia · Transformación"}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link to="/" className="hover:underline text-xs text-muted-foreground/70 transition-colors">← Inicio</Link>
            <Link to="/quien-soy" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Quién Soy</Link>
            <Link to="/filosofia" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Filosofía</Link>
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Curso de Iniciación</Link>
            <Link to="/santosha-somatico" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Santosha Somático®</Link>
            <Link to="/acompanamiento-individual" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Acompañamiento 1:1</Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors flex items-center gap-1"><Settings className="w-3 h-3" /> Admin</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="sabiduria-ciclica" />
    </div>
  );
};

export default SabiduriaCiclica;
