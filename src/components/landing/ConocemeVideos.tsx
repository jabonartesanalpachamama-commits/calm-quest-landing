import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { RevealTitle } from "@/components/landing";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import VideoEmbed from "@/components/VideoEmbed";
import TiltedCard from "@/components/reactbits/TiltedCard";
import { CONOCEME_VIDEOS } from "@/data/conocemeVideos";

export default function ConocemeVideos({ headingClassName }: { headingClassName: string }) {
  const [active, setActive] = useState<number | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const video = active === null ? undefined : CONOCEME_VIDEOS[active];

  return (
    <section aria-labelledby="conoceme-video-title" className="conoceme-video-section py-14 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="px-6 md:px-0 space-y-4 md:mx-6 xl:mx-0">
          <div id="conoceme-video-title"><RevealTitle text="Conóceme en video" className={headingClassName} /></div>
          <p className="text-muted-foreground">Tres conversaciones donde puedes escucharme antes de escribirme.</p>
        </div>
        <div className="conoceme-video-track flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 xl:px-0 pt-8 pb-6">
          {CONOCEME_VIDEOS.map((item, index) => (
            <article key={item.youtubeId} className="snap-start shrink-0 w-[82vw] md:w-auto min-w-0">
              <TiltedCard ref={element => { cards.current[index] = element; }} label={`Reproducir video: ${item.title}`}
                rotateAmplitude={10} scaleOnHover={1.03} onClick={() => { trigger.current = cards.current[index] ?? null; setActive(index); }}>
                <img src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span aria-hidden="true" className="absolute inset-0 bg-brand-ink/25" />
                <span aria-hidden="true" className="conoceme-play absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream text-brand-mauve shadow-lg">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
              </TiltedCard>
              <h3 className="conoceme-video-title text-foreground mt-5">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{item.duration}</p>
            </article>
          ))}
        </div>
        <div className="px-6 xl:px-0 mt-4">
          <a href="https://www.youtube.com/@fransurygonzalezhenao" target="_blank" rel="noopener noreferrer"
            className="text-sm text-brand-mauve underline decoration-brand-gold underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
            Ver todos los videos en YouTube
          </a>
        </div>
      </div>
      <Dialog open={video !== undefined} onOpenChange={open => { if (!open) setActive(null); }}>
        <DialogContent aria-describedby={undefined} className="lux conoceme-video-dialog w-[calc(100%-32px)] max-w-4xl rounded-sm border-brand-mauve bg-brand-cream px-3 pt-14 pb-3 gap-0"
          onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }); }}>
          <DialogTitle className="sr-only">{video?.title ?? "Conóceme en video"}</DialogTitle>
          {video && <VideoEmbed key={video.youtubeId} youtubeId={video.youtubeId} title={video.title} autoplay />}
        </DialogContent>
      </Dialog>
    </section>
  );
}