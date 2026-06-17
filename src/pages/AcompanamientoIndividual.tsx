import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, Leaf, Search, ShieldCheck, Droplets, Sparkles, Zap, Sun, HeartHandshake, Settings, Compass, MessageCircle, Map, Smartphone, Clock, Calendar, Users, Moon } from "lucide-react";
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
import santoshaLogo from "@/assets/santosha-logo.jpg";

const SERVICES = [
  {
    icon: <User className="w-6 h-6 text-amber-700" />,
    title: "Clases Privadas de Kundalini Yoga y Meditación",
    desc: "Diseñadas según tu proceso personal, intención terapéutica o camino espiritual.",
    tags: ["1 a 1", "Personalizada", "Virtual"],
    color: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    accentColor: "text-amber-700",
  },
  {
    icon: <Leaf className="w-6 h-6 text-teal-700" />,
    title: "Procesos de Acompañamiento Integrativo",
    desc: "Programas de varias sesiones orientados a profundizar en objetivos específicos de regulación, autoconocimiento, integración emocional o transformación humana.",
    tags: ["Multi-sesión", "Integrativo", "Virtual"],
    color: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    accentColor: "text-teal-700",
  },
];

const FOR_WHOM = [
  {
    icon: <Search className="w-6 h-6 text-primary" />,
    text: "Profundizar en su camino de autoconocimiento",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    text: "Fortalecer recursos internos y conciencia corporal",
  },
  {
    icon: <Droplets className="w-6 h-6 text-primary" />,
    text: "Integrar procesos emocionales o momentos de transición vital",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    text: "Desarrollar una práctica espiritual más consciente",
  },
  {
    icon: <Leaf className="w-6 h-6 text-primary" />,
    text: "Pasar del modo supervivencia a una relación más coherente, presente y compasiva con su vida",
  },
];

const WHAT_CULTIVATES = [
  { icon: <Search className="w-4 h-4 text-primary" />, label: "Claridad" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "Regulación interna" },
  { icon: <Sun className="w-4 h-4 text-primary" />, label: "Autoconocimiento" },
  { icon: <Sparkles className="w-4 h-4 text-primary" />, label: "Conexión espiritual" },
  { icon: <Leaf className="w-4 h-4 text-primary" />, label: "Coherencia con tu esencia" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AcompanamientoIndividual = () => {
  const [settings, setSettings] = useState<VisualIdentity | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((i) => i.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as VisualIdentity;
        }
      } catch { /* local fallback */ }
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

      <FloatingCTA
        formAnchor="#individual-contacto"
        ctaText="Quiero mi sesión 1:1"
        subText={<><Leaf className="w-3.5 h-3.5 inline-block mr-1 text-primary" /> Proceso personalizado · 100% Virtual</>}
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className={`py-24 md:py-32 px-6 relative overflow-hidden ${palette.background} border-b border-border/10`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8 relative z-10"
          >
            <span className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              <Leaf className="w-4 h-4 text-primary" /> Sesiones 1 a 1 · 100% Virtual
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
              Acompañamiento<br />
              <span className={palette.primaryText}>Individual</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-xl mx-auto">
              YogaTerapia, Kundalini Yoga y Meditación 1:1
            </p>

            {/* What it cultivates */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {WHAT_CULTIVATES.map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border/50 px-4 py-2 rounded-full">
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            <a
              href="#individual-contacto"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#individual-contacto")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              Quiero saber más <Leaf className="w-4 h-4 text-primary-foreground ml-1" />
            </a>
          </motion.div>
        </section>

        {/* ── QUÉ ES ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Deseas un proceso personalizado?
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base font-light text-center max-w-2xl mx-auto">
              En Santosha te ofrecemos acompañamiento 1 a 1 — clases privadas donde el <strong className="text-foreground font-medium">Kundalini Yoga</strong>, la <strong className="text-foreground font-medium">meditación</strong> y la <strong className="text-foreground font-medium">conciencia corporal</strong> se ponen al servicio de tu transformación humana.
            </p>

            <div className={`rounded-3xl p-8 text-center space-y-3 ${palette.secondary}`}>
              <p className={`font-serif text-lg font-light italic leading-relaxed ${palette.secondaryText}`}>
                Un espacio diseñado para ayudarte a cultivar mayor claridad, regulación interna, autoconocimiento, conexión espiritual y coherencia con tu esencia.
              </p>
              <p className={`text-sm font-medium ${palette.secondaryText} opacity-80`}>
                Procesos adaptados a tu momento vital, tu historia y tu camino personal.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── SERVICIOS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="text-center space-y-3"
            >
              <Settings className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Qué ofrecemos?
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Dos modalidades de acompañamiento, ambas adaptadas a tu proceso único.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {SERVICES.map((svc, idx) => (
                <motion.div
                  key={svc.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                  className={`rounded-3xl border ${svc.borderColor} overflow-hidden shadow-sm bg-gradient-to-br ${svc.color}`}
                >
                  <div className="p-7 space-y-5">
                    {/* Icon + title */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {svc.icon}
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-foreground leading-snug pt-1">
                        {svc.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {svc.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {svc.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] font-semibold px-3 py-1 rounded-full bg-white/60 border border-white/80 ${svc.accentColor}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA QUIÉN ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Compass className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Para quién es este espacio?
              </h2>
              <p className="text-muted-foreground font-light">
                Para personas que desean:
              </p>
            </div>

            <div className="space-y-3">
              {FOR_WHOM.map(({ icon, text }, idx) => (
                <motion.div
                  key={text}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, delay: idx * 0.08 } } }}
                  className="flex items-start gap-4 bg-card border border-border/40 rounded-2xl px-6 py-5 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className="shrink-0 mt-0.5">{icon}</div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Cómo funciona?
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Un proceso simple, claro y completamente a tu medida.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  icon: <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />,
                  title: "Conversación inicial",
                  desc: "Nos conocemos, comprendes el espacio y evaluamos juntos qué proceso se adapta mejor a tu momento.",
                },
                {
                  step: "2",
                  icon: <Map className="w-8 h-8 text-primary mx-auto mb-2" />,
                  title: "Diseño personalizado",
                  desc: "Adaptamos el formato, la frecuencia y la intención de cada sesión a tu historia y objetivos.",
                },
                {
                  step: "3",
                  icon: <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />,
                  title: "Acompañamiento continuo",
                  desc: "Sesiones 1:1 con seguimiento, recursos entre encuentros y ajustes según tu proceso.",
                },
              ].map(({ step, icon, title, desc }) => (
                <div key={title} className="bg-card border border-border/50 rounded-3xl p-7 space-y-4 hover:border-primary/30 hover:shadow-sm transition-all duration-300 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${palette.primary}`}>
                      {step}
                    </div>
                    {icon}
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-base font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key info row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Smartphone className="w-6 h-6 text-primary mx-auto mb-1" />, label: "Modalidad", value: "100% Virtual" },
                { icon: <Clock className="w-6 h-6 text-primary mx-auto mb-1" />, label: "Duración", value: "Por sesión acordada" },
                { icon: <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />, label: "Frecuencia", value: "Adaptable a ti" },
                { icon: <Users className="w-6 h-6 text-primary mx-auto mb-1" />, label: "Formato", value: "1 a 1 exclusivo" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-card border border-border/50 rounded-2xl p-4 text-center space-y-1">
                  {icon}
                  <p className="text-[10px] text-muted-foreground font-light">{label}</p>
                  <p className="text-xs font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CTA ── */}
        <section id="individual-contacto" className={`py-24 md:py-32 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Leaf className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Reserva tu sesión
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-lg max-w-xl mx-auto">
                Escríbenos y conversamos sobre lo que necesitas. El primer paso es simplemente llegar.
              </p>
            </div>

            <a
              href="https://wa.link/1yymd8"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              <MessageCircle className="w-5 h-5" /> Escribirme por WhatsApp
            </a>

            <p className="text-xs text-muted-foreground">
              Sin compromiso · Te respondemos personalmente con todos los detalles
            </p>

            <div className="flex flex-wrap justify-center gap-5 pt-2">
              {["Proceso personalizado", "100% Virtual", "Cupos limitados", "Acompañamiento real"].map((badge) => (
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
                ¿Buscas un programa grupal?
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
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors flex items-center gap-1"><Settings className="w-3 h-3" /> Admin</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="acompanamiento-individual" />
    </div>
  );
};

export default AcompanamientoIndividual;
