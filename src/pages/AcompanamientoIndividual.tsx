import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, User, Leaf, Search, Sparkles, Zap, Sun, MessageCircle, Smartphone, Clock, Calendar, Users, Moon } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import NextSteps from "@/components/NextSteps";
import Quote from "@/components/landing/Quote";
import { faqJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import paraQuienImage from "@/assets/para-quien-image.webp";
import { DrawLine, RevealImage } from "@/components/landing/ScrollReveal";
import { fadeUp, inView, RevealTitle, PriceCard, PriceCardLight } from "@/components/landing";

// Estructura "recorrido": hero invertido con imagen en arco a la derecha.
const HERO_IMAGE = paraQuienImage;

const BTN_SOLID = "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-[#795D64] hover:bg-[#6A5057] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
const H2 = "font-serif text-3xl md:text-4xl font-semibold text-foreground";
const WA_URL = getWhatsAppUrl("Hola Fransury, quiero información sobre las sesiones 1 a 1 de yoga y meditación.");

const SERVICES = [
  {
    icon: User,
    title: "Clases Privadas de Kundalini Yoga y Meditación",
    desc: "Diseñadas según tu proceso personal, intención terapéutica o camino espiritual.",
    tags: ["1 a 1", "Personalizada", "Virtual"],
    bg: "bg-gradient-to-br from-warm-mauve/70 via-warm-mauve/25 to-card",
  },
  {
    icon: Leaf,
    title: "Procesos de Acompañamiento Integrativo",
    desc: "Programas de varias sesiones orientados a profundizar en objetivos específicos de regulación, autoconocimiento, integración emocional o transformación humana.",
    tags: ["Multi-sesión", "Integrativo", "Virtual"],
    bg: "bg-gradient-to-br from-warm-peach/90 via-warm-peach/35 to-card",
  },
];

const FOR_WHOM = [
  "Quieres profundizar en tu camino de autoconocimiento.",
  "Necesitas fortalecer tus recursos internos y tu conciencia corporal.",
  "Estás atravesando un proceso emocional o un momento de transición.",
  "Buscas una práctica espiritual más consciente.",
  "Vives en modo supervivencia y quieres una relación más coherente, presente y compasiva con tu vida.",
];

const WHAT_CULTIVATES = [
  { icon: Search, label: "Claridad" },
  { icon: Zap, label: "Regulación interna" },
  { icon: Sun, label: "Autoconocimiento" },
  { icon: Sparkles, label: "Conexión espiritual" },
  { icon: Leaf, label: "Coherencia con tu esencia" },
];

const STEPS = [
  { title: "Conversación inicial", desc: "Nos conocemos, comprendes el espacio y evaluamos juntos qué proceso se adapta mejor a tu momento." },
  { title: "Diseño personalizado", desc: "Adaptamos el formato, la frecuencia y la intención de cada sesión a tu historia y objetivos." },
  { title: "Acompañamiento continuo", desc: "Sesiones 1:1 con seguimiento, recursos entre encuentros y ajustes según tu proceso." },
];

const KEY_INFO = [
  { icon: Smartphone, label: "Modalidad", value: "100% Virtual" },
  { icon: Clock, label: "Duración", value: "Por sesión acordada" },
  { icon: Calendar, label: "Frecuencia", value: "Adaptable a ti" },
  { icon: Users, label: "Formato", value: "1 a 1 exclusivo" },
];

const FAQS = [
  { q: "¿Las sesiones son presenciales?", a: "No. Todas son virtuales, por videollamada. Puedes conectarte desde donde estés." },
  { q: "¿Necesito saber yoga o meditar?", a: "No. La práctica se adapta a tu nivel y a tu momento." },
  { q: "¿Cuánto dura cada sesión?", a: "La duración se acuerda contigo antes de empezar." },
  { q: "¿Cómo pago?", a: "Escríbeme por WhatsApp y coordinamos el pago." },
];

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Yoga y meditación 1:1",
  serviceType: "Clases privadas de Kundalini Yoga y meditación",
  provider: { "@type": "Person", name: "Fransury Gonzáles" },
  offers: [
    { "@type": "Offer", name: "1 sesión", price: "17", priceCurrency: "USD" },
    { "@type": "Offer", name: "8 sesiones", price: "116", priceCurrency: "USD" },
  ],
};

const Benefits = ({ items, light }: { items: string[]; light?: boolean }) => (
  <ul className="space-y-3 text-left">
    {items.map((b) => (
      <li key={b} className="flex items-start gap-3">
        <Leaf className={`w-4 h-4 mt-0.5 shrink-0 ${light ? "text-primary" : "text-white"}`} />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const stagger = (s = 0.08) => ({ show: { transition: { staggerChildren: s } } });

const AcompanamientoIndividual = () => {
  const { settings, palette } = useVisualSettings();

  const goPrecios = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#precios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} relative flex flex-col pb-20 md:pb-0`}>
      <Seo
        title="Yoga y meditación 1:1 online | SantoSha"
        description="Clases privadas de Kundalini Yoga y meditación 1 a 1 con Fransury Gonzáles, por videollamada."
        path="/acompanamiento-individual"
        jsonLd={[SERVICE_JSONLD, faqJsonLd(FAQS)]}
      />
      <FloatingCTA scrollTo="#precios" ctaText="Reservar sesión" subText="Yoga y meditación 1:1" />
      <Header palette={palette} brandName={settings?.brandName} />

      <main className="flex-grow">
        {/* HERO invertido: texto izquierda, arco derecha */}
        <section className="px-6 pt-10 pb-14 md:pt-16 md:pb-20 bg-gradient-to-b from-warm-peach/45 to-background overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-14 items-center">
            <motion.div initial="hidden" animate="show" variants={stagger(0.1)} className="space-y-6 order-2 md:order-1 min-w-0">
              <motion.span variants={fadeUp} className="inline-flex px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-card text-[#795D64]">
                Sesiones 1 a 1 · Virtual
              </motion.span>
              <RevealTitle as="h1" text="Yoga y meditación 1:1" className="font-serif text-4xl md:text-6xl font-semibold leading-[1.05] text-foreground" />
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                YogaTerapia, Kundalini Yoga y Meditación
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
                <a href="#precios" onClick={goPrecios} className={BTN_SOLID + " group"}>
                  Quiero saber más
                  <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
                </a>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#795D64] underline decoration-brand-gold underline-offset-4 hover:opacity-80">
                  Escríbeme por WhatsApp
                </a>
              </motion.div>
              <motion.ul variants={fadeUp} className="-mx-6 px-6 md:mx-0 md:px-0 flex gap-2 overflow-x-auto md:flex-wrap snap-x pb-2 text-sm">
                {WHAT_CULTIVATES.map(({ icon: Icon, label }) => (
                  <li key={label} className="snap-start shrink-0 h-10 flex items-center gap-2 whitespace-nowrap bg-card border border-border/40 rounded-full px-3.5">
                    <Icon className="w-4 h-4 text-primary" /> {label}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="order-1 md:order-2">
              <RevealImage src={HERO_IMAGE} alt="Postura de yoga durante una sesión de acompañamiento" eager imgClassName="object-cover object-center"
                className="mx-auto w-full max-w-[22rem] md:max-w-md aspect-[4/5] rounded-t-full rounded-b-3xl shadow-xl ring-1 ring-brand-gold/40" />
            </motion.div>
          </div>
        </section>

        {/* Qué es */}
        <section className="px-6 py-12 md:py-14">
          <motion.div {...inView} variants={stagger(0.1)} className="max-w-3xl mx-auto text-center space-y-5">
            <RevealTitle text="¿Deseas un proceso personalizado?" className={H2} />
            <motion.p variants={fadeUp} className="text-lg text-foreground/80 leading-relaxed font-light">
              Te acompaño 1 a 1 en clases privadas donde el <strong className="text-foreground font-semibold">Kundalini Yoga</strong>, la <strong className="text-foreground font-semibold">meditación</strong> y la <strong className="text-foreground font-semibold">conciencia corporal</strong> se ponen al servicio de tu transformación humana.
            </motion.p>
          </motion.div>
        </section>

        {/* Qué ofrezco */}
        <section className="px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Qué ofrezco?" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Dos modalidades de acompañamiento, ambas adaptadas a tu proceso.</p>
            </div>
            <motion.div {...inView} variants={stagger(0.12)} className="grid md:grid-cols-2 gap-6">
              {SERVICES.map(({ icon: Icon, title, desc, tags, bg }) => (
                <motion.div key={title} variants={fadeUp} className={`${bg} rounded-[2rem] p-8 md:p-10 min-h-[22rem] flex flex-col gap-5 border border-border/30`}>
                  <span className="w-16 h-16 rounded-2xl bg-card/80 flex items-center justify-center">
                    <Icon className="w-9 h-9 text-[#795D64]" strokeWidth={1.4} />
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground leading-snug">{title}</h3>
                  <p className="text-base text-foreground/75 font-light leading-relaxed flex-grow">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-card/80 text-[#795D64]">{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Quote variant="ornament" cite="Procesos adaptados a tu momento vital, tu historia y tu camino personal.">
          Un espacio diseñado para ayudarte a cultivar mayor claridad, regulación interna, autoconocimiento, conexión espiritual y coherencia con tu esencia.
        </Quote>

        {/* Cómo funciona: línea de tiempo vertical */}
        <section className="px-6 py-14 md:py-16 bg-brand-cream/60">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <RevealTitle text="¿Cómo funciona?" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Un proceso simple, claro y completamente a tu medida.</p>
            </div>
            <motion.ol {...inView} variants={stagger(0.15)} className="relative max-w-2xl mx-auto">
              <span aria-hidden="true" className="absolute left-[1.6rem] md:left-[2.1rem] top-4 bottom-4 w-px bg-brand-gold/20" />
              <DrawLine vertical className="absolute left-[1.6rem] md:left-[2.1rem] top-4 bottom-4 w-px" />
              {STEPS.map(({ title, desc }, i) => (
                <motion.li key={title} variants={fadeUp} className="group/step relative grid grid-cols-[3.25rem_1fr] md:grid-cols-[4.25rem_1fr] gap-5 pb-10 last:pb-0">
                  <motion.span initial={{ backgroundColor: "hsl(var(--brand-cream))", color: "#795D64" }}
                    whileInView={{ backgroundColor: "#795D64", color: "hsl(var(--brand-cream))" }} viewport={{ margin: "0px 0px -45% 0px" }} transition={{ duration: 0.5 }}
                    className="relative z-10 w-[3.25rem] h-[3.25rem] md:w-[4.25rem] md:h-[4.25rem] rounded-full bg-brand-cream border border-brand-gold flex items-center justify-center font-serif text-3xl md:text-4xl text-[#795D64]">
                    {i + 1}
                  </motion.span>
                  <div className="pt-2 md:pt-3">
                    <p className="font-serif text-2xl font-semibold text-foreground">{title}</p>
                    <p className="text-base text-muted-foreground font-light leading-relaxed mt-1">{desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
            <motion.ul {...inView} variants={stagger()} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {KEY_INFO.map(({ icon: Icon, label, value }) => (
                <motion.li key={label} variants={fadeUp} className="bg-card rounded-2xl p-5 text-center space-y-2 border border-border/40">
                  <Icon className="w-6 h-6 text-[#795D64] mx-auto" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="font-serif text-lg md:text-xl font-semibold text-foreground leading-tight">{value}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Para quién: chips grandes */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8 text-center">
            <RevealTitle text="¿Para quién es este espacio?" className={H2} />
            <motion.ul {...inView} variants={stagger(0.07)} className="flex flex-wrap justify-center gap-3">
              {FOR_WHOM.map((item) => (
                <motion.li key={item} variants={fadeUp}
                  className="px-6 py-4 rounded-full border border-[#795D64]/30 bg-warm-mauve/20 text-base md:text-lg text-foreground/90 leading-snug max-w-full">
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="scroll-mt-24 px-6 py-14 md:py-16 bg-gradient-to-b from-background via-warm-peach/35 to-background">
          <motion.div {...inView} variants={stagger(0.1)} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <RevealTitle text="Tu inversión" className={H2} />
              <p className="text-muted-foreground font-light text-lg">Elige el plan que mejor acompañe tu proceso</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-3">
              <PriceCardLight
                title="1 Sesión"
                price="17"
                href={getWhatsAppUrl("Hola, me gustaría agendar 1 Sesión de Acompañamiento.")}
                description={<>
                  <p>Pago por cada sesión individual</p>
                  <Benefits light items={["Duración según lo acordado", "Atención 100% personalizada", "Sin compromisos a largo plazo", "Enfoque en temas específicos"]} />
                </>}
                cta="Inscribirme a 1 Sesión"
              />
              <PriceCard
                badge="15% de descuento"
                title="Mensualidad"
                price="116"
                href={getWhatsAppUrl("Hola, me gustaría inscribirme a la Mensualidad de Acompañamiento.")}
                description={<>
                  <p>Paquete de 8 sesiones</p>
                  <Benefits items={["8 Sesiones adaptables a tu ritmo", "Seguimiento constante de tu progreso", "Recursos y herramientas entre sesiones", "Ideal para procesos de transformación humana"]} />
                </>}
                cta="Inscribirme a la Mensualidad"
              />
            </div>
          </motion.div>
        </section>

        {/* FAQ en tarjetas 2x2 */}
        <section className="px-6 py-14 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <RevealTitle text="Preguntas frecuentes" className={H2 + " text-center"} />
            <motion.dl {...inView} variants={stagger()} className="grid md:grid-cols-2 gap-5">
              {FAQS.map((f) => (
                <motion.div key={f.q} variants={fadeUp} className="rounded-3xl bg-card border border-border/50 p-6 md:p-7 space-y-2">
                  <dt className="font-serif text-xl font-semibold text-foreground">{f.q}</dt>
                  <dd className="text-base text-muted-foreground leading-relaxed">{f.a}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* Cierre */}
        <section id="individual-contacto" className="px-6 pb-4">
          <motion.div {...inView} variants={stagger(0.1)}
            className="max-w-5xl mx-auto rounded-[2.5rem] border border-brand-gold/50 bg-card grid md:grid-cols-[1.4fr_1fr] gap-8 p-8 md:p-12 items-center">
            <div className="space-y-4 text-center md:text-left">
              <RevealTitle text="Reserva tu sesión" className={H2} />
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground font-light leading-relaxed">
                Cuéntame qué necesitas y lo conversamos. El primer paso es simplemente llegar.
              </motion.p>
              <motion.div variants={fadeUp}>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={BTN_SOLID}>
                  <MessageCircle className="w-5 h-5" /> Escríbeme por WhatsApp
                </a>
              </motion.div>
              <p className="text-xs text-muted-foreground">Te respondo personalmente.</p>
            </div>
            <motion.div variants={fadeUp} className="md:border-l md:border-border/50 md:pl-8 space-y-3 text-center md:text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">¿Buscas un programa grupal?</p>
              <Link to="/curso-iniciacion-yoga" className="group inline-flex items-center gap-2 font-serif text-xl text-foreground hover:text-[#795D64] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm">
                <Moon className="w-5 h-5 text-[#795D64]" /> Curso de Iniciación al Yoga
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <NextSteps exclude="/acompanamiento-individual" />
      </main>

      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="acompanamiento-individual" />
    </div>
  );
};

export default AcompanamientoIndividual;
