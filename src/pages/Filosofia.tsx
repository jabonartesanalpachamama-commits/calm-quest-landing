import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Search, Heart, Wind, User, Zap, Droplets, Loader2, Leaf, Sun, ChevronRight, Brain, Sparkles, Sprout, HandHeart, Moon, ShieldCheck, HeartHandshake, Settings, Flower2 } from "lucide-react";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import santoshaLogo from "@/assets/santosha-logo.webp";

const BELIEFS = [
  { icon: <Search className="w-6 h-6 text-primary" />, text: "El poder del autoconocimiento" },
  { icon: <Heart className="w-6 h-6 text-primary" />, text: "La capacidad del cuerpo para recordar" },
  { icon: <Wind className="w-6 h-6 text-primary" />, text: "La respiración como medicina" },
  { icon: <User className="w-6 h-6 text-primary" />, text: "La meditación como regreso al centro" },
  { icon: <Zap className="w-6 h-6 text-primary" />, text: "El Kundalini Yoga como tecnología de conciencia capaz de despertar aquello que ya vive dentro de nosotros" },
];

const NIYAMA_CARDS = [
  {
    icon: <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />,
    title: "La calma en el éxito y en el fracaso",
    desc: "Ecuanimidad ante los extremos de la experiencia.",
  },
  {
    icon: <Loader2 className="w-8 h-8 text-primary mx-auto mb-2" />,
    title: "En la expansión y en la incertidumbre",
    desc: "Presencia que no depende de las circunstancias.",
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />,
    title: "En lo que celebramos y en lo que nos desafía",
    desc: "Contentamiento consciente, no resignación.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Filosofia = () => {
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

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO — MANIFIESTO ── */}
        <section className={`py-24 md:py-32 px-6 relative overflow-hidden ${palette.background} border-b border-border/10`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8 relative z-10"
          >
            <div className="flex justify-center mb-6">
              <img 
                src="/santosha-logo-transparent.webp" 
                alt="Logo Santosha" 
                className="w-20 md:w-28 h-auto object-contain" 
              />
            </div>

            <span className={`inline-block px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              ✦ Manifiesto Santosha
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
              Santosha
            </h1>

            <p className="font-serif text-xl md:text-2xl font-light italic text-muted-foreground leading-relaxed">
              Volver a la esencia. Habitar la vida con conciencia.
            </p>
          </motion.div>
        </section>

        {/* ── QUÉ ES SANTOSHA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
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
                ¿Qué es Santosha?
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground leading-relaxed font-light text-base">
              <p>
                <strong className="text-foreground font-medium">Santosha</strong> es una palabra en sánscrito y uno de los <em>Niyamas</em> del Yoga, los principios internos que orientan el camino del desarrollo de la conciencia. Frecuentemente se traduce como <strong className="text-foreground font-medium">contentamiento</strong>.
              </p>
              <p>
                Pero Santosha va mucho más allá de la idea de "estar bien" o conformarse con la vida. Habla de la capacidad de cultivar una presencia profunda, una calma consciente y una relación más equilibrada con la experiencia humana.
              </p>
            </div>

            {/* Three expressions */}
            <div className="grid sm:grid-cols-3 gap-4">
              {NIYAMA_CARDS.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-card border border-border/50 rounded-3xl p-6 text-center space-y-3 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  {icon}
                  <p className="font-serif text-sm font-semibold text-foreground leading-snug">{title}</p>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Pull quote */}
            <div className={`rounded-3xl p-8 text-center space-y-3 ${palette.secondary}`}>
              <p className={`font-serif text-lg md:text-xl font-light italic leading-relaxed ${palette.secondaryText}`}>
                "La capacidad de cultivar ecuanimidad, presencia y contentamiento consciente tanto en el éxito como en el fracaso."
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── DE SOBREVIVIR A HABITAR ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Sun className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                La invitación
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground leading-relaxed font-light text-base">
              <p>
                Esta filosofía inspira profundamente el trabajo de Santosha. Porque después de años acompañando procesos desde la psicología, el Kundalini Yoga y la espiritualidad consciente, hemos comprendido que gran parte de nuestro sufrimiento emerge cuando vivimos atrapados en estados de supervivencia: reaccionando, controlando, exigiéndonos, desconectándonos de nosotros mismos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className={`rounded-3xl p-8 text-center border border-border/30 ${palette.cardBackground} space-y-2`}>
                <Zap className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="font-serif text-lg font-semibold text-foreground">Sobrevivir</p>
                <p className="text-sm text-muted-foreground font-light">Reaccionar · Controlar · Exigirse · Desconectarse</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${palette.primary}`}>→</div>
                <p className={`font-serif text-base italic font-light ${palette.primaryText}`}>Santosha invita a otro movimiento</p>
              </div>
            </div>

            <div className={`rounded-3xl p-8 text-center space-y-3 ${palette.secondary}`}>
              <Leaf className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className={`font-serif text-2xl font-bold ${palette.secondaryText}`}>Habitar</p>
              <p className={`text-sm font-light ${palette.secondaryText} opacity-80`}>
                Presencia · Ecuanimidad · Conexión · Contentamiento consciente
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── MÉTODO SANTOSHA® ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Settings className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Método Santosha®
              </h2>
              <p className="text-muted-foreground font-light">
                Yoga, Salud Mental y Conciencia Integrativa
              </p>
            </div>

            <div className="max-w-2xl mx-auto items-start">
              <div className="space-y-5 text-muted-foreground leading-relaxed font-light text-base text-center">
                <p>
                  El enfoque de Santosha integra el Kundalini Yoga, yogaterapia, la meditación, la psicología transpersonal,y la espiritualidad consciente como caminos de autoconocimiento, integración y transformación humana.
                </p>
                <p>
                  Muchos procesos de transformación no ocurren únicamente desde la comprensión racional. La experiencia humana también se mueve en el cuerpo, en el sistema nervioso, en los símbolos, en los arquetipos colectivos, en la conciencia y en la dimensión relacional y espiritual del ser.
                </p>
                <p>
                  Desde allí nace este enfoque: un espacio donde la espiritualidad es tan simple como estar en sintonía con tu vida con el regalo que trae en cada momento.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── MANIFIESTO PROFUNDO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Una espiritualidad viva
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground leading-relaxed font-light text-base">
              <p>
                No estamos aquí para convertirnos en alguien perfecto. Estamos aquí para recordar quiénes somos debajo del ruido, las heridas, las máscaras, las exigencias y las historias que aprendimos a cargar.
              </p>
              <p>
                El camino espiritual no consiste en escapar de la experiencia humana, sino en <strong className="text-foreground font-medium">aprender a habitarla con mayor presencia, verdad y compasión</strong>.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Con raíces.", icon: <Sprout className="w-6 h-6 text-primary" /> },
                { label: "Con cuerpo.", icon: <Heart className="w-6 h-6 text-primary" /> },
                { label: "Con conciencia.", icon: <Sparkles className="w-6 h-6 text-primary" /> },
              ].map(({ label, icon }) => (
                <div key={label} className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${palette.cardBackground} border-border/40`}>
                  <div className="shrink-0">{icon}</div>
                  <p className="font-serif text-base font-semibold text-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className={`rounded-3xl p-8 space-y-3 ${palette.secondary} text-center`}>
              <p className={`font-serif text-base font-light italic leading-relaxed ${palette.secondaryText}`}>
                Una espiritualidad que no niega el dolor, las preguntas, los procesos ni las contradicciones humanas.
              </p>
              <p className={`font-serif text-lg font-semibold ${palette.secondaryText}`}>
                Porque evolucionar no significa dejar de ser humano. Significa aprender a sostener nuestra humanidad con más amor.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── CREEMOS EN ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Creemos en
              </h2>
            </div>

            <div className="space-y-3">
              {BELIEFS.map(({ icon, text }, idx) => (
                <motion.div
                  key={text}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: idx * 0.08 } } }}
                  className="flex items-start gap-4 bg-card border border-border/40 rounded-2xl px-6 py-5 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className="shrink-0 mt-0.5">{icon}</div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── LINKS A PROGRAMAS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background}`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Moon className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Desde esta filosofía nacen los programas
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Cada programa es una expresión práctica de esta visión. Un espacio para vivir la filosofía, no solo comprenderla.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-left">
              {[
                {
                  icon: <User className="w-8 h-8 text-primary mb-3" />,
                  title: "Quién es Sury",
                  desc: "Conoce el camino detrás del método",
                  href: "/quien-soy",
                },
                {
                  icon: <Moon className="w-8 h-8 text-primary mb-3" />,
                  title: "Curso de Iniciación al Yoga",
                  desc: "6 módulos · Bimensual · Virtual",
                  href: "/curso-iniciacion-yoga",
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-primary mb-3" />,
                  title: "Santosha Somático®",
                  desc: "Del Sobrevivir al Habitar · 3 módulos",
                  href: "/santosha-somatico",
                },
              ].map(({ icon, title, desc, href }) => (
                <Link
                  key={title}
                  to={href}
                  className="flex flex-col gap-3 bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-300 group"
                >
                  {icon}
                  <div>
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{title}</p>
                    <p className="text-xs text-muted-foreground font-light mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
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
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Curso de Iniciación</Link>
            <Link to="/santosha-somatico" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Santosha Somático®</Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">🔑 Admin</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="filosofia" />
    </div>
  );
};

export default Filosofia;
