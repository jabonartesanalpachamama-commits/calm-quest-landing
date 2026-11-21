import { useState } from "react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import FreeClassDialog from "@/components/FreeClassDialog";
import { Button } from "@/components/ui/button";
import { RESENA_LINK } from "@/components/landing/Resenas";
import { ResenasCover, ResenasExperience } from "@/components/landing/ResenasExperience";
import { useVisualSettings } from "@/hooks/useVisualSettings";
import { getWhatsAppUrl } from "@/lib/utils";

const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");

const Testimonios = () => {
  const { settings, palette } = useVisualSettings();
  const [freeClassOpen, setFreeClassOpen] = useState(false);
  return (
    <div className="min-h-screen relative flex flex-col bg-background text-foreground">
      <Seo title="Lo que dicen mis pacientes | Fransury González · SantoSha"
        description="Reseñas de Google sobre Fransury González."
        path="/testimonios" />
      <Header palette={palette} brandName={settings?.brandName} />
      <main className="flex-grow">
        <ResenasCover href={WHATSAPP_HREF} />
        <ResenasExperience />
        <div aria-hidden="true" className="reviews-transition bg-background"><span className="block h-px bg-brand-gold" /></div>
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
