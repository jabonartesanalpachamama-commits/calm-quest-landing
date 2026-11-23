import { motion } from "framer-motion";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { fadeUp } from "@/components/landing";
import AccordionGallery from "@/components/reactbits/AccordionGallery";
import { PATH_PHOTOS } from "@/data/caminos";

// Los mismos tres programas en la galería fotográfica.
const PROGRAMS = [
  {
    id: "curso",
    ...PATH_PHOTOS.curso,
    title: "Curso de Iniciación al Yoga",
    subtitle: "Habitar el yoga como una práctica del día a día",
    desc: "Un viaje de un año dividido en 6 módulos, para integrar el yoga, la meditación y la conciencia en tu vida cotidiana.",
    features: ["100% Virtual", "Encuentros bimensuales", "Acompañamiento continuo"],
    href: "/curso-iniciacion-yoga",
    bg: "bg-brand-cream",
  },
  {
    id: "ciclica",
    ...PATH_PHOTOS.ciclica,
    title: "Sabiduría Cíclica, Esencia Femenina",
    subtitle: "Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.",
    desc: "Experiencia grupal de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación e intuición.",
    features: ["100% Virtual", "Comunidad de apoyo", "Sabiduría ancestral & corporal"],
    href: "/sabiduria-ciclica-esencia-femenina",
    bg: "bg-background",
  },
  {
    id: "individual",
    ...PATH_PHOTOS.yoga,
    title: "Acompañamiento Individual 1:1",
    subtitle: "YogaTerapia, Kundalini Yoga y Meditación",
    desc: "Clases privadas y programas adaptados a tu momento vital, tu historia y tu camino personal. Es un espacio diseñado para cultivar claridad y regulación interna.",
    features: ["Sesiones personalizadas", "Formato 1 a 1", "100% Virtual"],
    href: "/acompanamiento-individual",
    bg: "bg-brand-cream",
  },
];

const CultivarBienestar = () => {
  const { settings, palette } = useVisualSettings();

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Programas de yoga y meditación | SantoSha"
        description="Curso de iniciación al yoga, Sabiduría Cíclica y sesiones 1 a 1 de yoga y meditación con Fransury González."
        path="/cultivar-bienestar"
      />
      <FloatingCTA scrollTo="#servicios" ctaText="Ver programas" subText="Yoga y meditación" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <section className="px-6 pt-14 pb-8 md:pt-20 md:pb-10">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-3xl mx-auto text-center space-y-5">
            <motion.span variants={fadeUp} className="text-xs font-semibold tracking-[0.3em] uppercase text-[#795D64]">Kundalini Yoga</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-semibold leading-[1.02] text-foreground">
              Cultivar mi bienestar
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              Espacios diseñados para habitar el cuerpo, encontrar equilibrio y conectar con tu verdadera esencia a través de la práctica constante.
            </motion.p>
          </motion.div>
        </section>

        <section id="servicios" className="px-6 pb-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto"><AccordionGallery items={PROGRAMS} /></div>
        </section>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="cultivar-bienestar" />
    </div>
  );
};

export default CultivarBienestar;
