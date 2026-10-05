import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Moon, MessageCircle } from "lucide-react";
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
import fransuryRetrato from "@/assets/fransury-retrato.webp";
import {
  fadeUp, inView, RevealTitle, RevealWords, RotatingOrnament, LandingSection, SplitHero,
} from "@/components/landing";

// Foto del hero: cambiar solo esta línea cuando llegue la foto definitiva.
const HERO_IMAGE = fransuryRetrato;

const PILL = "h-10 flex items-center whitespace-nowrap bg-card/80 backdrop-blur-sm border border-border/40 rounded-full px-4";
const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground text-center";

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
  name: "Fransury Gonzáles",
  jobTitle: "Psicóloga y maestra de Kundalini Yoga",
  url: "https://santoshayoga.com.co/quien-soy",
};

const Timeline = ({ items }: { items: { year: string; title: string; sub: string; role?: string }[] }) => (
  <motion.ol {...inView} variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="max-w-2xl mx-auto">
    {items.map((it) => (
      <motion.li key={it.title} variants={fadeUp} className="grid grid-cols-[3.5rem_1fr] gap-4">
        <span className="font-serif text-xl text-[#B8977E] pt-0.5">{it.year}</span>
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
        title="Quién soy | Fransury Gonzáles, psicóloga y maestra de Kundalini Yoga"
        description="Soy Fransury Gonzáles, psicóloga, psicoterapeuta y maestra de Kundalini Yoga. Conoce mi historia y mi formación."
        path="/quien-soy"
        jsonLd={PERSON_JSONLD}
      />
      <FloatingCTA scrollTo="#quien-soy-contacto" ctaText="Escríbeme" subText="Fransury Gonzáles" />

      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        <SplitHero image={HERO_IMAGE} imagePosition="object-top" maskClassName="hero-bleed-narrow" alt="Fransury Gonzáles, psicóloga y maestra de Kundalini Yoga">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card/70 text-primary">
            Quién soy
          </motion.span>
          <RevealTitle as="h1" text="Hola, soy Fransury Gonzáles." className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground" />
          <motion.p variants={fadeUp} className="text-base text-foreground/70 font-light">
            Aunque quienes han caminado conmigo desde hace años me llaman <strong className="text-foreground font-medium">Sury</strong>.
          </motion.p>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
            Soy psicóloga, psicoterapeuta, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante del comportamiento y la Psique <em>(desde su raíz original: Alma)</em> humana.
          </motion.p>
          <motion.blockquote variants={fadeUp} className="border-l-2 border-[#B8977E] pl-4 text-left font-serif text-lg italic text-foreground/80 leading-relaxed">
            "Mi camino hacia la espiritualidad no comenzó en un templo, comenzó en una pregunta profunda: ¿por qué nos cuesta tanto relacionarnos con nosotros mismos y con los demás desde el amor?"
          </motion.blockquote>
          <motion.ul variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            {["Psicóloga", "Psicoterapeuta", "Maestra Kundalini Yoga", "Terapia Transpersonal"].map((t) => (
              <li key={t} className={PILL}>{t}</li>
            ))}
          </motion.ul>
        </SplitHero>

        {/* Estadísticas */}
        <LandingSection tone="plain">
          <motion.ul {...inView} variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <motion.li key={label} variants={fadeUp} className="text-center space-y-1">
                <p className="font-serif text-4xl md:text-5xl text-[#795D64]">{value}</p>
                <p className="text-sm text-muted-foreground font-light leading-snug">{label}</p>
              </motion.li>
            ))}
          </motion.ul>
        </LandingSection>

        {/* Mi historia */}
        <LandingSection tone="plain">
          <div className="max-w-2xl mx-auto space-y-5 text-foreground/80 leading-relaxed font-light text-lg">
            <RevealTitle text="Mi Historia" className={H2 + " mb-4"} />
            <p>Hace más de 20 años inicié un viaje de búsqueda, transformación e integración. La psicología fue una de mis primeras respuestas… pero también una puerta hacia preguntas mucho más profundas sobre el sentido de la experiencia humana, el sufrimiento, la conciencia y la evolución personal.</p>
            <p>Mi formación profesional integra la Psicología, estudios en Gerencia del Talento Humano, Terapia Transpersonal de Pareja, más de 7 años de experiencia clínica como psicoterapeuta, y una trayectoria previa en trabajo social, comunitario y cooperación internacional, experiencias que ampliaron profundamente mi mirada sobre la humanidad.</p>
            <p>Viajar, acompañar comunidades diversas y observar distintas realidades me permitió comprender algo esencial: más allá de culturas, creencias, clases sociales o contextos, existe un anhelo profundamente humano de sanar, crecer, encontrar sentido, amar mejor y vivir con mayor coherencia.</p>
          </div>
        </LandingSection>

        <LandingSection tone="mauve" className="overflow-hidden">
          <RotatingOrnament className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 opacity-25" />
          <RevealWords stagger={0.04} className="relative max-w-3xl mx-auto text-center font-serif text-xl md:text-2xl font-light italic leading-relaxed text-foreground"
            text={'"Las experiencias personales, los procesos de transformación y los desafíos de mi propia historia me llevaron a profundizar cada vez más en caminos de autoconocimiento, espiritualidad y sabiduría ancestral."'} />
        </LandingSection>

        <LandingSection tone="plain">
          <div className="max-w-2xl mx-auto space-y-5 text-foreground/80 leading-relaxed font-light text-lg">
            <p>Fue allí donde el Yoga, la meditación, las prácticas contemplativas, las prácticas ancestrales se convirtieron no solo en herramientas, sino en una manera de habitar la vida.</p>
            <p>Como Maestra de Kundalini Yoga, he acompañado e impactado a cientos de personas de distintos lugares del mundo a través de esta poderosa tecnología de conciencia.</p>
            <p>Practico meditación desde hace más de ocho años y continúo recorriendo caminos de aprendizaje alrededor del mundo, explorando la historia espiritual de la humanidad y encontrándome con maestros, tradiciones y comunidades comprometidas con una búsqueda auténtica de servicio y evolución.</p>
          </div>
        </LandingSection>

        {/* Viajes */}
        <LandingSection tone="mauve">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <RevealTitle text="Un camino que cruza fronteras" className={H2} />
            <p className="text-muted-foreground font-light text-lg leading-relaxed">
              Mis viajes me han llevado a lugares profundamente simbólicos y transformadores, donde he seguido nutriendo una visión integradora entre psicología, espiritualidad, cuerpo, conciencia y propósito.
            </p>
            <ul className="flex flex-wrap justify-center gap-2 text-sm">
              {DESTINATIONS.map((d) => <li key={d} className={PILL}>{d}</li>)}
            </ul>
          </div>
        </LandingSection>

        {/* Hoy */}
        <LandingSection tone="plain">
          <div className="max-w-2xl mx-auto space-y-5 text-center">
            <RevealTitle text="Hoy, desde Santosha" className={H2} />
            <p className="text-foreground/80 leading-relaxed font-light text-lg">
              Acompaño procesos de transformación interior donde el Kundalini Yoga, la meditación, la psicología, la espiritualidad consciente y el trabajo profundo con el ser humano se unen para ayudar a las personas a vivir con más verdad, presencia, libertad y amor.
            </p>
          </div>
        </LandingSection>
        <LandingSection tone="peach">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-3xl mx-auto text-center space-y-3">
            <motion.p variants={fadeUp} className="font-serif text-lg md:text-xl italic text-foreground/80">
              "Porque creo profundamente que sanar no significa convertirse en alguien distinto."
            </motion.p>
            <motion.p variants={fadeUp} className="font-serif text-2xl md:text-4xl font-semibold text-foreground leading-snug">
              Significa recordar quién eres cuando vuelves a tu esencia.
            </motion.p>
          </motion.div>
        </LandingSection>

        {/* Formación */}
        <LandingSection tone="plain">
          <div className="space-y-8">
            <RevealTitle text="Formación Académica" className={H2} />
            <Timeline items={FORMATION.map((f) => ({ year: f.year, title: f.title, sub: `${f.institution} · ${f.country}` }))} />
          </div>
        </LandingSection>

        <LandingSection tone="mauve">
          <div className="space-y-8">
            <RevealTitle text="Cursos y Participaciones" className={H2} />
            <Timeline items={COURSES.map((c) => ({ year: c.year, title: c.title, sub: c.detail, role: c.role }))} />
          </div>
        </LandingSection>

        {/* CTA final */}
        <LandingSection id="quien-soy-contacto" tone="peach">
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
                <Link key={title} to={href} className="flex items-start gap-4 bg-card border border-border/40 rounded-3xl p-5 hover:border-primary/40 transition-colors group">
                  <Icon className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <p className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
                    <p className="text-sm text-muted-foreground font-light mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </motion.div>
            <motion.div variants={fadeUp}>
              <a href="https://wa.me/573105679517" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md transition-all bg-[#795D64] hover:bg-[#6A5057] text-white">
                <MessageCircle className="w-5 h-5" /> Escribirme por WhatsApp
              </a>
            </motion.div>
            <p className="text-xs text-muted-foreground">Sin compromiso · Te respondo personalmente.</p>
          </motion.div>
        </LandingSection>
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="quien-soy" />
    </div>
  );
};

export default QuienSoy;
