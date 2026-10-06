import { useRef, type ElementType } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Highlight } from "./Highlight";

/**
 * Texto que se "ilumina" palabra por palabra al cruzar la pantalla (opacidad ligada al scroll).
 * Fragmentos entre [[ y ]] se envuelven en <Highlight>, que se marca cuando el párrafo llega al centro.
 * Con movimiento reducido: texto completo en color final.
 */
type Token = { w: string; hl: boolean };
const tokenize = (text: string): Token[] => {
  const out: Token[] = [];
  text.split(/(\[\[.*?\]\])/).forEach((part) => {
    const hl = part.startsWith("[[");
    const clean = hl ? part.slice(2, -2) : part;
    clean.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, hl }));
  });
  return out;
};

const Word = ({ children, p, range, dim }: { children: string; p: MotionValue<number>; range: [number, number]; dim: number }) => {
  const opacity = useTransform(p, range, [dim, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
};

export const ScrollFillText = ({
  text, as: Tag = "p", className = "", dim = 0.22, offset = ["start 85%", "end 50%"],
}: { text: string; as?: ElementType; className?: string; dim?: number; offset?: [string, string] }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as any });
  const tokens = tokenize(text);
  const plain = tokens.map((t) => t.w).join(" ");

  // Agrupa palabras resaltadas consecutivas para que el marcador sea continuo.
  const groups: { hl: boolean; items: { w: string; i: number }[] }[] = [];
  tokens.forEach((t, i) => {
    const last = groups[groups.length - 1];
    if (last && last.hl === t.hl && t.hl) last.items.push({ w: t.w, i });
    else groups.push({ hl: t.hl, items: [{ w: t.w, i }] });
  });
  const n = tokens.length;
  const render = (w: string, i: number) =>
    reduce ? w : <Word p={scrollYProgress} range={[i / n, Math.min(1, (i + 1.5) / n)]} dim={dim}>{w}</Word>;

  return (
    <Tag ref={ref} className={className} aria-label={plain}>
      {groups.map((g, gi) => {
        const inner = g.items.map(({ w, i }, k) => (
          <span key={i} aria-hidden="true">{render(w, i)}{k < g.items.length - 1 ? " " : ""}</span>
        ));
        return (
          <span key={gi} aria-hidden="true">
            {g.hl ? <Highlight viewportMargin="-45% 0px -45% 0px">{inner}</Highlight> : inner}
            {gi < groups.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
};

export default ScrollFillText;
