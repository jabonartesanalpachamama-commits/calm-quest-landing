/** Source: https://reactbits.dev/r/DepthCarousel-TS-TW.json
 * React Bits — MIT with Commons Clause. Adapted GSAP depth layout and pointer drag;
 * native window scroll is never intercepted, autoplay disabled, original images contained. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepthCarousel({ items, initialIndex = 0, onChange }: { items: { id: string; content: ReactNode; label: string }[]; initialIndex?: number; onChange: (index: number) => void }) {
  const [active, setActive] = useState(initialIndex);
  const reduce = useReducedMotion();
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const pos = useRef(initialIndex);
  const tween = useRef<gsap.core.Tween | null>(null);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const layout = useCallback((position: number) => {
    const mobile = (root.current?.clientWidth ?? 360) < 600;
    cards.current.forEach((el, i) => {
      if (!el) return;
      let d = ((i - position) % items.length + items.length) % items.length;
      if (d > items.length / 2) d -= items.length;
      const back = Math.abs(d);
      el.style.transform = reduce ? 'translate(-50%, -50%)' : `translate(-50%, -50%) translateX(${d * (mobile ? 32 : 100)}px) translateZ(${-back * 190}px) rotateY(${-d * 9}deg)`;
      el.style.opacity = String(reduce ? (i === Math.round(position) ? 1 : 0) : Math.max(0, 1 - back * .34));
      el.style.zIndex = String(100 - Math.round(back * 10));
      el.style.pointerEvents = i === active ? 'auto' : 'none';
    });
  }, [items.length, reduce, active]);
  useEffect(() => {
    const proxy = { p: pos.current };
    let delta = active - pos.current;
    if (delta > items.length / 2) delta -= items.length;
    if (delta < -items.length / 2) delta += items.length;
    tween.current?.kill();
    tween.current = gsap.to(proxy, { p: pos.current + delta, duration: reduce ? 0 : .9, ease: 'power3.out', onUpdate: () => { pos.current = proxy.p; layout(proxy.p); }, onComplete: () => { pos.current = active; layout(active); } });
    return () => { tween.current?.kill(); };
  }, [active, items.length, layout, reduce]);
  useEffect(() => { const el = root.current; if (!el) return; const ro = new ResizeObserver(() => layout(pos.current)); ro.observe(el); return () => ro.disconnect(); }, [layout]);
  const go = (step: number) => { const next = (active + step + items.length) % items.length; setActive(next); onChange(next); };
  return <div className="depth-carousel" data-active-index={active}>
    <div ref={root} className="depth-stage focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cream" role="region" aria-roledescription="carrusel" aria-label="Reseñas de Google" tabIndex={0}
      onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); } }}
      onPointerDown={e => { drag.current = { x: e.clientX, id: e.pointerId }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerUp={e => { const start = drag.current; drag.current = null; if (start && Math.abs(e.clientX - start.x) > 35) go(e.clientX < start.x ? 1 : -1); }}
      onPointerCancel={() => { drag.current = null; }}>
      {items.map((item, i) => <div key={item.id} ref={el => { cards.current[i] = el; }} className="depth-card" aria-hidden={i !== active} data-depth-card={item.id} role="group" aria-roledescription="diapositiva" aria-label={item.label}>{item.content}</div>)}
    </div>
    <div className="relative flex items-center justify-center gap-6 mt-4">
      <Button variant="outline" size="icon" aria-label="Reseña anterior" onClick={() => go(-1)} className="rounded-none border-brand-cream bg-transparent text-brand-cream hover:bg-brand-cream hover:text-brand-ink"><ArrowLeft /></Button>
      <p aria-live="polite" className="text-sm tabular-nums">{String(active + 1).padStart(2, '0')} / {items.length}</p>
      <Button variant="outline" size="icon" aria-label="Reseña siguiente" onClick={() => go(1)} className="rounded-none border-brand-cream bg-transparent text-brand-cream hover:bg-brand-cream hover:text-brand-ink"><ArrowRight /></Button>
    </div>
  </div>;
}
