import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import FreeClassDialog from "@/components/FreeClassDialog";
import { Button } from "@/components/ui/button";
import { TestimoniosBlock, Rule, TESTIMONIOS_LABEL, EDITORIAL_LINK, EDITORIAL_FOCUS } from "@/components/landing/Testimonios";
import { fadeUp, inView } from "@/components/landing";
import { TESTIMONIOS, type Testimonio } from "@/data/testimonios";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { getWhatsAppUrl } from "@/lib/utils";

const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");
const SECCIONES: { id: string; titulo: string; servicio: Testimonio["servicio"]; destacado: string }[] = [
  { id: "psicoterapia", titulo: "Psicoterapia", servicio: "psicoterapia", destacado: "angela-posada" },
  { id: "kundalini-yoga", titulo: "Kundalini Yoga", servicio: "yoga", destacado: "martha-gaitan-yoga" },
  { id: "sabiduria-ciclica", titulo: "Sabiduría Cíclica", servicio: "ciclica", destacado: "goretti" },
];

const Testimonios = () => {
  const { settings, palette } = useVisualSettings();
  const [freeClassOpen, setFreeClassOpen] = useState(false);
  return (
    <div className="min-h-screen relative flex flex-col bg-background text-foreground">
      <Seo title="Testimonios | Fransury González · SantoSha"
        description="Lo que dicen quienes han vivido su proceso con Fransury González: psicoterapia, Kundalini Yoga y el taller Sabiduría Cíclica."
        path="/testimonios" />
      <Header palette={palette} brandName={settings?.brandName} />
      <main className="flex-grow">
        <section className="px-6 pt-24 md:pt-40 pb-12 md:pb-20">
          <motion.div {...inView} variants={fadeUp} className="max-w-5xl mx-auto">
            <p className={TESTIMONIOS_LABEL}>Testimonios</p>
            <h1 className="mt-6 text-foreground">En sus palabras</h1>
            <p className="mt-5 text-sm text-brand-mauve">Personas de Colombia, Estados Unidos, México y Dubái.</p>
            <Rule className="my-8" />
            <p className="text-base text-muted-foreground">Personas que vivieron su proceso conmigo.</p>
            <nav aria-label="Testimonios por proceso" className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-10">
              {SECCIONES.map(({ id, titulo }) => <a key={id} href={`#${id}`} className={EDITORIAL_LINK}>{titulo}</a>)}
            </nav>
          </motion.div>
        </section>
        {SECCIONES.map(({ id, titulo, servicio, destacado }) => (
          <TestimoniosBlock key={id} id={id} titulo={titulo} etiqueta="" destacado={destacado}
            ids={TESTIMONIOS.filter((t) => t.servicio === servicio && t.id !== destacado).map((t) => t.id)} />
        ))}
        <section className="bg-background px-6 py-28 md:py-44">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={fadeUp} className="text-foreground">¿Quieres empezar? Escríbeme.</motion.h2>
            <Rule className="mx-auto my-9" />
            <motion.p variants={fadeUp} className="text-base text-muted-foreground max-w-[44ch] mx-auto">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 px-9 py-4 border border-brand-ink text-brand-ink text-[11px] tracking-[0.3em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500 ${EDITORIAL_FOCUS}`}>Escríbeme</a>
              <Button variant="link" onClick={() => setFreeClassOpen(true)} className={`${EDITORIAL_LINK} rounded-none px-0 font-normal hover:no-underline`}>Acceder a la Clase Gratis</Button>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-14 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Atención virtual desde cualquier lugar del mundo.</motion.p>
          </motion.div>
        </section>
      </main>
      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="testimonios" />
      <FreeClassDialog open={freeClassOpen} onOpenChange={setFreeClassOpen} />
    </div>
  );
};

export default Testimonios;