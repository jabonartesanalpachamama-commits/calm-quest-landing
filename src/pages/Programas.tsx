import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { fadeUp, inView } from "@/components/landing";
import { PROGRAMS } from "@/data/programas";

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";

const ProgramRow = ({ p, i }: { p: (typeof PROGRAMS)[number]; i: number }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const flip = i % 2 === 1;
  const fade = flip
    ? "md:[mask-image:linear-gradient(to_left,black_55%,transparent)] md:[-webkit-mask-image:linear-gradient(to_left,black_55%,transparent)]"
    : "md:[mask-image:linear-gradient(to_right,black_55%,transparent)] md:[-webkit-mask-image:linear-gradient(to_right,black_55%,transparent)]";
  return (
    <article ref={ref} className={`grid md:grid-cols-2 items-center gap-10 md:gap-20 ${i % 2 ? "bg-brand-cream" : "bg-background"}`}>
      <div className={`relative h-[70vw] max-h-[520px] md:h-[78vh] md:max-h-none overflow-hidden ${flip ? "md:order-2" : ""}
        [mask-image:linear-gradient(to_bottom,black_70%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent)] ${fade}`}>
        <motion.img src={p.image} alt="" loading="lazy" style={reduce ? undefined : { y, scale: 1.08 }}
          className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className={`px-6 pb-20 md:py-28 ${flip ? "md:pl-[max(1.5rem,calc((100vw-72rem)/2))] md:pr-0" : "md:pr-[max(1.5rem,calc((100vw-72rem)/2))] md:pl-0"}`}>
        <div className="max-w-md">
          <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-brand-mauve">{p.subtitle}</motion.p>
          <motion.h2 variants={fadeUp} className="mt-5 text-foreground">{p.title}</motion.h2>
          <motion.span variants={fadeUp} aria-hidden="true" className="block w-12 h-px bg-brand-gold my-7" />
          <motion.p variants={fadeUp} className="text-base text-muted-foreground max-w-[44ch]">{p.desc}</motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-[10px] uppercase tracking-[0.28em] text-brand-mauve leading-loose">{p.features.join(" · ")}</motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <Link to={p.href} aria-label={`Ver detalles de ${p.title}`}
              className={`group inline-flex items-center gap-3 px-8 py-4 border border-brand-ink text-brand-ink text-[11px] tracking-[0.28em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500 ${FOCUS}`}>
              Ver detalles <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" strokeWidth={1.25} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </article>
  );
};

const Programas = () => {
  const { settings, palette } = useVisualSettings();
  return (
    <div className="min-h-screen relative flex flex-col pb-20 md:pb-0">
      <Seo
        title="Mis programas y espacios | SantoSha"
        description="Psicoterapia individual, proceso de pareja y Kundalini Yoga con Fransury González. Atención virtual desde cualquier lugar."
        path="/programas"
      />
      <FloatingCTA scrollTo="#lista-programas" ctaText="Ver programas" subText="Formación & Acompañamiento" />
      <Header palette={palette} brandName={settings?.brandName} />
      <main className="flex-grow">
        <section className="px-6 pt-24 pb-20 md:pt-36 md:pb-32 text-center">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-3xl mx-auto">
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-brand-mauve">Formación &amp; Acompañamiento</motion.p>
            <motion.h1 variants={fadeUp} className="mt-6 text-foreground">Mis programas y espacios</motion.h1>
            <motion.span variants={fadeUp} aria-hidden="true" className="block mx-auto w-12 h-px bg-brand-gold my-8" />
            <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground max-w-[46ch] mx-auto">
              Recorridos para comprender lo que vives y recuperar tu equilibrio.
            </motion.p>
          </motion.div>
        </section>
        <div id="lista-programas" className="scroll-mt-28">
          {PROGRAMS.map((p, i) => <ProgramRow key={p.href} p={p} i={i} />)}
        </div>
        <section className="px-6 py-16 md:py-24 text-center border-t border-border">
          <p className="text-[10px] uppercase tracking-[0.35em] text-brand-mauve">Clases privadas por videollamada</p>
          <Link to="/acompanamiento-individual" className="mt-5 inline-block font-serif font-light uppercase tracking-[0.12em] text-lg md:text-xl text-foreground underline decoration-brand-gold decoration-1 underline-offset-[8px] hover:text-brand-ink transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-4">
            Yoga y meditación 1:1
          </Link>
        </section>
      </main>
      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="programas" />
    </div>
  );
};

export default Programas;
