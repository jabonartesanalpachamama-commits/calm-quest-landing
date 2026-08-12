import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Moon, Flower2, Leaf, Info, MessageCircle, Gift, PlayCircle } from "lucide-react";
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
import fransuryImage from "@/assets/fransury_portal.webp";
import santoshaLogo from "@/assets/santosha-logo.webp";

const PROGRAMS = [
  {
    icon: <Moon className="w-6 h-6 text-amber-700" />,
    title: "Curso de Iniciación al Yoga",
    subtitle: "Habitar el yoga como una práctica del día a día",
    desc: "Un viaje de un año dividido en 6 módulos, para integrar el yoga, la meditación y la conciencia en tu vida cotidiana.",
    features: ["100% Virtual", "Encuentros bimensuales", "Acompañamiento continuo"],
    href: "/curso-iniciacion-yoga",
    color: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    accentColor: "text-amber-700",
  },
  {
    icon: <Flower2 className="w-6 h-6 text-rose-700" />,
    title: "Sabiduría Cíclica, Esencia Femenina",
    subtitle: "Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.",
    desc: "Experiencia grupal de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación e intuición.",
    features: ["100% Virtual", "Comunidad de apoyo", "Sabiduría ancestral & corporal"],
    href: "/sabiduria-ciclica-esencia-femenina",
    color: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    accentColor: "text-rose-700",
  },
  {
    icon: <Leaf className="w-6 h-6 text-teal-700" />,
    title: "Acompañamiento Individual 1:1",
    subtitle: "YogaTerapia, Kundalini Yoga y Meditación",
    desc: "Clases privadas y programas adaptados a tu momento vital, tu historia y tu camino personal. Es un espacio diseñado para cultivar claridad y regulación interna.",
    features: ["Sesiones personalizadas", "Formato 1 a 1", "100% Virtual"],
    href: "/acompanamiento-individual",
    color: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    accentColor: "text-teal-700",
  },
];

const PHILOSOPHY_PILLARS = [
  {
    icon: <Info className="w-8 h-8 text-primary" />,
    title: "¿Qué es Santosha?",
    text: "Santosha es un Niyama sánscrito que habla de contentamiento. Para mí, va más allá de conformarse: es cultivar una presencia profunda, calma consciente y equilibrio tanto en la expansión como en la incertidumbre.",
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Salir del Modo Supervivencia",
    text: "Gran parte del sufrimiento emerge cuando vivimos reaccionando, controlando y desconectados del cuerpo. Santosha propone restaurar el sistema nervioso para volver a habitar el presente.",
  },
];

const TESTIMONIALS = [
  {
    name: "Andrea M.",
    role: "Alumna Curso de Iniciación",
    text: "Este espacio ha cambiado mi forma de relacionarme conmigo misma. El Kundalini Yoga y la guía de Sury me devolvieron la calma mental y corporal que había perdido hace años.",
  },
  {
    name: "Carolina G.",
    role: "Participante Sabiduría Cíclica",
    text: "Reconectar con mi naturaleza cíclica me devolvió una escucha profunda de mi cuerpo. Ahora vivo mis ciclos con más claridad, respeto y amor propio.",
  },
  {
    name: "Laura V.",
    role: "Acompañamiento 1:1",
    text: "Un acompañamiento sumamente amoroso, profesional e integrador. Sury sostiene el espacio con una presencia y una sabiduría increíbles.",
  },
];

const PortalHome = () => {
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
      } catch { /* fallback */ }
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

        {/* ── HERO ── */}
        <section className="py-24 md:py-32 px-6 relative overflow-hidden text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-8 relative z-10"
          >
            <span className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              <Leaf className="w-4 h-4" /> Conciencia · Calma · Transformación humana
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
              Del modo supervivencia a la<br />
              <span className={palette.primaryText}>calma consciente</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              Kundalini Yoga, regulación del sistema nervioso y sabiduría somática para recordar tu esencia y habitar tu vida.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#programas"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#programas")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
              >
                Ver programas formativos
              </a>
              <Link
                href="https://wa.me/573105679517"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold bg-card border border-border hover:bg-muted/30 transition-all duration-300"
              >
                <Gift className="w-5 h-5" /> Acceder a Clase Gratuita
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── EMBÚDO PRINCIPAL: BANNER CLASE GRATUITA ── */}
        <section className={`py-12 px-6 ${palette.secondary} border-y border-border/20`}>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/80 ${palette.secondaryText}`}>
                Entrada Gratuita
              </span>
              <h3 className={`font-serif text-2xl md:text-3xl font-bold ${palette.secondaryText}`}>
                ¿Sufres de ansiedad o agotamiento mental?
              </h3>
              <p className="text-sm font-light text-muted-foreground/90 max-w-xl">
                Accede a nuestra Clase Maestra online de 30 minutos donde aprenderás una técnica somática neurocientífica para calmar tu sistema nervioso de inmediato.
              </p>
            </div>
            <Link
              href="https://wa.me/573105679517"
              className={`shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              <PlayCircle className="w-5 h-5" /> Comenzar Clase Maestra
            </Link>
          </div>
        </section>

        {/* ── NUESTROS PROGRAMAS Y ESPACIOS ── */}
        <section id="programas" className={`py-20 md:py-28 px-6 ${palette.cardBackground}`}>
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
                Formación & Acompañamiento
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Nuestros Programas y Espacios
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Recorridos de transformación progresivos y personalizados orientados a restaurar tu equilibrio interno.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {PROGRAMS.map((prog, idx) => (
                <motion.div
                  key={prog.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                  className={`rounded-3xl border ${prog.borderColor} overflow-hidden shadow-sm bg-gradient-to-br ${prog.color} hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className="p-7 space-y-5">
                    {/* Header: emoji + title */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm shrink-0">
                        {prog.icon}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
                          {prog.title}
                        </h3>
                        <p className={`text-xs italic font-medium ${prog.accentColor}`}>
                          {prog.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {prog.desc}
                    </p>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {prog.features.map((f) => (
                        <span key={f} className="text-[10px] px-2.5 py-1 rounded-full bg-white/60 text-muted-foreground border border-white/80 font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-7 pb-7 pt-2">
                    <Link
                      to={prog.href}
                      className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-center block transition-all duration-200 hover:scale-[1.01] ${palette.primary}`}
                    >
                      Ver todos los detalles →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUIÉN SOY ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-y border-border/10`}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                {/* Image Placeholder Block for the Yoga Teacher */}
                <div className="w-full max-w-sm rounded-3xl bg-muted border border-border/50 shadow-md overflow-hidden relative">
                  <img src={fransuryImage} alt="Fransury González" className="w-full h-auto object-cover" />
                </div>
                <div className={`absolute -bottom-4 -right-4 px-5 py-2 rounded-full text-sm font-semibold shadow-md bg-white text-foreground border border-border/40 flex items-center gap-2`}>
                  Sury González <Leaf className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className={`text-xs font-semibold tracking-wider uppercase ${palette.primaryText}`}>
                Acompañamiento Humano
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-foreground">
                Quién te acompaña
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-base">
                Hola, soy <strong className="text-foreground font-medium">Fransury González (Sury)</strong>. Soy psicóloga, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante de la psique y el alma humana.
              </p>
              <p className="text-muted-foreground leading-relaxed font-light text-base">
                Mi propósito es acompañarte a sanar experiencias difíciles, a transformar el significado de estás y habitar una vida en mayor plenitud, lo haremos a través de la integración del yoga, como medicina ancestral y comprendiendo algunos factores psicológicos, para que puedas aprender cómo regular tu sistema nervioso.
              </p>
            </div>
          </div>
        </section>

        {/* ── FILOSOFÍA / MANIFIESTO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground}`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
                Manifiesto Santosha
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Nuestra Filosofía de Trabajo
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {PHILOSOPHY_PILLARS.map((pillar) => (
                <div key={pillar.title} className="bg-card border border-border/50 rounded-3xl p-8 space-y-4 hover:border-primary/20 transition-all duration-300">
                  <span className="block mb-2">{pillar.icon}</span>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{pillar.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                to="/filosofia"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline text-primary"
              >
                Leer el manifiesto completo de Santosha →
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── BLOQUE DE RESEÑAS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-t border-border/10`}>
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
                Experiencias de Alumnas y Participantes
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Lo que dicen de Santosha
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Testimonios reales de personas que han transformado su relación con el cuerpo y la mente a través de nuestros espacios.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <motion.div
                  key={t.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: idx * 0.08 } } }}
                  className="bg-card border border-border/40 rounded-3xl p-7 space-y-5 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <p className="text-sm text-muted-foreground font-light italic leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="pt-2 border-t border-border/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className={`py-24 md:py-32 px-6 ${palette.secondary} text-center relative overflow-hidden`}>
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground">
              ¿Listo(a) para dar el primer paso?
            </h2>
            <p className="text-lg text-muted-foreground/90 font-light max-w-xl mx-auto leading-relaxed">
              Explora nuestros programas o inicia completamente gratis con nuestra Clase Maestra de 30 minutos sobre regulación y equilibrio emocional.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://wa.me/573105679517"
                className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-base font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
              >
                <Gift className="w-5 h-5" /> Acceder a la Clase Gratis
              </Link>
              <a
                href="https://wa.me/573105679517"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-base font-bold bg-white text-foreground border border-border/40 hover:bg-neutral-50 transition-all duration-300 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp
              </a>
            </div>

            <p className="text-xs text-muted-foreground/80">
              Acompañamiento virtual disponible desde cualquier lugar del mundo.
            </p>
          </div>
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
            <Link to="/quien-soy" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Quién Soy</Link>
            <Link to="/filosofia" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Filosofía</Link>
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Curso de Iniciación</Link>
            <Link to="/sabiduria-ciclica-esencia-femenina" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Sabiduría Cíclica</Link>
            <Link to="/acompanamiento-individual" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Acompañamiento 1:1</Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">🔑 Admin</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="home" />
    </div>
  );
};

export default PortalHome;
