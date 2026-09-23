import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Moon, Flower2, Leaf, Settings, Heart, ArrowRight } from "lucide-react";
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

const PROGRAMS = [
  {
    icon: <Moon className="w-8 h-8 text-amber-700" />,
    title: "Curso de Iniciación al Yoga",
    subtitle: "Habitar el yoga como una práctica del día a día",
    desc: "Un viaje de un año dividido en 6 módulos, para integrar el yoga, la meditación y la conciencia en tu vida cotidiana.",
    features: ["100% Virtual", "Encuentros bimensuales", "Acompañamiento continuo"],
    href: "/curso-iniciacion-yoga",
    color: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    accentColor: "text-amber-700",
    btnColor: "bg-[#8f757f]",
  },
  {
    icon: <Flower2 className="w-8 h-8 text-rose-700" />,
    title: "Sabiduría Cíclica, Esencia Femenina",
    subtitle: "Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.",
    desc: "Experiencia grupal de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación e intuición.",
    features: ["100% Virtual", "Comunidad de apoyo", "Sabiduría ancestral & corporal"],
    href: "/sabiduria-ciclica-esencia-femenina",
    color: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    accentColor: "text-rose-700",
    btnColor: "bg-[#8f757f]",
  },
  {
    icon: <Leaf className="w-8 h-8 text-teal-700" />,
    title: "Acompañamiento Individual 1:1",
    subtitle: "YogaTerapia, Kundalini Yoga y Meditación",
    desc: "Clases privadas y programas adaptados a tu momento vital, tu historia y tu camino personal. Es un espacio diseñado para cultivar claridad y regulación interna.",
    features: ["Sesiones personalizadas", "Formato 1 a 1", "100% Virtual"],
    href: "/acompanamiento-individual",
    color: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    accentColor: "text-teal-700",
    btnColor: "bg-[#8f757f]",
  },
];

const CultivarBienestar = () => {
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
        formAnchor="#servicios"
        ctaText="Ver servicios"
        subText={<><Heart className="w-3.5 h-3.5 inline-block mr-1 text-primary" /> Kundalini Yoga</>}
      />

      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow pt-32 pb-20 px-6">
        <section id="servicios" className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-center space-y-6"
          >
            <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
              <Leaf className="w-4 h-4" /> Kundalini Yoga
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground uppercase">
              CULTIVAR MI BIENESTAR
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Espacios diseñados para habitar el cuerpo, encontrar equilibrio y conectar con tu verdadera esencia a través de la práctica constante.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {PROGRAMS.map((program, idx) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative group ${program.color} rounded-[2.5rem] p-8 md:p-10 border ${program.borderColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full ${idx === 2 ? "lg:col-span-2 lg:w-1/2 lg:mx-auto" : ""}`}
              >
                <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full space-y-6">
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-black/5">
                      {program.icon}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                        {program.title}
                      </h3>
                      <p className={`text-sm font-medium italic ${program.accentColor}`}>
                        {program.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed font-light flex-grow text-base md:text-lg">
                    {program.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {program.features.map(f => (
                      <span key={f} className="px-4 py-1.5 bg-white/60 text-gray-700 text-xs rounded-full border border-gray-200/50 backdrop-blur-sm">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6">
                    <Link
                      to={program.href}
                      className={`inline-flex items-center justify-center w-full md:w-auto px-8 py-3.5 rounded-full font-semibold text-sm transition-all text-white hover:opacity-90 tracking-wider shadow-sm ${program.btnColor}`}
                    >
                      VER TODOS LOS DETALLES <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

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
            <Link to="/terminos-y-condiciones" className="hover:underline text-xs text-muted-foreground/60 transition-colors">Términos y Condiciones</Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors flex items-center gap-1"><Settings className="w-3 h-3" /> Admin</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="cultivar-bienestar" />
    </div>
  );
};

export default CultivarBienestar;
