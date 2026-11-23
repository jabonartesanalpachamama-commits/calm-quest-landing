/** Source: https://reactbits.dev/r/TiltedCard-TS-TW.json
 * React Bits — MIT with Commons Clause.
 * Adapted original damped-spring integration and pointer tracking to the site's
 * Button and semantic tokens. No flip, gyroscope, intro or external dependency.
 */
import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import "./tilted-card.css";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Original React Bits frame-rate independent damped spring.
const step = (state: Record<string, number>, key: string, target: number, omega: number, zeta: number, dt: number) => {
  const velocity = `v${key}`;
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / steps;
  for (let index = 0; index < steps; index++) {
    state[velocity] += (omega * omega * (target - state[key]) - 2 * zeta * omega * state[velocity]) * h;
    state[key] += state[velocity] * h;
  }
  const settled = Math.abs(target - state[key]) < .001 && Math.abs(state[velocity]) < .01;
  if (settled) { state[key] = target; state[velocity] = 0; }
  return !settled;
};

interface TiltedCardProps {
  children: ReactNode;
  label: string;
  onClick: () => void;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}

const TiltedCard = forwardRef<HTMLButtonElement, TiltedCardProps>(({ children, label, onClick, rotateAmplitude = 10, scaleOnHover = 1.03 }, forwardedRef) => {
  const area = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLButtonElement | null>(null);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const figure = area.current;
    const button = body.current;
    if (!figure || !button) return;
    if (reduced) { button.style.transform = ""; button.style.setProperty("--tc-glare", "0"); return; }
    const state = { rx: 0, vrx: 0, ry: 0, vry: 0, lift: 0, vlift: 0 };
    const pointer = { nx: 0, ny: 0, inside: false };
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = 0;
      const dt = clamp((now - last) / 1000, 0, .05);
      last = now;
      const amplitude = clamp(rotateAmplitude, 0, 10);
      const omega = 20 * Math.pow(.2, .6);
      const zeta = .82;
      let busy = step(state, "rx", pointer.inside ? -pointer.ny * amplitude : 0, omega, zeta, dt);
      busy = step(state, "ry", pointer.inside ? pointer.nx * amplitude : 0, omega, zeta, dt) || busy;
      busy = step(state, "lift", pointer.inside ? 1 : 0, omega, .85, dt) || busy;
      button.style.transform = `rotateX(${state.rx.toFixed(3)}deg) rotateY(${state.ry.toFixed(3)}deg) scale(${(1 + (scaleOnHover - 1) * state.lift).toFixed(4)})`;
      button.style.setProperty("--tc-gx", `${50 + state.ry / Math.max(amplitude, 1) * 46}%`);
      button.style.setProperty("--tc-gy", `${50 - state.rx / Math.max(amplitude, 1) * 46}%`);
      button.style.setProperty("--tc-glare", String(state.lift));
      if (busy) raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const track = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = figure.getBoundingClientRect();
      pointer.inside = true;
      pointer.nx = clamp((event.clientX - rect.left - rect.width / 2) / (rect.width / 2), -1, 1);
      pointer.ny = clamp((event.clientY - rect.top - rect.height / 2) / (rect.height / 2), -1, 1);
      wake();
    };
    const leave = () => { pointer.inside = false; wake(); };
    figure.addEventListener("pointermove", track);
    figure.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); figure.removeEventListener("pointermove", track); figure.removeEventListener("pointerleave", leave); };
  }, [reduced, rotateAmplitude, scaleOnHover]);

  return (
    <div ref={area} className="rb-tilted relative w-full aspect-video">
      <Button ref={element => {
        body.current = element;
        if (typeof forwardedRef === "function") forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }} type="button" variant="ghost" aria-label={label} onClick={onClick}
        className="rb-tilted-button relative h-full w-full p-0 overflow-hidden rounded-sm bg-brand-ink hover:bg-brand-ink focus-visible:ring-brand-gold [transform-style:preserve-3d]"
        style={{ "--tc-glare": 0 } as CSSProperties}>
        {children}
        <span aria-hidden="true" className="rb-tilted-glare pointer-events-none absolute inset-0" />
      </Button>
    </div>
  );
});
TiltedCard.displayName = "TiltedCard";
export default TiltedCard;