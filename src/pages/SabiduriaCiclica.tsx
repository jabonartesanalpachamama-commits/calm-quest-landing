import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Leaf, Sparkles, Sun, MessageCircle, Moon, CalendarDays, Clock, Video, Tag } from "lucide-react";
import { Helmet } from "react-helmet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import fransuryImage from "@/assets/fransury_portal.webp";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";

const LEARNING_POINTS = [
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Comprender tu naturaleza cíclica y las cuatro fases que habitan tu experiencia femenina.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Reconocer tus propios patrones emocionales, energéticos y corporales, entendiendo cómo se expresa tu ciclo en tu vida cotidiana.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Desarrollar herramientas prácticas de observación y autoconocimiento, para interpretar las señales de tu cuerpo con mayor claridad y compasión.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Transformar tu relación con tu ciclo y tu menstruación, dejando atrás la desconexión, la culpa o la lucha constante.",
  },
  {
    icon: <Flower2 className="w-5 h-5 text-primary" />,
    text: "Organizar tus semanas según tu energía: saber cuándo te conviene hacer más y cuándo te conviene bajar el ritmo.",
  },
];

const CUPO_URL = getWhatsAppUrl("Hola Fransu, quiero mi cupo para el taller Sabiduría Cíclica del 17 de octubre");
const DUDA_URL = getWhatsAppUrl("Hola Fransu, tengo una pregunta sobre el taller Sabiduría Cíclica");

// Precio de lanzamiento vigente hasta el 10 de octubre de 2026 23:59 hora Colombia (UTC-5)
const LAUNCH_DEADLINE = new Date("2026-10-11T00:00:00-05:00").getTime();
const isLaunchPrice = () => Date.now() < LAUNCH_DEADLINE;

const TESTIMONIOS = [
  { name: "Goretti", country: "México", quote: "Gracias por ser nuestra guía de amor y sanación. Estuvo intenso, pero muy mágico y de tanta conciencia. Gracias por hacer este tipo de talleres." },
  { name: "Martha G.", country: "Estados Unidos", quote: "Nunca me había puesto a pensar en mi periodo de esa manera. Es mucha información para entender, procesar e integrar, y me di cuenta de lo descuidada que había sido conmigo misma. Gracias." },
  { name: "Verónica I.", country: "México", quote: "Terminamos cansadas, pero felices. Aprendí mucho sobre un tema que no tenía tan presente y del que hoy tomo conciencia. Gracias por ser mi guía." },
];

const FAQS = [
  { q: "¿Necesito experiencia previa?", a: "No. El taller está pensado para cualquier mujer que quiera comprender su ciclo, sin importar si ha practicado yoga o no." },
  { q: "¿Qué necesito para conectarme?", a: "Un celular o computador con internet, un lugar tranquilo, un cuaderno y, si la conoces, la fecha de tu última menstruación." },
  { q: "Tomo anticonceptivos, mis ciclos son irregulares o estoy en perimenopausia. ¿Es para mí?", a: "Escríbeme antes de inscribirte y lo revisamos juntas según tu caso." },
  { q: "¿Cómo pago?", a: "Al escribirme por WhatsApp te comparto los medios de pago. Desde Colombia pagas en pesos a la tasa del día." },
];

const INCLUYE = [
  "Taller en vivo de 4 horas por Google Meet",
  "Las cuatro fases del ciclo y cómo se expresan en tu cuerpo, tu energía y tus emociones",
  "Herramientas prácticas para observar y registrar tu ciclo",
  "Espacio de círculo para compartir y hacer preguntas",
];

const SabiduriaCiclica = () => {
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

  const launch = isLaunchPrice();
  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col`}>

      <Helmet>
        <title>Sabiduría Cíclica | Taller en vivo 17 de octubre | SantoSha</title>
        <meta name="description" content="Taller en vivo con Fransury González, psicóloga y maestra de Kundalini Yoga: entiende las cuatro fases de tu ciclo. Sábado 17 de octubre, 10 a. m. a 2 p. m. (Colombia), por Google Meet." />
      </Helmet>


      {/* ── HEADER ── */}
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">

        {/* ── HERO BANNER ── */}
        <section className={`pt-12 md:pt-20 px-4 md:px-6 relative overflow-hidden ${palette.background}`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-[1672px] mx-auto relative z-10">
            <h1 className="sr-only">Sabiduría Cíclica, Esencia Femenina</h1>
            <motion.div 
              className="w-full max-w-[560px] mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/20"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/sabiduria-ciclica-17oct.webp" 
                alt="Taller Sabiduría Cíclica, sábado 17 de octubre, 4 horas en vivo por Google Meet" 
                width={1254}
                height={1254}
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto block"
              />
            </motion.div>
          </div>
        </section>

        {/* ── HERO CTA ── */}
        <section className={`py-10 md:py-14 px-6 text-center relative z-10 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <span className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full ${palette.secondary} ${palette.secondaryText}`}>
              <Flower2 className="w-4 h-4 text-primary" /> Taller en vivo · Sábado 17 de octubre · Virtual
            </span>

            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
              Un encuentro en vivo para entender las cuatro fases de tu ciclo y lo que tu cuerpo te dice en cada una.
            </p>

            <div className="grid grid-cols-2 gap-3 text-left text-sm">
              {[
                { icon: <CalendarDays className="w-4 h-4 text-primary shrink-0 mt-0.5" />, text: "Sábado 17 de octubre de 2026" },
                { icon: <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />, text: <>10:00 a. m. a 2:00 p. m. hora Colombia <span className="block text-xs text-muted-foreground">9:00 a. m. Ciudad de México · 11:00 a. m. Miami/Nueva York</span></> },
                { icon: <Video className="w-4 h-4 text-primary shrink-0 mt-0.5" />, text: "4 horas en vivo por Google Meet" },
                { icon: <Tag className="w-4 h-4 text-primary shrink-0 mt-0.5" />, text: launch ? <>USD 60 <span className="line-through text-muted-foreground">USD 75</span><span className="block text-xs text-muted-foreground">Lanzamiento hasta el 10 de octubre</span></> : "USD 75" },
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-2 bg-card border border-border/40 rounded-2xl px-3 py-3 text-foreground">
                  {d.icon}<div>{d.text}</div>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <a
                href="#ciclica-precio"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#ciclica-precio")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
              >
                Quiero mi cupo <Leaf className="w-4 h-4 text-primary-foreground ml-1" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── INTRODUCCIÓN DILUIDA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-10"
          >
            <div className="bg-card border border-border/40 rounded-3xl p-8 md:p-10 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl md:text-2xl text-center font-light italic leading-relaxed text-foreground/95">
                "¿Y si aquello que has interpretado como confusión, cansancio, sensibilidad intensa, desconexión o contradicción… fuera en realidad un lenguaje profundo de tu cuerpo intentando hablarte?"
              </h3>
              <div className="h-px bg-border/40 w-24 mx-auto" />
              <p className="text-muted-foreground leading-relaxed text-base font-light text-center">
                Vivimos en una cultura que nos enseñó a funcionar de forma lineal, constante y productiva, desconectándonos de una verdad esencial: <strong className="text-foreground font-medium">la mujer es cíclica por naturaleza.</strong>
              </p>
            </div>

            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                <strong className="text-foreground font-medium">Sabiduría Cíclica, Esencia Femenina</strong> es un viaje de autoconocimiento, conciencia corporal y reconexión profunda con tu ritmo interno.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                Un espacio donde aprenderás a ver tu ciclo no como algo que hay que aguantar cada mes, sino como información valiosa sobre tu energía, tu ánimo y lo que necesitas.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── PERSPECTIVA DE SURY ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <Flower2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                El Origen del Curso
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-base text-center max-w-2xl mx-auto">
              <p>
                Desde mi experiencia clínica, terapéutica y vivencial, he acompañado a muchas mujeres que viven alejadas de su cuerpo, peleadas con su menstruación, con sus cambios hormonales o peor aún en desconocimiento de estos, confundidas por sus cambios emocionales o desconectadas de su intuición natural.
              </p>
              <p className={`font-serif text-lg font-medium ${palette.primaryText} italic`}>
                Este curso nace para abrir un camino distinto: uno donde puedas comprenderte, escucharte y volver a ti.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── QUIÉN TE GUÍA ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center"
          >
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-border/10 max-w-sm mx-auto w-full">
              <img src={fransuryImage} alt="Fransury González" loading="lazy" className="w-full h-auto object-cover" />
            </div>
            <div className="space-y-5 text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">Quién te guía</h2>
              <p className="text-muted-foreground leading-relaxed font-light text-base">
                Soy Fransury González (Sury), psicóloga y maestra de Kundalini Yoga. En mi consulta he acompañado a muchas mujeres que viven peleadas con su ciclo o sin entenderlo. Este taller reúne lo que he aprendido desde la psicología y el yoga para que puedas escucharte con más claridad y compasión.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── QUÉ APRENDERÁS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <div className="max-w-3xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="space-y-10"
              >
                <div className="space-y-3 text-center">
                  <Sparkles className="w-10 h-10 text-primary mb-2 mx-auto" />
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                    En este viaje aprenderás a:
                  </h2>
                </div>

                <div className="space-y-4">
                  {LEARNING_POINTS.map(({ icon, text }, idx) => (
                    <motion.div
                      key={text}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: idx * 0.08 } } }}
                      className="flex items-start gap-4 bg-background/50 backdrop-blur-sm border border-border/40 rounded-2xl px-6 py-6 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className={`shrink-0 leading-none mt-0.5 group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
                      <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
          </div>
        </section>

        {/* ── MENSAJE MAGNÉTICO ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Sun className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-2xl md:text-3xl font-light italic text-foreground">
                "Tu ciclo no está en tu contra.<br />
                Tu cuerpo no es un problema que debas corregir."
              </h2>
            </div>


            <div className={`rounded-3xl p-6 inline-block ${palette.secondary}`}>
              <p className={`font-serif text-base md:text-lg font-semibold tracking-wide ${palette.secondaryText}`}>
                Vuelve a tu ritmo. Vuelve a tu cuerpo. Vuelve a tu esencia.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── NOTA DE CIERRE ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <div className="max-w-3xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="space-y-8 text-center bg-background/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-border/40 shadow-sm"
              >
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light">
                  Hablaremos de menstruación, pero sobre todo de ti: de cómo cambian tu energía, tu ánimo y tu forma de relacionarte a lo largo del mes.
                </p>
                <div className="space-y-3 font-serif text-2xl md:text-3xl font-medium text-foreground">
                  <p>Tu ciclo tiene mensajes.</p>
                </div>
                <div className="pt-4 border-t border-border/20">
                  <p className={`font-serif text-2xl md:text-3xl font-bold ${palette.primaryText}`}>
                    ¿Estás lista para volver a escucharte?
                  </p>
                </div>
              </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.background} border-b border-border/10`}>
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center">
              Lo que dicen quienes ya vivieron el taller
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIOS.map((t) => (
                <div key={t.name} className="bg-card rounded-2xl p-6 md:p-8 border border-border/60 flex flex-col">
                  <blockquote className="font-serif text-foreground/90 leading-relaxed italic flex-grow">"{t.quote}"</blockquote>
                  <p className="mt-5 text-sm font-semibold text-foreground">{t.name} <span className="font-normal text-muted-foreground">· {t.country}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INVERSIÓN ── */}
        <section id="ciclica-precio" className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10 scroll-mt-24`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="text-center space-y-3 mb-10">
              <Flower2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                Tu inversión
              </h2>
            </div>

            <div className="max-w-md mx-auto">
              <div className={`bg-gradient-to-br ${palette.primary} rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-lg border-2 border-white/20`}>
                <div className="space-y-4 text-center text-white mt-2">
                  <h3 className="font-serif text-2xl font-semibold">Taller Sabiduría Cíclica</h3>
                  {launch && (
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Precio de lanzamiento hasta el 10 de octubre</p>
                  )}
                  <div className="flex justify-center items-baseline gap-3">
                    <span className="text-5xl font-bold">USD {launch ? 60 : 75}</span>
                    {launch && <span className="text-xl line-through opacity-70">USD 75</span>}
                  </div>
                  <div className="text-sm font-light opacity-90 space-y-1">
                    <p>Ven con una amiga: si se inscriben dos juntas, cada una paga USD 60.</p>
                    <p>Desde Colombia pagas en pesos a la tasa del día.</p>
                  </div>
                </div>
                <div className="mt-8 space-y-4 flex-grow border-t border-white/20 pt-6">
                  {INCLUYE.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 text-white">
                      <Flower2 className="w-5 h-5 opacity-90 shrink-0" />
                      <span className="text-sm leading-relaxed font-medium opacity-90">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <a 
                    href={CUPO_URL}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`block w-full py-4 text-center rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-primary hover:bg-white/90`}
                  >
                    Quiero mi cupo
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── PREGUNTAS FRECUENTES ── */}
        <section className={`py-20 md:py-28 px-6 ${palette.cardBackground} border-b border-border/10`}>
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center">Preguntas frecuentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-xs text-muted-foreground text-center">
              Este taller no reemplaza la atención ginecológica ni médica. Si tienes un diagnóstico, sigue las indicaciones de tu médico.
            </p>
          </div>
        </section>

        {/* ── CTA FINAL / CONTACTO ── */}
        <section id="ciclica-contacto" className={`py-24 md:py-32 px-6 ${palette.background} border-b border-border/10`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <Flower2 className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                ¿Tienes alguna duda antes de inscribirte?
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-lg max-w-xl mx-auto">
                Escríbeme y te respondo personalmente.
              </p>
            </div>

            <a
              href={DUDA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${palette.primary}`}
            >
              <MessageCircle className="w-5 h-5" /> Escribirle a Sury
            </a>


            <div className="flex flex-wrap justify-center gap-5 pt-2">
              {["Femenino & Cíclico", "100% Virtual", "Comunidad de apoyo", "Guiado por Fransury González, psicóloga y maestra de Kundalini Yoga"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>

            {/* Otros programas */}
            <div className="pt-6 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Explorar otros espacios
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/curso-iniciacion-yoga"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-3 rounded-full hover:border-primary/30"
                >
                  <Moon className="w-4 h-4" /> Curso de Iniciación al Yoga
                </Link>
                <Link
                  to="/acompanamiento-individual"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-card border border-border/40 px-5 py-3 rounded-full hover:border-primary/30"
                >
                  <Leaf className="w-4 h-4" /> Acompañamiento 1:1
                </Link>
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
            <Link to="/filosofia" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Filosofía</Link>
            <Link to="/curso-iniciacion-yoga" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Curso de Iniciación</Link>
            <Link to="/acompanamiento-individual" className="hover:underline text-xs text-muted-foreground/70 transition-colors">Acompañamiento 1:1</Link>
            <Link to="/terminos-y-condiciones" className="hover:underline text-xs text-muted-foreground/60 transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </footer>

      <AiChatWidget pageSlug="sabiduria-ciclica" />
    </div>
  );
};

export default SabiduriaCiclica;
