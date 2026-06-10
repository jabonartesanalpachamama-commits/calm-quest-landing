import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
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
import santoshaLogo from "@/assets/santosha-logo.jpg";

// ─── Module data ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    num: "01",
    title: "Fundamentos y Despertar de la Conciencia",
    theme: "¿Qué es Kundalini Yoga y por qué emerge con fuerza en esta era?",
    emoji: "🌅",
    color: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    accentColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    num: "02",
    title: "Las Herramientas del Kundalini Yoga",
    theme: "Cómo funciona el yoga y por qué transforma la experiencia humana.",
    emoji: "🛠️",
    color: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    accentColor: "text-green-700",
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    num: "03",
    title: "Anatomía Yóguica y Desarrollo Humano",
    theme: "Comprender la arquitectura energética del ser humano.",
    emoji: "⚡",
    color: "from-violet-50 to-purple-50",
    borderColor: "border-violet-200",
    accentColor: "text-violet-700",
    badgeColor: "bg-violet-100 text-violet-800",
  },
  {
    num: "04",
    title: "La Mente, las Emociones y la Transformación Interna",
    theme: "El yoga como tecnología para relacionarnos diferente con la mente.",
    emoji: "🧠",
    color: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    accentColor: "text-blue-700",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    num: "05",
    title: "Relaciones, Propósito y Estilo de Vida Consciente",
    theme: "Llevar el yoga fuera del mat.",
    emoji: "🌿",
    color: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    accentColor: "text-rose-700",
    badgeColor: "bg-rose-100 text-rose-800",
  },
  {
    num: "06",
    title: "Integración, Liderazgo Interior y Camino Espiritual",
    theme: "Habitar el yoga como experiencia viva.",
    emoji: "🕊️",
    color: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    accentColor: "text-teal-700",
    badgeColor: "bg-teal-100 text-teal-800",
  },
];

const BETWEEN_MODULES = [
  { icon: "📄", label: "PDF de apoyo temático" },
  { icon: "🎧", label: "Audio de meditación o pranayama" },
  { icon: "🔥", label: "Práctica de 21 o 40 días" },
  { icon: "📓", label: "Bitácora de integración personal" },
  { icon: "🤝", label: "Grupo de acompañamiento (opcional)" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const CursoIniciacionYoga = () => {
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
        formAnchor="#curso-inscripcion"
        ctaText="Inscribirme al Curso"
        subText="🌙 Encuentros bimensuales — 6 módulos en un año"
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className={`py-24 md:py-32 px-6 relative overflow-hidden ${palette.background} border-b border-border/10`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
          >
            <span className={`inline-block px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              ✨ Curso de Iniciación · 6 Módulos Bimensuales
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
              Curso de Iniciación al<br />
              <span className={palette.primaryText}>Yoga</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              Habitar el yoga como una práctica del día a día
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {["6 Módulos", "Encuentros Bimensuales", "Práctica Progresiva", "Material de Apoyo"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border/50 px-4 py-2 rounded-full">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>

            <a
              href="#curso-inscripcion"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#curso-inscripcion")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              Quiero Inscribirme 🌙
            </a>
          </motion.div>
        </section>

        {/* ── INTRODUCCIÓN ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <span className="text-4xl">🙏</span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Introducción del Curso
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground leading-relaxed text-base font-light">
              <p>
                Vivimos en un tiempo de aceleración, exceso de estímulos, desconexión del cuerpo, ansiedad mental y búsqueda profunda de sentido. En medio de esta realidad, el <strong className="text-foreground font-medium">Kundalini Yoga</strong> surge como una tecnología ancestral para recordar algo esencial: la capacidad humana de vivir con mayor conciencia, vitalidad, claridad y conexión espiritual.
              </p>
              <p>
                Este curso de iniciación propone un recorrido progresivo a través de las bases filosóficas, prácticas y experienciales del Kundalini Yoga. No se trata únicamente de aprender posturas, respiraciones o meditaciones.
              </p>

              <div className={`border-l-2 border-primary/40 pl-6 py-2 space-y-2`}>
                {[
                  "Comprender el yoga como camino de transformación interna",
                  "Explorar las herramientas del Kundalini Yoga",
                  "Profundizar en la relación con el cuerpo, la mente, la energía y el espíritu",
                  "Desarrollar una práctica consciente que pueda integrarse en la vida cotidiana",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-1 shrink-0">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What each encounter includes */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-5">
              <h3 className="font-serif text-xl font-semibold text-foreground">Cada encuentro incluirá:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "📚", text: "Enseñanza teórica" },
                  { icon: "🧘", text: "Experiencia práctica de Kundalini Yoga" },
                  { icon: "🌬️", text: "Respiración, kriyas, mantra y meditación" },
                  { icon: "💭", text: "Espacios de reflexión e integración" },
                  { icon: "🏠", text: "Práctica sugerida entre módulos" },
                  { icon: "📖", text: "Material de apoyo y profundización" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="text-xl shrink-0">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center font-serif text-lg italic text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              "Este curso está dirigido tanto a personas nuevas en el camino del yoga como a practicantes que desean profundizar su comprensión y experiencia del Kundalini Yoga."
            </p>

            {/* Poetic closing */}
            <div className={`text-center space-y-1 py-6 px-6 rounded-2xl ${palette.secondary} opacity-90`}>
              <p className={`font-serif text-base ${palette.secondaryText} font-light italic`}>
                Porque el yoga no ocurre únicamente en el mat.
              </p>
              <p className={`font-serif text-base ${palette.secondaryText} font-light italic`}>
                Ocurre en cómo respiras. En cómo eliges.
              </p>
              <p className={`font-serif text-base ${palette.secondaryText} font-light italic`}>
                En cómo sostienes tu energía.
              </p>
              <p className={`font-serif text-base ${palette.secondaryText} font-semibold`}>
                En cómo habitas tu humanidad y tu espiritualidad.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── MÓDULOS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="text-center space-y-3 mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Los 6 Módulos del Curso
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Un recorrido progresivo a lo largo de un año, con encuentros bimensuales.
              </p>
            </motion.div>

            {/* Module Cards — static, solo tema central */}
            <div className="space-y-4">
              {MODULES.map((mod, idx) => (
                <motion.div
                  key={mod.num}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.06 } } }}
                >
                  <div className={`rounded-3xl border ${mod.borderColor} overflow-hidden shadow-sm bg-gradient-to-r ${mod.color}`}>
                    <div className="p-6 flex items-center gap-5">
                      {/* Emoji badge */}
                      <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {mod.emoji}
                      </div>

                      {/* Text */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-bold tracking-wider uppercase ${mod.accentColor}`}>
                            Módulo {mod.num}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${mod.badgeColor}`}>
                            Bimensual
                          </span>
                        </div>
                        <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground leading-snug">
                          {mod.title}
                        </h3>
                        <p className={`text-sm font-light mt-1 leading-relaxed ${mod.accentColor} opacity-90`}>
                          {mod.theme}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ENTRE MÓDULOS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <span className="text-4xl">✨</span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Recursos Entre Módulos
              </h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                Porque el verdadero aprendizaje del Kundalini Yoga no ocurre cada dos meses. Ocurre en la repetición, la observación y la experiencia cotidiana.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BETWEEN_MODULES.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <span className="text-3xl shrink-0">{icon}</span>
                  <span className="text-sm text-muted-foreground font-light">{label}</span>
                </div>
              ))}
            </div>

            <blockquote className={`text-center mx-auto max-w-2xl py-8 px-6 rounded-3xl ${palette.secondary}`}>
              <p className={`font-serif text-base md:text-lg italic leading-relaxed ${palette.secondaryText}`}>
                "La disciplina primero negocia contigo… luego empieza a revelarte cosas."
              </p>
              <p className={`text-xs mt-3 ${palette.secondaryText} opacity-70`}>
                — Como diría cualquier practicante después del día 17 de una práctica de 40 días
              </p>
            </blockquote>
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
              <span className="text-4xl">🧭</span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Para quién es este curso?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "🌱",
                  title: "Principiantes en el camino",
                  desc: "Si eres nuevo en el yoga y quieres comenzar desde los fundamentos con una guía progresiva y profunda.",
                },
                {
                  icon: "🔥",
                  title: "Practicantes que desean profundizar",
                  desc: "Si ya tienes experiencia y buscas comprender más a fondo la filosofía, la anatomía yóguica y las herramientas del Kundalini Yoga.",
                },
                {
                  icon: "💆",
                  title: "Personas en búsqueda de bienestar",
                  desc: "Si atraviesas estrés, ansiedad, desconexión o una búsqueda de sentido y quieres herramientas reales de transformación.",
                },
                {
                  icon: "🌀",
                  title: "Buscadores espirituales",
                  desc: "Si sientes el llamado a explorar el desarrollo espiritual con disciplina, apertura y desde una tradición probada.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <span className="text-3xl shrink-0">{icon}</span>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CTA / INSCRIPCIÓN ── */}
        <section id="curso-inscripcion" className={`py-24 md:py-32 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <span className="text-5xl">🌙</span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Comienza tu viaje anual de transformación
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-lg max-w-xl mx-auto">
                6 módulos. 1 año. Una práctica que transforma. Inscríbete ahora y reserva tu lugar.
              </p>
            </div>

            {/* Key info cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "📅", label: "Modalidad", value: "100% Virtual" },
                { icon: "🗓️", label: "Duración", value: "1 año · Bimensual" },
                { icon: "👥", label: "Grupo", value: "Cupos limitados" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-1">
                  <span className="text-2xl">{icon}</span>
                  <p className="text-xs text-muted-foreground font-light">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.link/1yymd8"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
              >
                💬 Inscribirme por WhatsApp
              </a>

              <p className="text-xs text-muted-foreground">
                Sin compromiso · Te respondemos con todos los detalles
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-5 pt-2">
                {["Plazas limitadas", "Instructor certificado", "Práctica progresiva"].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </span>
                ))}
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
          <div className="pt-4 flex justify-center gap-6">
            <Link to="/" className="hover:underline text-xs text-muted-foreground/70 transition-colors">
              ← Inicio
            </Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">
              🔑 Administrador
            </Link>
          </div>
        </div>
      </footer>

      {/* AI Chat */}
      <AiChatWidget pageSlug="curso-iniciacion-yoga" />
    </div>
  );
};

export default CursoIniciacionYoga;
