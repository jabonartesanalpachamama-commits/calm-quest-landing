import { useState } from "react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import AiChatWidget from "@/components/AiChatWidget";
import Seo from "@/components/Seo";
import FreeClassDialog from "@/components/FreeClassDialog";
import NewsletterSection from "@/components/landing/NewsletterSection";
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
        <ResenasCover href={WHATSAPP_HREF} onFreeClass={() => setFreeClassOpen(true)} />
        <ResenasExperience />
        <NewsletterSection sourcePage="testimonios" />
      </main>
      <SiteFooter palette={palette} />
      <AiChatWidget pageSlug="testimonios" />
      <FreeClassDialog open={freeClassOpen} onOpenChange={setFreeClassOpen} />
    </div>
  );
};

export default Testimonios;
