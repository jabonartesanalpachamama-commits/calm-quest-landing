import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EASE, REDUCED_MOTION, RevealTitle, RevealWords, RotatingOrnament } from "@/components/landing";
import { ResenaImage, resenaReveal } from "./Resenas";
import { agruparResenas, type Resena } from "@/data/resenas";
import individual from "@/assets/fransury-individual.webp";
import pareja from "@/assets/pareja-manos.webp";
import parejaMobile from "@/assets/pareja-manos-900.webp";
import yoga from "@/assets/fransury-yoga-nueva.webp";
import cover from "@/assets/fransury-acompana.webp";

const groups = agruparResenas();
const reviews = groups.flatMap((group) => group.resenas);
const photos = { individual, pareja, yoga };
const intro = "Estas reseñas las escribieron en Google personas que hicieron su proceso conmigo. Las comparto tal como aparecen allí, con su nombre. Léelas y, si algo de lo que cuentan se parece a lo que hoy estás viviendo, escríbeme.";

export const ResenasCover = ({ href }: { href: string }) => {
  const reduce = useReducedMotion() || REDUCED_MOTION;
  return <section className="reviews-cover reviews-theme relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-16 text-center text-brand-cream">
    <img src={cover} alt="" width={1029} height={1529} loading="eager" className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_20%] opacity-[0.22] grayscale" />
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-ink/80" />
    {!reduce && <RotatingOrnament className="reviews-ornament top-[8%] left-1/2 -translate-x-1/2 w-[min(80vw,560px)] aspect-square opacity-20" />}
    <div className="relative mx-auto w-full max-w-5xl">
      <RevealTitle as="h1" text="¿Qué dicen mis pacientes?" className="sr-only" />
      <div aria-hidden="true" className="reviews-cover-title" style={{ perspective: 1200 }}>
        {["¿Qué dicen", "mis pacientes?"].map((line, index) => <motion.span key={line} className="block"
          initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true }}
          variants={{ hidden: resenaReveal.hidden, show: { ...resenaReveal.show, transition: { duration: 1.2, delay: index * 0.16, ease: EASE } } }}>{line}</motion.span>)}
      </div>
      <span aria-hidden="true" className="mx-auto my-7 block h-px w-16 bg-brand-gold" />
      <RevealWords text={intro} className="reviews-intro mx-auto max-w-[48ch] text-sm md:text-base text-brand-cream" />
      <a href={href} target="_blank" rel="noopener noreferrer" className="reviews-contact mt-5 inline-flex min-h-11 items-center border-b border-brand-gold text-sm text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">Escríbeme</a>
      <motion.div aria-hidden="true" className="mx-auto mt-8 w-5" animate={reduce ? undefined : { y: [0, 7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: EASE }}><ArrowDown size={20} strokeWidth={1} /></motion.div>
    </div>
  </section>;
};

const ReviewPage = ({ resena, index, progress, stride }: { resena: Resena; index: number; progress: MotionValue<number>; stride: number }) => {
  const distance = useTransform(progress, (value) => index - value * (reviews.length - 1));
  const rotateY = useTransform(distance, (value) => -Math.max(-1, Math.min(1, value)) * 28);
  const z = useTransform(distance, (value) => -Math.min(Math.abs(value), 1) * 140);
  const scale = useTransform(distance, (value) => 1 - Math.min(Math.abs(value), 1) * 0.08);
  const opacity = useTransform(distance, (value) => Math.max(0, 1 - Math.abs(value) * 0.65));
  return <motion.li data-resena={resena.id} className="reviews-page shrink-0" style={{ rotateY, z, scale, opacity, width: stride }}>
    <figure className="m-0"><ResenaImage resena={resena} framed loading={index < 3 ? "eager" : "lazy"} /></figure>
  </motion.li>;
};

const ReducedReviews = () => <section className="reviews-theme bg-brand-ink px-4 py-12 text-brand-cream" data-reviews-reduced>
  {groups.map((group) => <section key={group.id} aria-labelledby={`reviews-${group.id}`} className="mx-auto max-w-6xl py-8">
    <h2 id={`reviews-${group.id}`} className="reviews-category text-center text-brand-cream">{group.titulo}</h2>
    <span aria-hidden="true" className="mx-auto my-5 block h-px w-16 bg-brand-gold" />
    <ol className="m-0 list-none space-y-6 p-0">{group.resenas.map((resena) => <li key={resena.id} data-resena={resena.id} className="mx-auto max-w-[560px]"><ResenaImage resena={resena} framed /></li>)}</ol>
  </section>)}
</section>;

const HorizontalReviews = () => {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const cardWidth = Math.min(560, width - 32);
  const gap = width < 768 ? 24 : 48;
  const step = cardWidth + gap;
  const x = useTransform(scrollYProgress, [0, 1], [0, -(reviews.length - 1) * step]);
  const y = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const category = reviews[active]?.categoria ?? "individual";
  const group = groups.find((item) => item.id === category);

  useMotionValueEvent(scrollYProgress, "change", (value) => setActive(Math.max(0, Math.min(reviews.length - 1, Math.round(value * (reviews.length - 1))))));
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => { if (entry) setWidth(entry.contentRect.width); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const images = [individual, pareja, parejaMobile, yoga].map((src) => { const image = new Image(); image.src = src; return image; });
    return () => { images.forEach((image) => { image.onload = null; }); };
  }, []);

  return <section ref={section} className="reviews-horizontal reviews-theme relative" aria-label="Reseñas de Google" style={{ height: `${reviews.length * 40 + 100}vh` }}>
    <div ref={stage} data-resenas-sticky data-active-category={category} data-active-index={active} className="reviews-stage sticky top-0 h-screen overflow-hidden bg-brand-ink text-brand-cream">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {groups.map(({ id }) => <motion.div key={id} data-review-background={id} className="absolute inset-0" initial={false} animate={{ opacity: category === id ? 1 : 0 }} transition={{ duration: 0.75, ease: EASE }}>
          <motion.picture className="absolute -inset-y-8 inset-x-0" style={{ y }}>
            {id === "pareja" && <source media="(max-width: 767px)" srcSet={parejaMobile} />}
            <img src={photos[id]} alt="" loading="eager" className="h-full w-full object-cover object-[50%_30%]" />
          </motion.picture>
          <div className={`absolute inset-0 ${id === "pareja" ? "reviews-veil-pareja" : "reviews-veil"}`} />
        </motion.div>)}
      </div>
      <div className="reviews-stage-heading absolute inset-x-0 top-0 z-10 px-4 text-center">
        <div className="relative h-16 md:h-20">
          {groups.map(({ id, titulo }) => <motion.div key={id} className="absolute inset-0" initial={false} animate={{ opacity: category === id ? 1 : 0 }} transition={{ duration: 0.75, ease: EASE }} aria-hidden={category !== id}>
            <h2 className="reviews-category text-brand-cream">{titulo}</h2>
            <span aria-hidden="true" className="mx-auto mt-4 block h-px w-16 bg-brand-gold" />
          </motion.div>)}
        </div>
        <div className="flex items-center justify-center gap-3" aria-label={`Categoría: ${group?.titulo}`}>
          {groups.map(({ id }) => <span key={id} aria-hidden="true" className={`block h-px w-8 bg-brand-cream ${id === category ? "opacity-100" : "opacity-40"}`} />)}
        </div>
        <p className="mt-3 text-xs text-brand-cream tabular-nums">{String(active + 1).padStart(2, "0")} / {reviews.length}</p>
      </div>
      <div className="absolute inset-0 flex items-center reviews-perspective">
        <motion.ol className="reviews-track m-0 flex list-none items-center p-0" style={{ x, gap, marginLeft: (width - cardWidth) / 2 }}>
          {reviews.map((resena, index) => <ReviewPage key={resena.id} resena={resena} index={index} progress={scrollYProgress} stride={cardWidth} />)}
        </motion.ol>
      </div>
    </div>
  </section>;
};

export const ResenasExperience = () => {
  const reduce = useReducedMotion() || REDUCED_MOTION;
  return reduce ? <ReducedReviews /> : <HorizontalReviews />;
};