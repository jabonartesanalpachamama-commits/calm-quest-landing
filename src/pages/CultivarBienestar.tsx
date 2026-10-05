import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Flower2, Leaf, ArrowRight, ArrowDown } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { fadeUp, inView } from "@/components/landing";

// Estructura "tres entradas": selector + tres tarjetas verticales altas.
const PROGRAMS = [
  {
    id: "curso",
    icon: Moon,
    title: "Curso de Iniciación al Yoga",
    subtitle: "Habitar el yoga como una práctica del día a día",
    desc: "Un viaje de un año dividido en 6 módulos, para integrar el yoga, la meditación y la conciencia en tu vida cotidiana.",
    features: ["100% Virtual", "Encuentros bimensuales", "Acompañamiento continuo"],
    href: "/curso-iniciacion-yoga",
    bg: "bg-gradient-to-b from-warm-mauve/70 via-warm-mauve/25 to-card",
  },
  {
    id: "ciclica",
    icon: Flower2,
    title: "Sabiduría Cíclica, Esencia Femenina",
    subtitle: "Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.",
    desc: "Experiencia grupal de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación e intuición.",
    features: ["100% Virtual", "Comunidad de apoyo", "Sabiduría ancestral & corporal"],
    href: "/sabiduria-ciclica-esencia-femenina",
    bg: "bg-gradient-to-b from-warm-peach/90 via-warm-peach/35 to-card",
  },
  {
    id: "individual",
    icon: Leaf,
    title: "Acompañamiento Individual 1:1",
    subtitle: "YogaTerapia, Kundalini Yoga y Meditación",
    desc: "Clases privadas y programas adaptados a tu momento vital, tu historia y tu camino personal. Es un espacio diseñado para cultivar claridad y regulación interna.",
    features: ["Sesiones personalizadas", "Formato 1 a 1", "100% Virtual"],
    href: "/acompanamiento-individual",
    bg: "bg-gradient-to-b from-brand-gold/40 via-brand-cream to-card",
  },
];

const CultivarBienestar = () => {
  const { settings, palette } = useVisualSettings();

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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
          <div className="max-w-6xl mx-auto space-y-8">
            <nav aria-label="Elige por dónde empezar" className="flex flex-col md:flex-row items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Elige por dónde empezar:</span>
              <ul className="flex flex-wrap justify-center gap-2">
                {PROGRAMS.map((p, i) => (
                  <li key={p.id}>
                    <a href={`#${p.id}`} onClick={(e) => go(e, p.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#795D64]/30 text-sm text-[#795D64] hover:bg-warm-mauve/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
                      <span className="font-serif text-brand-gold">{String(i + 1).padStart(2, "0")}</span> {p.title.split(",")[0]}
                      <ArrowDown className="w-3.5 h-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="grid lg:grid-cols-3 gap-6">
              {PROGRAMS.map(({ id, icon: Icon, title, subtitle, desc, features, href, bg }, i) => (
                <motion.article key={id} id={id} variants={fadeUp}
                  className={`${bg} scroll-mt-28 relative overflow-hidden rounded-[2rem] border border-border/40 p-8 lg:min-h-[38rem] flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                  <span aria-hidden="true" className="absolute -top-6 right-4 font-serif text-[9rem] leading-none text-brand-ink/10 select-none">{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="relative w-9 h-9 text-[#795D64]" strokeWidth={1.4} />
                  <div className="relative">
                    <h2 className="font-serif text-3xl font-semibold text-foreground leading-tight">{title}</h2>
                    <p className="text-base italic text-[#795D64] mt-2">{subtitle}</p>
                  </div>
                  <p className="relative text-base text-foreground/75 font-light leading-relaxed flex-grow">{desc}</p>
                  <div className="relative flex flex-wrap gap-2">
                    {features.map((f) => (
                      <span key={f} className="text-xs font-medium px-3 py-1 rounded-full bg-card/80 text-[#795D64]">{f}</span>
                    ))}
                  </div>
                  <Link to={href}
                    className="relative group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-[#795D64] hover:bg-[#6A5057] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                    Ver detalles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="cultivar-bienestar" />
    </div>
  );
};

export default CultivarBienestar;
