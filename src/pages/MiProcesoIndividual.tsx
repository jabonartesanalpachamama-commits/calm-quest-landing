import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Leaf, Search, ShieldCheck, Droplets, Sparkles, Zap, Sun, 
  HeartHandshake, Settings, Compass, MessageCircle, Heart, Star, Brain, Anchor
} from "lucide-react";
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
import bannerImage from "@/assets/banner-acompanamiento.webp";

const FOR_WHOM = [
  "Dificultades en sus relaciones.",
  "Dependencia emocional o miedo a estar solas.",
  "Baja autoestima y necesidad constante de aprobación.",
  "Dificultad para poner límites.",
  "Procesos de duelo y pérdidas.",
  "Crisis o momentos de transición.",
  "Patrones que se repiten en sus relaciones.",
  "Dificultad para comprender o gestionar sus emociones.",
  "Sensación de estar desconectadas de sí mismas.",
  "Necesidad de replantear su proyecto de vida.",
  "Para quienes desean sanar sus patrones transgeneracionales."
];

// ─── Component ────────────────────────────────────────────────────────────────
const MiProcesoIndividual = () => {
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

  const cta1Session = `https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, me gustaría inscribirme a 1 Sesión de Psicoterapia Individual.')}`;
  const cta3Sessions = `https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, me gustaría inscribirme al paquete de 3 Sesiones de Psicoterapia Individual.')}`;

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>

      <FloatingCTA
        formAnchor="#tarifas"
        ctaText="Iniciar mi proceso"
        subText={<><Heart className="w-3.5 h-3.5 inline-block mr-1 text-primary" /> Psicoterapia Individual</>}
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="relative py-32 md:py-48 px-6 overflow-hidden border-b border-border/10 flex items-center min-h-[90vh] w-full">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0 w-full">
            <img 
              src={bannerImage} 
              alt="Psicoterapia Individual Background" 
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="w-full max-w-3xl md:mr-auto md:ml-8 lg:ml-16 text-center md:text-left space-y-8 relative z-10"
          >
            <span className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-sm">
              <Brain className="w-4 h-4" /> Psicoterapia Individual
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
              MI PROCESO<br />
              <span className="text-white/90 font-light italic">Individual</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-2xl drop-shadow mx-auto md:mx-0">
              Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y relacionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.
            </p>

            <div className="pt-8">
              <a
                href="#tarifas"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#tarifas")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white text-gray-900 hover:bg-gray-50"
              >
                Ver opciones de consulta <Anchor className="w-4 h-4 ml-1 text-gray-700" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── PARA QUIÉN ES ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center space-y-3">
              <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Para personas que están atravesando:
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {FOR_WHOM.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, delay: idx * 0.05 } } }}
                  className="flex items-start gap-4 bg-background border border-border/40 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed font-light">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── RECUADRO DESTACADO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <div className={`rounded-3xl p-10 md:p-14 text-center space-y-6 ${palette.secondary} shadow-lg relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
              <div className="relative z-10 space-y-4">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className={`font-serif text-2xl md:text-3xl font-medium leading-relaxed ${palette.secondaryText}`}>
                  "No se trata solamente de entender por qué te pasa. Se trata de aprender qué hacer con aquello que hoy comprendes."
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── TARIFAS / BOTONES ── */}
        <section id="tarifas" className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center space-y-3">
              <Settings className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Inicia tu proceso
              </h2>
              <p className="text-muted-foreground font-light text-lg">
                Elige la opción que mejor se adapte a tu momento actual
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              
              {/* Opción 1 Sesión */}
              <div className="relative group bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    1 Sesión
                  </h3>
                  <p className="text-muted-foreground text-sm font-light mb-8 flex-grow">
                    Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico.
                  </p>
                  
                  <a
                    href={cta1Session}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 ${palette.primary} ${palette.primaryText} hover:opacity-90`}
                  >
                    Quiero 1 sesión <span className="font-bold border-l border-black/20 pl-2 ml-1">75 USD</span>
                  </a>
                </div>
              </div>

              {/* Opción 3 Sesiones */}
              <div className="relative group bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-sm z-20">
                    Recomendado
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    3 Sesiones
                  </h3>
                  <p className="text-muted-foreground text-sm font-light mb-8 flex-grow">
                    Proceso de acompañamiento más profundo para trabajar patrones y generar verdaderas herramientas de cambio.
                  </p>
                  
                  <a
                    href={cta3Sessions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 ${palette.primary} ${palette.primaryText} hover:opacity-90`}
                  >
                    Quiero 3 sesiones <span className="font-bold border-l border-black/20 pl-2 ml-1">203 USD</span>
                  </a>
                </div>
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
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Curso de Iniciación</Link>
            <Link to="/terminos-y-condiciones" className="hover:underline text-xs text-muted-foreground/60 transition-colors">Términos y Condiciones</Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors flex items-center gap-1"><Settings className="w-3 h-3" /> Admin</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="mi-proceso-individual" />
    </div>
  );
};

export default MiProcesoIndividual;
