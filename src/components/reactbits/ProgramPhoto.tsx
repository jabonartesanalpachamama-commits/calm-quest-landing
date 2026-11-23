import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PhotoProgram } from "./types";

export const ProgramPhoto = ({ item, first = false, sizes, className = "" }: { item: PhotoProgram; first?: boolean; sizes: string; className?: string }) => item.image ? (
  <img src={item.image} srcSet={item.imageSrcSet} sizes={sizes} alt={item.alt ?? item.title} loading={first ? "eager" : "lazy"}
    className={`h-full w-full object-cover ${item.position ?? "object-center"} ${className}`} />
) : <div className="h-full w-full bg-brand-ink" />;

export const ProgramLink = ({ item, children = "Ver detalles", onPhoto = false }: { item: PhotoProgram; children?: string; onPhoto?: boolean }) => (
  <Button asChild variant="outline" className={`rb-cta self-start bg-transparent ${onPhoto ? "border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-brand-ink" : "border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-brand-cream"} focus-visible:ring-brand-gold`}>
    <Link to={item.href} aria-label={`${children}: ${item.title}`}>{children}<ArrowRight aria-hidden="true" strokeWidth={1.25} /></Link>
  </Button>
);