import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EASE, REDUCED_MOTION, RevealTitle, RotatingOrnament } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { ResenaStatic, resenaReveal, RESENA_LINK } from "./Resenas";
import cover from "@/assets/fransury-acompana.webp";

const intro = [
  "Elegir con quién hacer un proceso es una decisión grande, y es natural llegar con dudas. Por eso quiero que escuches primero a quienes ya lo vivieron.",
  "Estas reseñas las escribieron algunos de mis pacientes, personas a quienes he tenido el privilegio de acompañar y guiar en procesos individuales, de pareja, de yoga y de meditación. Agradezco de corazón que hayan querido compartir su experiencia, y te invito a ti, que hoy estás aquí, a que, como ellos, te atrevas a mirar hacia ti. Las dejo tal como las publicaron en Google, con sus nombres y sin cambiar una palabra, para que puedas comprobarlas allí.",
  "Cada proceso es distinto y yo acompaño el tuyo a tu ritmo, siempre en línea, desde donde estés. Si leyendo sientes que quieres empezar, escríbeme y lo hablamos. Si prefieres conocerme antes, tienes la clase gratuita de 30 minutos.",
];

export const ResenasCover = ({ href, onFreeClass }: { href: string; onFreeClass: () => void }) => {
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
      <motion.div className="reviews-intro mx-auto max-w-[52ch] space-y-4 text-base md:text-lg text-brand-cream [perspective:1200px]"
        initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.15 }}
        variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.2 } } }}>
        {intro.map((paragraph) => <motion.p key={paragraph} className="font-normal"
          variants={reduce ? { show: { opacity: 1 } } : resenaReveal}>{paragraph}</motion.p>)}
      </motion.div>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8">
        <Button asChild variant="outline" className="reviews-contact h-auto rounded-none border-brand-cream bg-transparent text-brand-cream px-9 py-4 text-xs uppercase tracking-normal hover:bg-brand-cream hover:text-brand-ink focus-visible:ring-brand-cream">
          <a href={href} target="_blank" rel="noopener noreferrer">Escríbeme</a>
        </Button>
        <Button variant="link" onClick={onFreeClass} className={`${RESENA_LINK} !text-brand-cream rounded-none px-0 font-normal hover:no-underline focus-visible:ring-brand-cream`}>Conoce la clase gratuita</Button>
      </div>
      <motion.div aria-hidden="true" className="mx-auto mt-8 w-5" animate={reduce ? undefined : { y: [0, 7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: EASE }}><ArrowDown size={20} strokeWidth={1} /></motion.div>
    </div>
  </section>;
};

export const ResenasExperience = () => <ResenaStatic id="all" />;
