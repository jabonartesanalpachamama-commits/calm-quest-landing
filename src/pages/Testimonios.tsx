import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import FreeClassDialog from "@/components/FreeClassDialog";
import { Button } from "@/components/ui/button";
import { ResenaScroll, resenaReveal, RESENA_LINK } from "@/components/landing/Resenas";
import { RESENAS } from "@/data/resenas";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { getWhatsAppUrl } from "@/lib/utils";
import fransury from "@/assets/fransury-acompana.webp";

const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");

const Testimonios = () => {
  const { settings, palette } = useVisualSettings();
  const [freeClassOpen, setFreeClassOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen relative flex flex-col bg-background text-foreground">
      <Seo title="Reseñas de Google | Fransury González · SantoSha"
        description="Reseñas reales de Google sobre Fransury González en sus capturas originales, tal como las escribieron."
        path="/testimonios" />
      <Header palette={palette} brandName={settings?.brandName} />
      <main className="flex-grow">
        <section aria-labelledby="resenas-titulo" className="resenas-scene relative isolate overflow-clip bg-brand-ink text-brand-cream">
          <div data-resenas-sticky aria-hidden="true" className="sticky top-0 h-screen overflow-hidden pointer-events-none -mb-[100vh]">
            <img src={fransury} alt="" width={1029} height={1529} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[50%_20%] opacity-[0.09] grayscale" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 [perspective:1200px]">
            <div className="min-h-[65svh] flex items-center justify-center pt-24 pb-16 text-center">
              <motion.h1 id="resenas-titulo" className="resenas-title text-brand-cream !leading-relaxed"
                initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true }}
                variants={reduce ? { show: { opacity: 1 } } : resenaReveal}>
                Reseñas reales de Google, tal como las escribieron.
              </motion.h1>
            </div>
            <ol className="list-none p-0 m-0 pb-24">
              {RESENAS.map((resena, index) => <ResenaScroll key={resena.id} resena={resena} index={index} />)}
            </ol>
          </div>
        </section>
        <section className="bg-background px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-foreground">¿Quieres empezar? Escríbeme.</h2>
            <span aria-hidden="true" className="block h-px w-12 bg-brand-gold mx-auto my-9" />
            <p className="text-base text-muted-foreground max-w-[44ch] mx-auto">
              Explora los programas o empieza con la clase gratuita de 30 minutos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
              <Button asChild variant="outline" className="h-auto rounded-none border-brand-ink text-brand-ink px-9 py-4 text-xs uppercase tracking-normal hover:bg-brand-ink hover:text-primary-foreground">
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">Escríbeme</a>
              </Button>
              <Button variant="link" onClick={() => setFreeClassOpen(true)} className={`${RESENA_LINK} rounded-none px-0 font-normal hover:no-underline`}>Acceder a la Clase Gratis</Button>
            </div>
            <p className="mt-14 text-[10px] uppercase tracking-normal text-muted-foreground">Atención virtual desde cualquier lugar del mundo.</p>
          </div>
        </section>
      </main>
      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="testimonios" />
      <FreeClassDialog open={freeClassOpen} onOpenChange={setFreeClassOpen} />
    </div>
  );
};

export default Testimonios;
