import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import VideoEmbed from "@/components/VideoEmbed";
import TiltedCard from "@/components/reactbits/TiltedCard";
import { INTRO_VIDEO } from "@/data/conocemeVideos";

export default function ConocemeVideos() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const video = INTRO_VIDEO;

  return (
    <div className="conoceme-video-section px-6 py-14 md:py-16 overflow-hidden">
      <div className="max-w-[960px] mx-auto">
              <TiltedCard ref={trigger} label={`Reproducir video: ${video.title}`}
                rotateAmplitude={10} scaleOnHover={1.03} onClick={() => setOpen(true)}>
                <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span aria-hidden="true" className="absolute inset-0 bg-brand-ink/25" />
                <span aria-hidden="true" className="conoceme-play absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream text-brand-mauve shadow-lg">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
              </TiltedCard>
              <p className="text-sm text-muted-foreground mt-5">{video.title} · {video.duration}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="lux conoceme-video-dialog w-[calc(100%-32px)] max-w-4xl rounded-sm border-brand-mauve bg-brand-cream px-3 pt-14 pb-3 gap-0"
          onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }); }}>
          <DialogTitle className="sr-only">{video.title}</DialogTitle>
          {open && <VideoEmbed youtubeId={video.youtubeId} title={video.title} autoplay />}
        </DialogContent>
      </Dialog>
    </div>
  );
}