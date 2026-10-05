import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Moon, Flower2, Leaf, ArrowRight } from "lucide-react";
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
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { fadeUp, inView, RotatingOrnament, LandingSection } from "@/components/landing";

const PROGRAMS = [
  {
    icon: Moon,
    title: "Curso de Iniciación al Yoga",
    subtitle: "Habitar el yoga como una práctica del día a día",
    desc: "Un viaje de un año dividido en 6 módulos, para integrar el yoga, la meditación y la conciencia en tu vida cotidiana.",
    features: ["100% Virtual", "Encuentros bimensuales", "Acompañamiento continuo"],
    href: "/curso-iniciacion-yoga",
  },
  {
    icon: Flower2,
    title: "Sabiduría Cíclica, Esencia Femenina",
    subtitle: "Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.",
    desc: "Experiencia grupal de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación e intuición.",
    features: ["100% Virtual", "Comunidad de apoyo", "Sabiduría ancestral & corporal"],
    href: "/sabiduria-ciclica-esencia-femenina",
  },
  {
    icon: Leaf,
    title: "Acompañamiento Individual 1:1",
    subtitle: "YogaTerapia, Kundalini Yoga y Meditación",
    desc: "Clases privadas y programas adaptados a tu momento vital, tu historia y tu camino personal. Es un espacio diseñado para cultivar claridad y regulación interna.",
    features: ["Sesiones personalizadas", "Formato 1 a 1", "100% Virtual"],
    href: "/acompanamiento-individual",
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

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Programas de yoga y meditación | SantoSha"
        description="Curso de iniciación al yoga, Sabiduría Cíclica y sesiones 1 a 1 de yoga y meditación con Fransury Gonzáles."
        path="/cultivar-bienestar"
      />
      <FloatingCTA scrollTo="#servicios" ctaText="Ver programas" subText="Yoga y meditación" />

      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <LandingSection tone="plain" className="overflow-hidden bg-gradient-to-b from-card via-card to-background">
          <RotatingOrnament className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 opacity-20" />
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="relative max-w-3xl mx-auto text-center space-y-5 py-6 md:py-10"
          >
            <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
              Kundalini Yoga
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground">
              Cultivar mi bienestar
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              Espacios diseñados para habitar el cuerpo, encontrar equilibrio y conectar con tu verdadera esencia a través de la práctica constante.
            </motion.p>
          </motion.div>
        </LandingSection>

        <LandingSection id="servicios" tone="mauve">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
            {PROGRAMS.map(({ icon: Icon, title, subtitle, desc, features, href }, idx) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`bg-card border border-border/40 rounded-3xl p-6 md:p-8 flex flex-col gap-5 ${idx === 2 ? "lg:col-span-2 lg:w-1/2 lg:mx-auto" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-7 h-7 text-primary shrink-0 mt-1" />
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground leading-snug">{title}</h2>
                    <p className="text-sm italic text-primary mt-1">{subtitle}</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground font-light leading-relaxed flex-grow">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span key={f} className="text-xs font-medium px-3 py-1 rounded-full bg-background border border-border/40 text-primary">{f}</span>
                  ))}
                </div>
                <Link
                  to={href}
                  className="inline-flex items-center justify-center self-start gap-2 px-7 py-3 rounded-full text-sm font-semibold bg-[#795D64] hover:bg-[#6A5057] text-white transition-colors"
                >
                  Ver detalles <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </LandingSection>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="cultivar-bienestar" />
    </div>
  );
};

export default CultivarBienestar;
