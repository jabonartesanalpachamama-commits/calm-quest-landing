import { useState } from "react";
import { Play } from "lucide-react";

type VideoEmbedProps = {
  title: string;
  vertical?: boolean;
} & ({ youtubeId: string; vimeoId?: never } | { vimeoId: string; youtubeId?: never });

const VideoEmbed = ({ youtubeId, vimeoId, title, vertical = false }: VideoEmbedProps) => {
  const [playing, setPlaying] = useState(false);

  const src = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=1`
    : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1&texttrack=es`;

  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : `https://vumbnail.com/${vimeoId}.jpg`;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-brand-ink ${
        vertical ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {playing ? (
        <iframe
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Reproducir video: ${title}`}
          className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold"
        >
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-brand-ink/25" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream text-brand-mauve shadow-lg transition-transform group-hover:scale-105"
          >
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoEmbed;
