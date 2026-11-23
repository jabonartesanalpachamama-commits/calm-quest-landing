import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AiChatWidget from "@/components/AiChatWidget";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { fadeUp } from "@/components/landing";
import { PROGRAMS } from "@/data/programas";
import ScrollStack, { ScrollStackItem } from "@/components/reactbits/ScrollStack";
import { ProgramLink, ProgramPhoto } from "@/components/reactbits/ProgramPhoto";

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
          <ScrollStack useWindowScroll smoothScroll={false} baseScale={0.95} itemScale={0.05}>
            {PROGRAMS.map((p, i) => (
              <ScrollStackItem key={p.href} itemClassName="rb-stack-card">
                <div className="min-h-0 overflow-hidden"><ProgramPhoto item={p} first={i === 0} sizes="(min-width: 768px) 45vw, 100vw" /></div>
                <div className="rb-stack-copy">
                  <p className="text-brand-mauve">{p.subtitle}</p>
                  <h2 className="rb-heading rb-stack-title">{p.title}</h2>
                  <p>{p.desc}</p>
                  <p className="text-brand-mauve">{p.features.join(" · ")}</p>
                  <ProgramLink item={p} />
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
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
