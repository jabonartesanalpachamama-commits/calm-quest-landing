/** Source: https://reactbits.dev/r/AccordionGallery-TS-TW.json
 * React Bits — MIT with Commons Clause. GSAP panel expansion adapted to
 * semantic tokens, editorial program content and accessible separate CTAs.
 */
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ProgramLink, ProgramPhoto } from "./ProgramPhoto";
import { useDesktop } from "./useDesktop";
import type { PhotoProgram } from "./types";
import "./reactbits.css";

export default function AccordionGallery({ items }: { items: readonly PhotoProgram[] }) {
  const [active, setActive] = useState(0);
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const panels = useRef<(HTMLElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const firstRun = useRef(true);
  const id = useId();
  useEffect(() => {
    const timeline = gsap.timeline();
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      timeline.to(panel, { flexGrow: desktop ? (index === active ? 5 : 1) : 0,
        height: desktop ? "100%" : index === active ? 440 : 88,
        duration: reduce || firstRun.current ? 0 : 1.2, ease: "power3.out" }, 0);
    });
    firstRun.current = false;
    return () => { timeline.kill(); };
  }, [active, desktop, reduce]);

  return (
    <div className="rb-scene rb-gallery" aria-label="Programas de yoga y meditación" data-accordion-gallery=""
      onPointerMove={event => {
        if (!desktop || event.pointerType !== "mouse") return;
        // Pointer-enter also fires when an animated panel slides under a stationary
        // cursor. Only actual pointer movement selects a new panel, preventing loops.
        const target = event.target;
        if (!(target instanceof Element)) return;
        const index = Number(target.closest("[data-gallery-index]")?.getAttribute("data-gallery-index"));
        if (Number.isInteger(index) && index >= 0 && index < items.length) setActive(index);
      }}>
      {items.map((item, index) => (
        <article key={item.href} ref={element => { panels.current[index] = element; }} data-active={active === index} data-gallery-index={index}
          className="rb-gallery-panel relative overflow-hidden bg-brand-ink text-brand-cream">
          <div className="absolute inset-0"><ProgramPhoto item={item} first={index === 0} sizes="(min-width: 768px) 75vw, 100vw" /></div>
          <div aria-hidden="true" className="rb-gallery-veil absolute inset-0 pointer-events-none" />
          <Button ref={element => { buttons.current[index] = element; }} variant="ghost" type="button"
            aria-expanded={active === index} aria-controls={`${id}-content-${index}`} aria-label={item.title}
            className="absolute inset-0 z-10 h-full w-full rounded-none p-0 bg-transparent hover:bg-transparent text-brand-cream hover:text-brand-cream focus-visible:ring-inset focus-visible:ring-brand-gold"
            onClick={() => setActive(index)} onFocus={() => setActive(index)} onKeyDown={event => {
              let next: number | undefined;
              if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % items.length;
              if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index - 1 + items.length) % items.length;
              if (event.key === "Home") next = 0;
              if (event.key === "End") next = items.length - 1;
              if (next === undefined) return;
              event.preventDefault(); setActive(next); buttons.current[next]?.focus();
            }}>
            <span aria-hidden="true" className={`rb-heading rb-gallery-label text-base ${active === index ? "invisible" : ""}`}>{item.title}</span>
          </Button>
          <div id={`${id}-content-${index}`} hidden={active !== index} className={active === index ? "rb-gallery-copy pointer-events-none" : ""}>
            <h2 className="rb-heading rb-gallery-title text-brand-cream">{item.title}</h2>
            <p>{item.subtitle}</p>
            <p>{item.desc}</p>
            <p>{item.features?.join(" · ")}</p>
            <div className="relative z-20 pointer-events-auto self-start"><ProgramLink item={item} onPhoto /></div>
          </div>
        </article>
      ))}
    </div>
  );
}