import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, Loader2, Leaf, ArrowRight, User, Users } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { SideToc, PillToc, useActiveSection } from "@/components/landing/StickyToc";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { BreathingCircle, OutlineWord } from "@/components/landing/Breath";
import { fadeUp, inView, RevealTitle, RevealWords } from "@/components/landing";

// Estructura "lectura larga": índice lateral + contenido.
const TOC: [string, string][] = [
  ["que-es", "¿Qué es Santosha?"],
  ["invitacion", "La invitación"],
  ["metodo", "Método Santosha®"],
  ["dos-caminos", "Dos caminos"],
  ["espiritualidad", "Una espiritualidad viva"],
  ["creemos", "Creemos en"],
  ["programas", "Los programas"],
];

const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground";
const PROSE = "space-y-5 text-foreground/80 leading-relaxed font-light text-lg";

const BELIEFS = [
  "El poder del autoconocimiento",
  "La capacidad del cuerpo para recordar",
  "La respiración como medicina",
  "La meditación como regreso al centro",
  "El Kundalini Yoga como tecnología de conciencia capaz de despertar aquello que ya vive dentro de nosotros",
];

const NIYAMA_CARDS = [
  { icon: Droplets, title: "La calma en el éxito y en el fracaso", desc: "Ecuanimidad ante los extremos de la experiencia." },
  { icon: Loader2, title: "En la expansión y en la incertidumbre", desc: "Presencia que no depende de las circunstancias." },
  { icon: Leaf, title: "En lo que celebramos y en lo que nos desafía", desc: "Contentamiento consciente, no resignación." },
];

const LINKS = [
  { icon: User, title: "Quién es Sury", desc: "Conoce el camino detrás del método", href: "/quien-soy" },
  { icon: User, title: "Mi Proceso Individual", desc: "Psicoterapia individual · 100% Virtual", href: "/mi-proceso-individual" },
  { icon: Users, title: "Proceso de Pareja", desc: "Psicoterapia de Pareja · 100% Virtual", href: "/proceso-de-pareja" },
  { icon: Leaf, title: "Cultivar Mi Bienestar", desc: "Kundalini Yoga · Programas y Acompañamiento", href: "/cultivar-bienestar" },
];

const Filosofia = () => {
  const { settings, palette } = useVisualSettings();
  const active = useActiveSection(TOC.map(([id]) => id));

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>
      <Seo
        title="Filosofía y manifiesto | SantoSha"
        description="Santosha: volver a la esencia y habitar la vida con conciencia. El enfoque que integra psicología, Kundalini Yoga y meditación."
        path="/filosofia"
      />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        {/* Hero tipográfico */}
        <section className="relative overflow-hidden px-6 pt-16 pb-14 md:pt-24 md:pb-20 text-center bg-gradient-to-b from-brand-cream to-background">
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <BreathingCircle tone="gold" className="relative w-[min(80vw,460px)] aspect-square opacity-70" />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-2 flex justify-center opacity-50">
            <OutlineWord word="SANTOSHA" className="text-[clamp(5rem,22vw,16rem)]" />
          </div>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }} className="relative max-w-5xl mx-auto space-y-6">
            <motion.img variants={fadeUp} src="/santosha-logo-transparent.webp" alt="Logo Santosha" className="w-14 md:w-16 h-auto mx-auto" />
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.3em] uppercase text-[#795D64]">Manifiesto Santosha</motion.p>
            <motion.h1 variants={fadeUp} className="font-serif font-semibold leading-none tracking-tight text-brand-ink text-[clamp(4rem,16vw,10rem)]">
              Santosha
            </motion.h1>
            <RevealWords text="Volver a la esencia. Habitar la vida con conciencia." className="font-serif text-xl md:text-3xl font-light italic text-foreground/80" />
          </motion.div>
        </section>

        <div className="max-w-6xl mx-auto px-6 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-14 pb-10">
          <SideToc items={TOC} active={active} title="En esta página" />
          <PillToc items={TOC} active={active} />

          <div className="min-w-0 space-y-20 pt-10 lg:pt-0">
            {/* Qué es */}
            <section id="que-es" className="scroll-mt-32 space-y-8">
              <RevealTitle text="¿Qué es Santosha?" className={H2} />
              <div className={PROSE}>
                <p>
                  <strong className="text-foreground font-medium">Santosha</strong> es una palabra en sánscrito y uno de los <em>Niyamas</em> del Yoga, los principios internos que orientan el camino del desarrollo de la conciencia. Frecuentemente se traduce como <strong className="text-foreground font-medium">contentamiento</strong>.
                </p>
                <p>
                  Pero Santosha va mucho más allá de la idea de "estar bien" o conformarse con la vida. Habla de la capacidad de cultivar una presencia profunda, una calma consciente y una relación más equilibrada con la experiencia humana.
                </p>
              </div>
              <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid sm:grid-cols-3 gap-4">
                {NIYAMA_CARDS.map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} variants={fadeUp} className="rounded-3xl border border-border/50 bg-card p-6 space-y-3">
                    <Icon className="w-7 h-7 text-[#795D64]" />
                    <p className="font-serif text-lg font-semibold text-foreground leading-snug">{title}</p>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
              <div className="-mx-6 lg:mx-0 lg:[&_section]:rounded-3xl">
                <Quote variant="band">"La capacidad de cultivar ecuanimidad, presencia y contentamiento consciente tanto en el éxito como en el fracaso."</Quote>
              </div>
            </section>

            {/* Invitación: díptico */}
            <section id="invitacion" className="scroll-mt-32 space-y-8">
              <RevealTitle text="La invitación" className={H2} />
              <div className={PROSE}>
                <p>
                  Esta filosofía inspira profundamente el trabajo de Santosha. Porque después de años acompañando procesos desde la psicología, el Kundalini Yoga y la espiritualidad consciente, hemos comprendido que gran parte de nuestro sufrimiento emerge cuando vivimos atrapados en estados de supervivencia: reaccionando, controlando, exigiéndonos, desconectándonos de nosotros mismos.
                </p>
              </div>
              <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="relative grid md:grid-cols-2 gap-4 md:gap-0">
                <motion.div variants={fadeUp} className="rounded-3xl md:rounded-r-none bg-brand-ink text-brand-cream p-8 md:p-12 min-h-[16rem] flex flex-col justify-end space-y-3">
                  <p className="font-serif text-4xl md:text-5xl font-semibold">Sobrevivir</p>
                  <p className="text-brand-cream/85 font-light">Reaccionar · Controlar · Exigirse · Desconectarse</p>
                </motion.div>
                <div aria-hidden="true" className="flex md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 justify-center z-10">
                  <span className="w-14 h-14 rounded-full bg-brand-gold text-brand-ink flex items-center justify-center shadow-lg rotate-90 md:rotate-0">
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </div>
                <motion.div variants={fadeUp} className="rounded-3xl md:rounded-l-none bg-brand-cream p-8 md:p-12 min-h-[16rem] flex flex-col justify-end space-y-3 md:pl-16">
                  <p className="font-serif text-4xl md:text-5xl font-semibold text-foreground">Habitar</p>
                  <p className="text-foreground/75 font-light">Presencia · Ecuanimidad · Conexión · Contentamiento consciente</p>
                </motion.div>
              </motion.div>
              <p className="text-center font-serif text-xl italic text-[#795D64]">Santosha invita a otro movimiento</p>
            </section>

            {/* Método */}
            <section id="metodo" className="scroll-mt-32 space-y-6">
              <div className="space-y-2">
                <RevealTitle text="Método Santosha®" className={H2} />
                <p className="text-muted-foreground font-light text-lg">Yoga, Salud Mental y Conciencia Integrativa</p>
              </div>
              <div className={PROSE}>
                <p>El enfoque de Santosha integra el Kundalini Yoga, yogaterapia, la meditación, la psicología transpersonal,y la espiritualidad consciente como caminos de autoconocimiento, integración y transformación humana.</p>
                <p>Muchos procesos de transformación no ocurren únicamente desde la comprensión racional. La experiencia humana también se mueve en el cuerpo, en el sistema nervioso, en los símbolos, en los arquetipos colectivos, en la conciencia y en la dimensión relacional y espiritual del ser.</p>
                <p>Desde allí nace este enfoque: un espacio donde la espiritualidad es tan simple como estar en sintonía con tu vida con el regalo que trae en cada momento.</p>
              </div>
            </section>

            {/* Dos caminos */}
            <section id="dos-caminos" className="scroll-mt-32 space-y-6">
              <RevealTitle text="Dos caminos. Una misma intención." className={H2} />
              <div className={PROSE}>
                <p>La psicoterapia permite comprender los procesos emocionales, psicológicos y relacionales que están influyendo en nuestra vida.</p>
                <p>El Kundalini Yoga ofrece prácticas de respiración, movimiento, meditación y conciencia corporal que pueden favorecer la presencia, la autorregulación y el contacto con uno mismo.</p>
              </div>
              <div className="-mx-6 lg:mx-0 [&_figure]:mx-0">
                <Quote variant="side">En Santosha, ambos caminos pueden encontrarse desde el respeto por cada historia, la naturaleza y los objetivos de cada proceso.</Quote>
              </div>
            </section>

            {/* Espiritualidad viva */}
            <section id="espiritualidad" className="scroll-mt-32 space-y-6">
              <RevealTitle text="Una espiritualidad viva" className={H2} />
              <div className={PROSE}>
                <p>No estamos aquí para convertirnos en alguien perfecto. Estamos aquí para recordar quiénes somos debajo del ruido, las heridas, las máscaras, las exigencias y las historias que aprendimos a cargar.</p>
                <p>El camino espiritual no consiste en escapar de la experiencia humana, sino en <strong className="text-foreground font-medium">aprender a habitarla con mayor presencia, verdad y compasión</strong>.</p>
              </div>
              <motion.p {...inView} variants={fadeUp} className="font-serif text-3xl md:text-4xl text-[#795D64] flex flex-wrap gap-x-6">
                <span>Con raíces.</span><span>Con cuerpo.</span><span>Con conciencia.</span>
              </motion.p>
              <div className="-mx-6 lg:mx-0 lg:[&_section]:rounded-3xl">
                <Quote variant="band" cite="Una espiritualidad que no niega el dolor, las preguntas, los procesos ni las contradicciones humanas.">
                  Porque evolucionar no significa dejar de ser humano. Significa aprender a sostener nuestra humanidad con más amor.
                </Quote>
              </div>
            </section>

            {/* Creemos en */}
            <section id="creemos" className="scroll-mt-32 space-y-6">
              <RevealTitle text="Creemos en" className={H2} />
              <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="divide-y divide-brand-gold/50 border-y border-brand-gold/50">
                {BELIEFS.map((b) => (
                  <motion.li key={b} variants={fadeUp} className="py-5 font-serif text-2xl md:text-3xl leading-snug text-foreground">{b}</motion.li>
                ))}
              </motion.ul>
            </section>

            {/* Programas */}
            <section id="programas" className="scroll-mt-32 space-y-6">
              <div className="space-y-3">
                <RevealTitle text="Desde esta filosofía nacen los programas" className={H2} />
                <p className="text-muted-foreground font-light text-lg">
                  Cada programa es una expresión práctica de esta visión. Un espacio para vivir la filosofía, no solo comprenderla.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {LINKS.map(({ icon: Icon, title, desc, href }) => (
                  <Link key={title} to={href}
                    className="group flex items-center gap-4 rounded-3xl border border-border/50 bg-card p-6 hover:-translate-y-1 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
                    <Icon className="w-7 h-7 text-[#795D64] shrink-0" />
                    <div className="flex-1">
                      <p className="font-serif text-xl font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground font-light mt-0.5">{desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#795D64] transition-transform group-hover:translate-x-1.5" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        <NextSteps />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="filosofia" />
    </div>
  );
};

export default Filosofia;
