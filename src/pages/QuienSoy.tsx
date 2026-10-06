import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flower2, Moon, MessageCircle, ArrowRight } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import fransuryAcompana from "@/assets/fransury-acompana.webp";
import { DrawLine, RevealImage } from "@/components/landing/ScrollReveal";
import { fadeUp, inView, RevealTitle } from "@/components/landing";

// Estructura "editorial": foto sticky + relato corrido.
const HERO_IMAGE = fransuryAcompana;

const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground";
const PROSE = "text-foreground/80 leading-relaxed font-light text-lg";

const FORMATION = [
  { year: "2024", title: "Terapeuta Transpersonal de Pareja", institution: "Escuela Española de Desarrollo Transpersonal y Universidad Miguel de Cervantes", country: "España" },
  { year: "2021", title: "Profesorado Kundalini Yoga", institution: "Happy Yoga Colombia, avalado por KRY International", country: "Colombia" },
  { year: "2013", title: "Especialista en Gerencia del Talento Humano", institution: "Universidad Manuela Beltrán", country: "Colombia" },
  { year: "2009", title: "Psicóloga", institution: "Universidad Cooperativa de Colombia", country: "Colombia" },
];

const COURSES = [
  { year: "2026", role: "Participante", title: "Diplomado en Yogaterapia", detail: "" },
  { year: "2026", role: "Participante", title: "Retiro Transpersonal: Cómo sanar el trauma y el dolor emocional", detail: "Colombia, Escuela Española de Desarrollo Transpersonal" },
  { year: "2024", role: "Participante", title: "Iniciación al Chamanismo", detail: "Inti Waka, Córdoba, Argentina" },
  { year: "2023", role: "Facilitadora", title: "Taller de Esencia Femenina y Yoga para Sanar el Útero", detail: "Portal Yoga, España" },
  { year: "2023", role: "Participante", title: "Taller de Meditación", detail: "Centro de Yoga Shadak Ramiro Calle, Madrid, España" },
  { year: "2023", role: "Participante", title: "Congreso: Egipto de Luz", detail: "El Cairo, Egipto" },
  { year: "2020", role: "Participante", title: "Claves para Atraer y Relacionarte con tu Pareja Ideal", detail: "Enric Corbera Institute" },
];

const DESTINATIONS = ["Egipto", "México", "Argentina", "Suiza", "España", "Italia"];

const STATS = [
  { value: "+20", label: "años recorriendo el camino del autoconocimiento" },
  { value: "+7", label: "años acompañando procesos terapéuticos" },
  { value: "+8", label: "años de práctica de meditación diaria" },
  { value: "100s", label: "de personas acompañadas alrededor del mundo" },
];

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Fransury González",
  jobTitle: "Psicóloga y maestra de Kundalini Yoga",
  url: "https://santoshayoga.com.co/quien-soy",
};

const Timeline = ({ items }: { items: { year: string; title: string; sub: string; role?: string }[] }) => (
  <motion.ol {...inView} variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="relative">
    <DrawLine vertical className="absolute left-[calc(4.5rem+1rem)] top-2 bottom-0 w-px" />
    {items.map((it) => (
      <motion.li key={it.title} variants={fadeUp} className="grid grid-cols-[4.5rem_1fr] gap-4">
        <span className="font-serif text-3xl text-[#B8977E] leading-none pt-0.5">{it.year}</span>
        <div className="border-l border-border/60 pl-5 pb-7 relative">
          <span aria-hidden="true" className="absolute -left-[4px] top-2.5 w-2 h-2 rounded-full bg-[#B8977E]" />
          {it.role && <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.role}</p>}
          <p className="font-semibold text-foreground leading-snug">{it.title}</p>
          {it.sub && <p className="text-sm text-muted-foreground font-light mt-0.5">{it.sub}</p>}
        </div>
      </motion.li>
    ))}
  </motion.ol>
);

const QuienSoy = () => {
  const { settings, palette } = useVisualSettings();

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Fransury González | Psicóloga y maestra de Kundalini Yoga"
        description="Soy Fransury González, psicóloga, psicoterapeuta y maestra de Kundalini Yoga. Conoce mi historia y mi formación."
        path="/quien-soy"
        jsonLd={PERSON_JSONLD}
      />
      <FloatingCTA scrollTo="#quien-soy-contacto" ctaText="Escríbeme" subText="Fransury González" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        {/* Editorial: foto sticky + relato */}
        <section className="md:px-6 md:pt-12 pb-14">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-14 items-start">
            <div className="md:sticky md:top-28">
              <RevealImage src={HERO_IMAGE} alt="Fransury González, psicóloga y maestra de Kundalini Yoga, sonriendo sentada en un sofá claro" eager imgClassName="object-cover object-top"
                className="w-full aspect-[4/5] md:aspect-[3/4] md:rounded-[2rem] shadow-lg" />
            </div>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="px-6 md:px-0 space-y-6 md:pt-6">
              <motion.span variants={fadeUp} className="inline-flex px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-brand-cream text-[#795D64]">
                Quién soy
              </motion.span>
              <RevealTitle as="h1" text="Hola, soy Fransury González." className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.08] text-foreground" />
              <motion.p variants={fadeUp} className="text-base text-foreground/70 font-light">
                Aunque quienes han caminado conmigo desde hace años me llaman <strong className="text-foreground font-medium">Sury</strong>.
              </motion.p>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                Soy psicóloga, psicoterapeuta, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante del comportamiento y la Psique <em>(desde su raíz original: Alma)</em> humana.
              </motion.p>
              <div className="-mx-6 md:mx-0 [&_figure]:my-2 [&_figure]:px-6 md:[&_figure]:px-0">
                <Quote variant="side">
                  "Mi camino hacia la espiritualidad no comenzó en un templo, comenzó en una pregunta profunda: ¿por qué nos cuesta tanto relacionarnos con nosotros mismos y con los demás desde el amor?"
                </Quote>
              </div>
              <motion.ul variants={fadeUp} className="flex flex-wrap gap-2 text-sm">
                {["Psicóloga", "Psicoterapeuta", "Maestra Kundalini Yoga", "Terapia Transpersonal"].map((t) => (
                  <li key={t} className="h-10 flex items-center whitespace-nowrap bg-card border border-border/40 rounded-full px-4">{t}</li>
                ))}
              </motion.ul>
              <motion.ul variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
                {STATS.map(({ value, label }) => (
                  <li key={label} className="bg-card p-4 space-y-1">
                    <p className="font-serif text-4xl text-[#B8977E] leading-none">{value}</p>
                    <p className="text-xs text-muted-foreground font-light leading-snug">{label}</p>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Mi historia */}
        <section className="px-6 py-12 md:py-16">
          <div className={`max-w-[62ch] mx-auto space-y-5 ${PROSE}`}>
            <RevealTitle text="Mi Historia" className={H2 + " mb-4"} />
            <p className="first-letter:font-serif first-letter:float-left first-letter:text-7xl first-letter:leading-[0.85] first-letter:mr-3 first-letter:mt-1 first-letter:text-[#795D64]">Hace más de 20 años inicié un viaje de búsqueda, transformación e integración. La psicología fue una de mis primeras respuestas… pero también una puerta hacia preguntas mucho más profundas sobre el sentido de la experiencia humana, el sufrimiento, la conciencia y la evolución personal.</p>
            <p>Mi formación profesional integra la Psicología, estudios en Gerencia del Talento Humano, Terapia Transpersonal de Pareja, más de 7 años de experiencia clínica como psicoterapeuta, y una trayectoria previa en trabajo social, comunitario y cooperación internacional, experiencias que ampliaron profundamente mi mirada sobre la humanidad.</p>
            <p>Viajar, acompañar comunidades diversas y observar distintas realidades me permitió comprender algo esencial: más allá de culturas, creencias, clases sociales o contextos, existe un anhelo profundamente humano de sanar, crecer, encontrar sentido, amar mejor y vivir con mayor coherencia.</p>
          </div>
        </section>

        <Quote variant="band">"Las experiencias personales, los procesos de transformación y los desafíos de mi propia historia me llevaron a profundizar cada vez más en caminos de autoconocimiento, espiritualidad y sabiduría ancestral."</Quote>

        <section className="px-6 py-12 md:py-16">
          <div className={`max-w-[62ch] mx-auto space-y-5 ${PROSE}`}>
            <p>Fue allí donde el Yoga, la meditación, las prácticas contemplativas, las prácticas ancestrales se convirtieron no solo en herramientas, sino en una manera de habitar la vida.</p>
            <p>Como Maestra de Kundalini Yoga, he acompañado e impactado a cientos de personas de distintos lugares del mundo a través de esta poderosa tecnología de conciencia.</p>
            <p>Practico meditación desde hace más de ocho años y continúo recorriendo caminos de aprendizaje alrededor del mundo, explorando la historia espiritual de la humanidad y encontrándome con maestros, tradiciones y comunidades comprometidas con una búsqueda auténtica de servicio y evolución.</p>
          </div>
        </section>

        {/* Viajes */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="px-6 max-w-3xl mx-auto text-center space-y-4">
              <RevealTitle text="Un camino que cruza fronteras" className={H2} />
              <p className="text-muted-foreground font-light text-lg leading-relaxed">
                Mis viajes me han llevado a lugares profundamente simbólicos y transformadores, donde he seguido nutriendo una visión integradora entre psicología, espiritualidad, cuerpo, conciencia y propósito.
              </p>
            </div>
            <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              className="flex md:grid md:grid-cols-6 gap-3 overflow-x-auto snap-x px-6 pb-2">
              {DESTINATIONS.map((d, i) => (
                <motion.li key={d} variants={fadeUp}
                  className="snap-start shrink-0 w-32 md:w-auto rounded-2xl border border-border/50 bg-card px-4 py-5 text-center">
                  <span className="block text-xs text-[#B8977E] font-serif">{String(i + 1).padStart(2, "0")}</span>
                  <span className="block font-serif text-xl text-foreground mt-1">{d}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Hoy */}
        <section className="px-6 py-6">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-5xl mx-auto rounded-[2.5rem] bg-warm-mauve/40 px-6 py-12 md:px-16 md:py-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4">
              <RevealTitle text="Hoy, desde Santosha" className={H2} />
              <motion.p variants={fadeUp} className={PROSE}>
                Acompaño procesos de transformación interior donde el Kundalini Yoga, la meditación, la psicología, la espiritualidad consciente y el trabajo profundo con el ser humano se unen para ayudar a las personas a vivir con más verdad, presencia, libertad y amor.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="space-y-3 md:border-l md:border-brand-gold md:pl-10">
              <p className="font-serif text-lg md:text-xl italic text-foreground/80">
                "Porque creo profundamente que sanar no significa convertirse en alguien distinto."
              </p>
              <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground leading-snug">
                Significa recordar quién eres cuando vuelves a tu esencia.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Formación + cursos lado a lado */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-8">
              <RevealTitle text="Formación Académica" className={H2} />
              <Timeline items={FORMATION.map((f) => ({ year: f.year, title: f.title, sub: `${f.institution} · ${f.country}` }))} />
            </div>
            <div className="space-y-8">
              <RevealTitle text="Cursos y Participaciones" className={H2} />
              <Timeline items={COURSES.map((c) => ({ year: c.year, title: c.title, sub: c.detail, role: c.role }))} />
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section id="quien-soy-contacto" className="scroll-mt-24 px-6 py-14 md:py-16 bg-brand-cream/70">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="max-w-3xl mx-auto text-center space-y-6">
            <RevealTitle text="¿Quieres caminar conmigo?" className={H2} />
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed">
              Si algo de lo que leíste resonó en ti, me alegra. Eso ya es el comienzo de algo.
            </motion.p>
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: Moon, title: "Curso de Iniciación al Yoga", desc: "6 módulos · Encuentros bimensuales · 100% Virtual", href: "/curso-iniciacion-yoga" },
                { icon: Flower2, title: "Sabiduría Cíclica", desc: "Esencia Femenina · Virtual · Comunidad", href: "/sabiduria-ciclica-esencia-femenina" },
              ].map(({ icon: Icon, title, desc, href }) => (
                <Link key={title} to={href} className="group flex items-start gap-4 bg-card border border-border/40 rounded-3xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
                  <Icon className="w-6 h-6 text-[#795D64] shrink-0" />
                  <div className="flex-1">
                    <p className="font-serif text-lg font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground font-light mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#795D64] transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </motion.div>
            <motion.div variants={fadeUp}>
              <a href="https://wa.me/573105679517" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md transition-all bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                <MessageCircle className="w-5 h-5" /> Escribirme por WhatsApp
              </a>
            </motion.div>
            <p className="text-xs text-muted-foreground">Sin compromiso · Te respondo personalmente.</p>
          </motion.div>
        </section>

        <NextSteps />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="quien-soy" />
    </div>
  );
};

export default QuienSoy;
