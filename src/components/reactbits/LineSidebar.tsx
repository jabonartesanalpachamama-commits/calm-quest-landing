/** Source: https://reactbits.dev/r/LineSidebar-TS-TW.json
 * React Bits — MIT with Commons Clause. Adapted proximity falloff / exponential
 * smoothing to semantic tokens, accessible buttons and photographic panels.
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgramLink, ProgramPhoto } from "./ProgramPhoto";
import { useDesktop } from "./useDesktop";
import type { PhotoProgram } from "./types";
import "./reactbits.css";

export const proximityShift = (distance: number, radius = 180, maxShift = 26) => {
  const p = Math.max(0, 1 - Math.abs(distance) / radius);
  return p * p * (3 - 2 * p) * maxShift;
};

export default function LineSidebar({ items }: { items: readonly PhotoProgram[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const targets = useRef<number[]>([]);
  const current = useRef<number[]>([]);
  const frame = useRef<number | null>(null);
  const last = useRef(0);
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - last.current) / 1000, .05);
    last.current = now;
    const k = 1 - Math.exp(-dt / .16);
    let moving = false;
    labels.current.forEach((label, i) => {
      if (!label) return;
      const target = targets.current[i] ?? 0;
      const next = (current.current[i] ?? 0) + (target - (current.current[i] ?? 0)) * k;
      const settled = Math.abs(target - next) < .02;
      current.current[i] = settled ? target : next;
      label.style.transform = `translateX(${current.current[i]}px)`;
      moving ||= !settled;
    });
    frame.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);
  const startLoop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    last.current = performance.now();
    frame.current = requestAnimationFrame(runFrame);
  };
  useEffect(() => {
    if (reduce || !desktop) {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      labels.current.forEach(label => { if (label) label.style.transform = ""; });
      current.current = [];
      targets.current = [];
    }
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); };
  }, [reduce, desktop]);

  const panel = (item: PhotoProgram, index: number, mobile: boolean) => (
    <div id={mobile ? undefined : `${id}-panel-desktop`} role="region" aria-label={item.title} aria-live="polite" className={mobile ? "pb-6" : "min-w-0"}>
      <div className="rb-path-panel-photo relative w-full overflow-hidden bg-brand-ink">
        <AnimatePresence initial={false}>
          <motion.div key={item.href} className="absolute inset-0" initial={reduce ? false : { opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0 }} transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}>
            <ProgramPhoto item={item} first={index === 0} sizes={mobile ? "100vw" : "(min-width: 768px) 42vw, 100vw"} />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-5 mb-5 text-sm text-brand-ink">{item.desc}</p>
      <ProgramLink item={item}>Ver este camino</ProgramLink>
    </div>
  );

  return (
    <div className="rb-scene grid md:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-start" data-line-sidebar="">
      <ul className="min-w-0 border-t border-border" onPointerMove={event => {
        if (reduce || !desktop || event.pointerType !== "mouse") return;
        targets.current = buttons.current.map(button => {
          if (!button) return 0;
          const rect = button.getBoundingClientRect();
          return proximityShift(event.clientY - rect.top - rect.height / 2);
        });
        startLoop();
      }} onPointerLeave={() => { if (!reduce && desktop) { targets.current = items.map(() => 0); startLoop(); } }}>
        {items.map((item, index) => (
          <li key={item.href} className="relative border-b border-border">
            <Button ref={element => { buttons.current[index] = element; }} type="button" variant="ghost" aria-pressed={active === index}
              aria-controls={`${id}-panel-${desktop ? "desktop" : index}`} className="rb-option w-full justify-start text-brand-ink hover:bg-brand-cream hover:text-brand-ink focus-visible:ring-brand-gold"
              onClick={() => setActive(index)} onFocus={() => setActive(index)} onPointerEnter={event => { if (desktop && event.pointerType === "mouse") setActive(index); }}
              onKeyDown={event => {
                let next: number | undefined;
                if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % items.length;
                if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index - 1 + items.length) % items.length;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = items.length - 1;
                if (next === undefined) return;
                event.preventDefault(); setActive(next); buttons.current[next]?.focus();
              }}>
              <span aria-hidden="true" className={`absolute right-0 top-1/2 h-px w-6 bg-brand-gold ${active === index ? "opacity-100" : "opacity-0"}`} />
              <span ref={element => { labels.current[index] = element; }} className="block pr-2">{item.title}</span>
            </Button>
            {!desktop && <div id={`${id}-panel-${index}`} hidden={active !== index}>{active === index && <div aria-live="polite">{panel(item, index, true)}</div>}</div>}
          </li>
        ))}
      </ul>
      {desktop && items[active] && panel(items[active], active, false)}
    </div>
  );
}