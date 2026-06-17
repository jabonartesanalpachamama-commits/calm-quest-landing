import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, HandHeart, Plane, Flower2, HeartHandshake, Sun, GraduationCap, Globe2, Moon, ShieldCheck, MessageCircle } from "lucide-react";
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
import santoshaLogo from "@/assets/santosha-logo.jpg";
import fransuryImage from "@/assets/fransury.jpg";

const FORMATION = [
  {
    year: "2024",
    title: "Terapeuta Transpersonal de Pareja",
    institution: "Escuela Española de Desarrollo Transpersonal y Universidad Miguel de Cervantes",
    country: "España",
  },
  {
    year: "2021",
    title: "Profesorado Kundalini Yoga",
    institution: "Happy Yoga Colombia, avalado por KRY International",
    country: "Colombia",
  },
  {
    year: "2013",
    title: "Especialista en Gerencia del Talento Humano",
    institution: "Universidad Manuela Beltrán",
    country: "Colombia",
  },
  {
    year: "2009",
    title: "Psicóloga",
    institution: "Universidad Cooperativa de Colombia",
    country: "Colombia",
  },
];

const COURSES = [
  {
    year: "2026",
    role: "Participante",
    title: "Diplomado en Yogaterapia",
    detail: "",
  },
  {
    year: "2026",
    role: "Participante",
    title: "Retiro Transpersonal: Cómo sanar el trauma y el dolor emocional",
    detail: "Colombia, Escuela Española de Desarrollo Transpersonal",
  },
  {
    year: "2024",
    role: "Participante",
    title: "Iniciación al Chamanismo",
    detail: "Inti Waka, Córdoba, Argentina",
  },
  {
    year: "2023",
    role: "Facilitadora",
    title: "Taller de Esencia Femenina y Yoga para Sanar el Útero",
    detail: "Portal Yoga, España",
  },
  {
    year: "2023",
    role: "Participante",
    title: "Taller de Meditación",
    detail: "Centro de Yoga Shadak Ramiro Calle, Madrid, España",
  },
  {
    year: "2023",
    role: "Participante",
    title: "Congreso: Egipto de Luz",
    detail: "El Cairo, Egipto",
  },
  {
    year: "2020",
    role: "Participante",
    title: "Claves para Atraer y Relacionarte con tu Pareja Ideal",
    detail: "Enric Corbera Institute",
  },
];

const DESTINATIONS = ["🇪🇬 Egipto", "🇲🇽 México", "🇦🇷 Argentina", "🇨🇭 Suiza", "🇪🇸 España", "🇮🇹 Italia"];

const STATS = [
  { value: "+20", label: "años recorriendo el camino del autoconocimiento" },
  { value: "+7", label: "años acompañando procesos terapéuticos" },
  { value: "+8", label: "años de práctica de meditación diaria" },
  { value: "100s", label: "de personas acompañadas alrededor del mundo" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const QuienSoy = () => {
  const [settings, setSettings] = useState<VisualIdentity | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((i) => i.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as VisualIdentity;
        }
      } catch { /* local fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = settings
    ? COLOR_PALETTES[settings.palette] || COLOR_PALETTES.menta
    : COLOR_PALETTES.menta;

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>

      <FloatingCTA
        formAnchor="#quien-soy-contacto"
        ctaText="Trabajar con Sury"
        subText="Acompañamiento consciente · Transformación real"
      />

      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO / PRESENTACIÓN ── */}
        <section className={`py-24 md:py-32 px-6 relative overflow-hidden ${palette.background} border-b border-border/10`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 -right-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center relative z-10">
            {/* Avatar placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center md:justify-end order-2 md:order-1"
            >
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 border-white shadow-xl relative bg-card">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500 z-10 rounded-[2rem]"></div>
                  <img src={fransuryImage} alt="Fransury González" className="w-full h-full object-cover" />
                </div>
                {/* Floating badge */}
                <div className={`absolute -bottom-4 -right-4 px-4 py-2 rounded-full text-xs font-semibold shadow-md ${palette.primary}`}>
                  Fundadora de Santosha
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 order-1 md:order-2"
            >
              <div className="space-y-1">
                <span className={`text-xs font-semibold tracking-wider uppercase ${palette.primaryText}`}>
                  Quién soy
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-foreground">
                  Hola, soy<br />
                  <span className={palette.primaryText}>Fransury González.</span>
                </h1>
                <p className="text-muted-foreground text-base font-light">
                  Aunque quienes han caminado conmigo desde hace años me llaman <strong className="text-foreground font-medium">Sury</strong>.
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed font-light">
                Soy psicóloga, psicoterapeuta, maestra de Kundalini Yoga, facilitadora de procesos de conciencia y una eterna estudiante del comportamiento y la Psique <em>(desde su raíz original: Alma)</em> humana.
              </p>

              <div className={`border-l-2 border-primary/30 pl-4 py-1`}>
                <p className="font-serif text-base italic text-foreground/80 leading-relaxed">
                  "Mi camino hacia la espiritualidad no comenzó en un templo, comenzó en una pregunta profunda: ¿por qué nos cuesta tanto relacionarnos con nosotros mismos y con los demás desde el amor?"
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Psicóloga", "Psicoterapeuta", "Maestra Kundalini Yoga", "Terapia Transpersonal"].map((tag) => (
                  <span key={tag} className={`text-xs px-3 py-1.5 rounded-full border font-medium ${palette.secondary} ${palette.secondaryText} border-transparent`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ESTADÍSTICAS ── */}
        <section className={`py-14 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center space-y-1">
                <p className={`font-serif text-3xl md:text-4xl font-bold ${palette.primaryText}`}>{value}</p>
                <p className="text-xs text-muted-foreground font-light leading-snug">{label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── MI HISTORIA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Leaf className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Mi Historia
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground leading-relaxed font-light text-base">
              <p>
                Hace más de 20 años inicié un viaje de búsqueda, transformación e integración. La psicología fue una de mis primeras respuestas… pero también una puerta hacia preguntas mucho más profundas sobre el sentido de la experiencia humana, el sufrimiento, la conciencia y la evolución personal.
              </p>
              <p>
                Mi formación profesional integra la Psicología, estudios en Gerencia del Talento Humano, Terapia Transpersonal de Pareja, más de 7 años de experiencia clínica como psicoterapeuta, y una trayectoria previa en trabajo social, comunitario y cooperación internacional, experiencias que ampliaron profundamente mi mirada sobre la humanidad.
              </p>
              <p>
                Viajar, acompañar comunidades diversas y observar distintas realidades me permitió comprender algo esencial: más allá de culturas, creencias, clases sociales o contextos, existe un anhelo profundamente humano de sanar, crecer, encontrar sentido, amar mejor y vivir con mayor coherencia.
              </p>

              <div className={`rounded-3xl ${palette.secondary} p-6 space-y-3`}>
                <p className={`font-serif text-base md:text-lg font-light italic leading-relaxed ${palette.secondaryText}`}>
                  "Las experiencias personales, los procesos de transformación y los desafíos de mi propia historia me llevaron a profundizar cada vez más en caminos de autoconocimiento, espiritualidad y sabiduría ancestral."
                </p>
              </div>

              <p>
                Fue allí donde el Yoga, la meditación, las prácticas contemplativas, las prácticas ancestrales se convirtieron no solo en herramientas, sino en una manera de habitar la vida.
              </p>
              <p>
                Como Maestra de Kundalini Yoga, he acompañado e impactado a cientos de personas de distintos lugares del mundo a través de esta poderosa tecnología de conciencia.
              </p>
              <p>
                Practico meditación desde hace más de ocho años y continúo recorriendo caminos de aprendizaje alrededor del mundo, explorando la historia espiritual de la humanidad y encontrándome con maestros, tradiciones y comunidades comprometidas con una búsqueda auténtica de servicio y evolución.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── VIAJES ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Plane className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Un camino que cruza fronteras
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto text-sm leading-relaxed">
                Mis viajes me han llevado a lugares profundamente simbólicos y transformadores, donde he seguido nutriendo una visión integradora entre psicología, espiritualidad, cuerpo, conciencia y propósito.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {DESTINATIONS.map((dest) => (
                <span
                  key={dest}
                  className="bg-card border border-border/50 rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  {dest}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── GRATITUD ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <HandHeart className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Con profunda gratitud
              </h2>
            </div>

            <div className="space-y-5">
              <div className="bg-card border border-border/50 rounded-3xl p-7 space-y-3">
                <div className="flex items-start gap-4">
                  <Flower2 className="w-8 h-8 text-primary shrink-0" />
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Maria Elena Badillo</p>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      Reconozco con profunda gratitud la guía de mi maestra, mentora, amiga y hermana de alma, quien ha sido una inspiración esencial para recordar que nuestros dones y talentos pueden ponerse verdaderamente al servicio de una nueva humanidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-3xl p-7 space-y-3">
                <div className="flex items-start gap-4">
                  <HeartHandshake className="w-8 h-8 text-primary shrink-0" />
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Mi terapeuta y guías del camino</p>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      También a mi terapeuta, que por más de 10 años me ha acompañado, y los diferentes guías y exponentes con los que he tenido la posibilidad de compartir y ser parte de las formaciones que imparten.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── HOY — SANTOSHA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
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
                Hoy, desde Santosha
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed font-light text-base text-center max-w-2xl mx-auto">
              Acompaño procesos de transformación interior donde el Kundalini Yoga, la meditación, la psicología, la espiritualidad consciente y el trabajo profundo con el ser humano se unen para ayudar a las personas a vivir con más verdad, presencia, libertad y amor.
            </p>

            <div className={`rounded-3xl p-8 space-y-4 text-center ${palette.secondary}`}>
              <p className={`font-serif text-base font-light italic leading-relaxed ${palette.secondaryText}`}>
                "Porque creo profundamente que sanar no significa convertirse en alguien distinto."
              </p>
              <p className={`font-serif text-xl font-semibold ${palette.secondaryText}`}>
                Significa recordar quién eres cuando vuelves a tu esencia.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── FORMACIÓN ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <GraduationCap className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Formación Académica
              </h2>
            </div>

            <div className="space-y-4">
              {FORMATION.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, delay: idx * 0.08 } } }}
                  className="flex items-start gap-5 bg-card border border-border/50 rounded-3xl p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-bold text-sm ${palette.secondary} ${palette.secondaryText}`}>
                    {item.year}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-foreground leading-snug">{item.title}</p>
                    <p className="text-sm text-muted-foreground font-light">{item.institution}</p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {item.country}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CURSOS Y PARTICIPACIONES ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3">
              <Globe2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Cursos y Participaciones
              </h2>
            </div>

            <div className="space-y-3">
              {COURSES.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: idx * 0.07 } } }}
                  className="flex items-start gap-4 bg-card border border-border/40 rounded-2xl px-5 py-4 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${palette.secondary} ${palette.secondaryText}`}>
                      {item.year}
                    </span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground font-light">{item.detail}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CTA FINAL ── */}
        <section id="quien-soy-contacto" className={`py-24 md:py-32 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Leaf className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Quieres caminar conmigo?
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-lg max-w-xl mx-auto">
                Si algo de lo que leíste resonó en ti, me alegra. Eso ya es el comienzo de algo.
              </p>
            </div>

            {/* Programs */}
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                {
                  icon: <Moon className="w-6 h-6 text-primary shrink-0" />,
                  title: "Curso de Iniciación al Yoga",
                  desc: "6 módulos · Encuentros bimensuales · 100% Virtual",
                  href: "/curso-iniciacion-yoga",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-primary shrink-0" />,
                  title: "Santosha Somático®",
                  desc: "Del Sobrevivir al Habitar · 3 módulos · Virtual",
                  href: "/santosha-somatico",
                },
              ].map(({ icon, title, desc, href }) => (
                <Link
                  key={title}
                  to={href}
                  className="flex items-start gap-4 bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all duration-300 group"
                >
                  {icon}
                  <div>
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{title}</p>
                    <p className="text-xs text-muted-foreground font-light mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <a
              href="https://wa.link/1yymd8"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              <MessageCircle className="w-5 h-5" /> Escribirme por WhatsApp
            </a>

            <p className="text-xs text-muted-foreground">
              Sin compromiso · Te respondo personalmente
            </p>
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
            <Link to="/" className="hover:underline text-xs text-muted-foreground/70 transition-colors">
              ← Inicio
            </Link>
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">
              Curso de Iniciación
            </Link>
            <Link to="/santosha-somatico" className="hover:underline text-xs text-muted-foreground/70 transition-colors">
              Santosha Somático®
            </Link>
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">
              🔑 Administrador
            </Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="quien-soy" />
    </div>
  );
};

export default QuienSoy;
