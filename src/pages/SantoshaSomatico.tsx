import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Waves, Feather, Puzzle, Wind, Search, Smile, Leaf, Book, Brain, Heart, Home, MessageCircle, Scale, Users, Sparkles, Info, Calendar, MonitorPlay } from "lucide-react";
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
import santoshaLogo from "@/assets/santosha-logo.jpg";

// ─── Module data ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    num: "01",
    title: "Seguridad Interna",
    subtitle: "Pasar del estado de supervivencia a la capacidad de habitar de manera conciente el cuerpo",
    theme: "Construir recursos internos antes de profundizar. Comprender el trauma desde una mirada integrativa y empezar a cultivar regulación, orientación y seguridad corporal.",
    goal: '"Mi cuerpo puede empezar a sentirse un lugar un poco más seguro."',
    icon: <ShieldCheck className="w-8 h-8 text-amber-700" />,
    color: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    accentColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    num: "02",
    title: "Reconexión e Integración",
    subtitle: "Escuchar el cuerpo, comprender patrones y recuperar presencia.",
    theme: "Comprender cómo el trauma impacta identidad, vínculos, emociones y energía vital. Aprender a relacionarse con la experiencia interna desde mayor conciencia y compasión.",
    goal: '"Puedo relacionarme con mi historia sin quedar completamente definido(a) por ella."',
    icon: <Waves className="w-8 h-8 text-violet-700" />,
    color: "from-violet-50 to-purple-50",
    borderColor: "border-violet-200",
    accentColor: "text-violet-700",
    badgeColor: "bg-violet-100 text-violet-800",
  },
  {
    num: "03",
    title: "Reclamar la Vida",
    subtitle: "En conexión con la coherencia, el propósito y la espiritualidad.",
    theme: "Dejar de moverse o actuar desde la simple supervivencia y encontrar la conexión con la autenticidad.",
    goal: '"No se trata solo de sobrevivir. Puedo construir una relación diferente conmigo y con la vida."',
    icon: <Feather className="w-8 h-8 text-teal-700" />,
    color: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    accentColor: "text-blue-700",
    badgeColor: "bg-blue-100 text-blue-800",
  },
];

const SOMATICO_TESTIMONIALS: Testimonial[] = [
  {
    name: "Valeria C.",
    role: "Arquitecta",
    age: 39,
    initials: "VC",
    quote: "Llevaba años acumulando tensión en el cuello y hombros. El enfoque somático me enseñó a soltar patrones que ni siquiera sabía que tenía. Mi cuerpo se siente liviano otra vez.",
    timeframe: "Participante"
  },
  {
    name: "Andrés M.",
    role: "Docente",
    age: 45,
    initials: "AM",
    quote: "Fue una revelación entender cómo mis emociones se alojaban en mi postura. Las clases son un espacio seguro para reconectar y escuchar a mi propio cuerpo sin juicios.",
    timeframe: "Participante"
  },
  {
    name: "Carolina B.",
    role: "Madre",
    age: 33,
    initials: "CB",
    quote: "Aprender a 'sentir' en lugar de 'hacer' cambió mi perspectiva. Las micro-prácticas somáticas son perfectas para cuando me siento abrumada.",
    timeframe: "Participante"
  },
  {
    name: "Héctor V.",
    role: "Ingeniero",
    age: 50,
    initials: "HV",
    quote: "El dolor lumbar crónico me tenía desesperado. Al trabajar con la fascia y el movimiento consciente, he logrado reducir las molestias en un 80%. Es pura consciencia.",
    timeframe: "Participante"
  }
];

const PILLARS = [
  { num: "1", name: "Comprender", desc: "Psicología + trauma + procesos psíquicos", icon: <Puzzle className="w-8 h-8 text-primary" /> },
  { num: "2", name: "Regular", desc: "Cuerpo + sistema nervioso + respiración", icon: <Wind className="w-8 h-8 text-primary" /> },
  { num: "3", name: "Reconocer", desc: "Patrones, emociones, narrativas, partes internas", icon: <Search className="w-8 h-8 text-primary" /> },
  { num: "4", name: "Integrar", desc: "Kundalini Yoga + meditación + conciencia", icon: <Smile className="w-8 h-8 text-primary" /> },
  { num: "5", name: "Encarnar", desc: "Coherencia, propósito y espiritualidad aplicada", icon: <Leaf className="w-8 h-8 text-primary" /> },
];

const FORMAT_ITEMS = [
  { icon: <Book className="w-6 h-6 text-primary" />, text: "Enseñanza teórica" },
  { icon: <Brain className="w-6 h-6 text-primary" />, text: "Psicología + sistema nervioso + trauma" },
  { icon: <Smile className="w-6 h-6 text-primary" />, text: "Práctica de Kundalini Yoga terapéutico" },
  { icon: <Heart className="w-6 h-6 text-primary" />, text: "Meditación guiada" },
  { icon: <Book className="w-6 h-6 text-primary" />, text: "Bitácora de integración" },
  { icon: <Home className="w-6 h-6 text-primary" />, text: "Recursos para práctica en casa" },
  { icon: <MessageCircle className="w-6 h-6 text-primary" />, text: "Espacio reflexivo / círculo consciente" },
];

const TRAUMA_MANIFESTATIONS = [
  { icon: <Heart className="w-6 h-6 text-primary" />, label: "el cuerpo" },
  { icon: <Sparkles className="w-6 h-6 text-primary" />, label: "el sistema nervioso" },
  { icon: <Users className="w-6 h-6 text-primary" />, label: "los patrones relacionales" },
  { icon: <Wind className="w-6 h-6 text-primary" />, label: "la respiración" },
  { icon: <Search className="w-6 h-6 text-primary" />, label: "la identidad" },
  { icon: <ShieldCheck className="w-6 h-6 text-primary" />, label: "la percepción de seguridad" },
  { icon: <Sparkles className="w-6 h-6 text-primary" />, label: "la conexión con el propósito y la espiritualidad" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SantoshaSomatico = () => {
  const [settings, setSettings] = useState<VisualIdentity | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((item) => item.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as VisualIdentity;
        }
      } catch { /* use local fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = settings
    ? COLOR_PALETTES[settings.palette] || COLOR_PALETTES.menta
    : COLOR_PALETTES.menta;

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>

      {/* Floating CTA */}
      <FloatingCTA
        formAnchor="#somatico-inscripcion"
        ctaText="Inscribirme al Programa"
        subText="🛡️ 3 módulos · 100% Virtual · Cupos limitados"
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className={`py-24 md:py-32 px-6 relative overflow-hidden ${palette.background} border-b border-border/10`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
          >
            <span className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              <ShieldCheck className="w-4 h-4" /> Programa · 3 Módulos · 100% Virtual
            </span>

            <div className="space-y-3">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60">
                Método Santosha®
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
                Santosha Somático®
              </h1>
              <p className={`font-serif text-2xl md:text-3xl font-light italic ${palette.primaryText}`}>
                Del Sobrevivir al Habitar
              </p>
            </div>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              YogaTerapia para gestionar y/o comprender el trauma, regulando el Sistema Nervioso y buscando la aceptación desde una reconexión diferente con la experiencia vivida.
            </p>

            <p className="text-sm text-muted-foreground/80 font-light max-w-xl mx-auto leading-relaxed border-l border-primary/20 pl-4 text-left inline-block">
              Es ideal para procesos de integración emocional profunda, regulación del sistema nervioso, gestión y comprensión de traumas a través de Yogaterapia, Kundalini Yoga, y Conciencia corporal.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {["3 Módulos", "6 Semanas", "Cupos Limitados"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border/50 px-4 py-2 rounded-full">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>

            <a
              href="#somatico-inscripcion"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#somatico-inscripcion")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              <Leaf className="w-4 h-4 ml-1" />
            </a>
          </motion.div>
        </section>

        {/* ── PROPÓSITO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Leaf className="w-12 h-12 text-primary" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Propósito del Programa
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base font-light text-center max-w-2xl mx-auto">
              Un viaje de <strong className="text-foreground font-medium">3 módulos</strong> orientado a comprender, regular e integrar experiencias de trauma desde un enfoque que une psicología transpersonal, cuerpo, sistema nervioso, Kundalini Yoga, meditación y espiritualidad consciente.
            </p>

            <div className={`rounded-3xl ${palette.secondary} p-8 space-y-4 text-center`}>
              <p className={`font-serif text-lg font-light italic ${palette.secondaryText}`}>
                Dejar de moverse o actuar desde la simple supervivencia y encontrar la conexión con la autenticidad.
              </p>
              <p className={`font-serif text-xl font-semibold ${palette.secondaryText}`}>
                Se trata de desarrollar recursos internos, seguridad, presencia y capacidad de habitar nuevamente el cuerpo, las emociones y la propia vida.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── FILOSOFÍA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Brain className="w-12 h-12 text-primary" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Filosofía del Programa
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-5">
                <p className="text-muted-foreground leading-relaxed font-light">
                  Este programa parte de una comprensión fundamental:
                </p>
                <div className="bg-card border border-border/50 rounded-3xl p-6 space-y-2">
                  <p className="font-serif text-lg font-semibold text-foreground leading-snug">
                    El trauma no vive únicamente en la narrativa mental.
                  </p>
                  <p className="text-sm text-muted-foreground font-light">
                    También puede manifestarse en:
                  </p>
                </div>

                <div className="space-y-2">
                  {TRAUMA_MANIFESTATIONS.map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="text-lg shrink-0">{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className={`rounded-3xl p-6 space-y-4 border ${palette.cardBackground} border-border/40`}>
                  <p className="text-sm font-semibold text-foreground">Desde Santosha proponemos:</p>
                  <p className="text-muted-foreground leading-relaxed font-light text-sm">
                    Una práctica integrativa donde <strong className="text-foreground">cuerpo y mente se ponen al servicio del alma</strong>, sin negar la complejidad humana ni caer en positivismo espiritual.
                  </p>
                </div>

                {/* 5 Pillars preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Método Santosha® — 5 Pilares</p>
                  {PILLARS.map((p) => (
                    <div key={p.num} className="flex items-center gap-3 bg-card border border-border/40 rounded-2xl px-4 py-3">
                      <span className="text-lg shrink-0">{p.icon}</span>
                      <div>
                        <span className="text-sm font-semibold text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground font-light ml-2">{p.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── MÓDULOS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="text-center space-y-3 mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Estructura del Programa
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                3 módulos progresivos · 6 semanas · 100% Virtual
              </p>
            </motion.div>

            {/* Module Cards — solo tema central */}
            <div className="space-y-4">
              {MODULES.map((mod, idx) => (
                <motion.div
                  key={mod.num}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                >
                  <div className={`rounded-3xl border ${mod.borderColor} overflow-hidden shadow-sm bg-gradient-to-r ${mod.color}`}>
                    <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start gap-5">
                      {/* Emoji + number */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-center text-3xl shadow-sm">
                          {mod.icon}
                        </div>
                        <span className={`text-xs font-bold tracking-wider uppercase ${mod.accentColor}`}>
                          Módulo {mod.num}
                        </span>
                      </div>

                      {/* Text */}
                      <div className="flex-grow space-y-3">
                        <div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${mod.badgeColor} mr-2`}>
                            Virtual
                          </span>
                          <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mt-2 leading-snug">
                            {mod.title}
                          </h3>
                          {mod.subtitle && (
                            <p className={`text-sm font-light italic mt-0.5 ${mod.accentColor}`}>
                              {mod.subtitle}
                            </p>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          {mod.theme}
                        </p>

                        {/* Goal */}
                        <div className={`flex items-start gap-2 pt-1 pl-3 border-l-2 border-primary/30`}>
                          <p className={`text-xs font-light italic leading-relaxed ${mod.accentColor}`}>
                            <strong className="not-italic font-semibold text-foreground">Objetivo experiencial:</strong> {mod.goal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORMATO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Info className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Qué incluye cada módulo?
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Cada módulo es un espacio completo de aprendizaje, experiencia y práctica.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {FORMAT_ITEMS.map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <span className="text-2xl shrink-0">{icon}</span>
                  <span className="text-sm text-muted-foreground font-light">{text}</span>
                </div>
              ))}
            </div>

            {/* Key info */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: <Calendar className="w-8 h-8 text-primary mx-auto" />, label: "Duración", value: "6 semanas" },
                { icon: <MonitorPlay className="w-8 h-8 text-primary mx-auto" />, label: "Modalidad", value: "100% Virtual" },
                { icon: <Users className="w-8 h-8 text-primary mx-auto" />, label: "Cupos", value: "Limitados" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-2">
                  {icon}
                  <p className="text-xs text-muted-foreground font-light">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── 5 PILARES ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Método Santosha® — 5 Pilares
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Elementos diferenciadores que sostienen el proceso de integración.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PILLARS.map((p, idx) => (
                <motion.div
                  key={p.num}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.08 } } }}
                  className="bg-card border border-border/50 rounded-3xl p-6 text-center space-y-3 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <span className="block mb-2 flex justify-center">{p.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-1">
                      Pilar {p.num}
                    </p>
                    <p className="font-serif text-base font-semibold text-foreground">{p.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── PARA QUIÉN ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Search className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Para quién es este programa?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  icon: <Leaf className="w-8 h-8 text-primary" />,
                  title: "Personas en proceso de sanación",
                  desc: "Que desean recursos concretos para comprender y relacionarse de otra manera con experiencias difíciles o traumáticas.",
                },
                {
                  icon: <Search className="w-8 h-8 text-primary" />,
                  title: "Quienes sienten desconexión de sí mismos",
                  desc: "Que experimentan ansiedad, vacío, bloqueo emocional o una sensación de no habitar del todo su propia vida.",
                },
                {
                  icon: <Smile className="w-8 h-8 text-primary" />,
                  title: "Practicantes de yoga o meditación",
                  desc: "Que quieren integrar una perspectiva más profunda de psicología transpersonal y trabajo somático en su práctica.",
                },
                {
                  icon: <Brain className="w-8 h-8 text-primary" />,
                  title: "Profesionales del acompañamiento",
                  desc: "Psicólogos, terapeutas, instructores o coaches que desean ampliar su comprensión del trauma y el trabajo somático.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <span className="shrink-0">{icon}</span>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── DECLARACIÓN ÉTICA ── */}
        <section className={`py-16 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-3 text-center">
              <Scale className="w-10 h-10 text-primary mx-auto mb-2" />
              <h3 className="font-serif text-lg font-semibold text-foreground">Declaración Ética</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
                Este programa <strong className="text-foreground">no reemplaza</strong> el acompañamiento médico, psiquiatría ni tratamiento clínico especializado. Está diseñado como un espacio complementario de educación, conciencia corporal y práctica integrativa.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <TestimonialsSection 
          testimonials={SOMATICO_TESTIMONIALS} 
          title={<>Historias de <span className="text-primary">Conexión Somática</span></>}
          subtitle="Voces de quienes han redescubierto la sabiduría de su propio cuerpo."
        />

        {/* ── CTA / INSCRIPCIÓN ── */}
        <section id="somatico-inscripcion" className={`py-24 md:py-32 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Comienza tu proceso de integración
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-lg max-w-xl mx-auto">
                Del sobrevivir al habitar. Un paso a la vez, con recursos reales, acompañamiento y práctica.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.link/1yymd8"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
              >
                <MessageCircle className="w-5 h-5" /> Inscribirme por WhatsApp
              </a>

              <p className="text-xs text-muted-foreground">
                Sin compromiso · Te respondemos con todos los detalles del programa
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-5 pt-2">
                {["Cupos limitados", "Enfoque integrativo", "100% Virtual", "Acompañamiento real"].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Cierre poético */}
            <div className={`mt-6 py-6 px-6 rounded-3xl ${palette.secondary} space-y-1`}>
              <p className={`font-serif text-base font-light italic ${palette.secondaryText}`}>
                El trauma puede ser el comienzo de una historia diferente.
              </p>
              <p className={`font-serif text-base font-semibold ${palette.secondaryText}`}>
                No el final de la que ya viviste.
              </p>
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
          <div className="pt-4 flex justify-center gap-6">
            <Link to="/" className="hover:underline text-xs text-muted-foreground/70 transition-colors">
              ← Inicio
            </Link>
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">
              Curso de Iniciación al Yoga →
            </Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">
              🔑 Administrador
            </Link>
          </div>
        </div>
      </footer>

      {/* AI Chat */}
      <AiChatWidget pageSlug="santosha-somatico" />
    </div>
  );
};

export default SantoshaSomatico;
