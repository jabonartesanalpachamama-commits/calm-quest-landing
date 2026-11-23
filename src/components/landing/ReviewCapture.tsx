import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RESENA_DIMENSIONS, type Resena } from "@/data/resenas";

export const ResenaImage = ({ resena, framed = false, loading = "lazy" }: { resena: Resena; framed?: boolean; loading?: "lazy" | "eager" }) => {
  const dimensions = RESENA_DIMENSIONS[resena.id];
  if (!dimensions) return null;
  const image = <img src={resena.img} alt={resena.texto} loading={loading} decoding="async"
    width={dimensions.width} height={dimensions.height}
    className={framed ? "block h-full w-full object-contain" : "block h-auto w-full"} />;
  return framed ? <div className="reviews-capture">{image}</div> : image;
};

/** The screenshot is untouched; the transcription is available only as image alt. */
export const ReviewCapture = forwardRef<HTMLDivElement, { resena: Resena }>(({ resena }, ref) => {
  const [open, setOpen] = useState(false);
  return <div ref={ref}><Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" aria-label={`Ampliar reseña de ${resena.nombre}`} data-review-id={resena.id}
        className="review-capture-trigger h-auto w-full cursor-zoom-in rounded-none p-0 focus-visible:ring-brand-ink">
        <ResenaImage resena={resena} framed />
      </Button>
    </DialogTrigger>
    <p className="mt-3 text-center text-sm text-brand-mauve md:hidden">Toca para ampliar</p>
    {open && <DialogContent aria-describedby={undefined} className="lux review-zoom-dialog rounded-none">
      <DialogTitle className="sr-only">Reseña de {resena.nombre}</DialogTitle>
      <div tabIndex={0} aria-label="Captura ampliada, desplazable" className="review-zoom-scroll focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mauve">
        <div className="review-zoom-image"><ResenaImage resena={resena} loading="eager" /></div>
      </div>
    </DialogContent>}
  </Dialog></div>;
});
ReviewCapture.displayName = "ReviewCapture";