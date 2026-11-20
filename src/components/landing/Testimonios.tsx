import { useId } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { porIds, type Testimonio } from "@/data/testimonios";
import { EASE, fadeUp, inView } from "@/components/landing";

export const TESTIMONIOS_LABEL = "block text-[10px] uppercase tracking-[0.35em] text-brand-mauve";
export const EDITORIAL_FOCUS = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-mauve focus-visible:ring-offset-4";
export const EDITORIAL_LINK = `inline-flex items-center min-h-11 text-[11px] uppercase tracking-[0.3em] text-brand-mauve border-b border-brand-gold/60 pb-1 hover:border-brand-mauve transition-colors duration-500 ${EDITORIAL_FOCUS}`;

/** Same drawing pattern as the home page, with a static reduced-motion state. */
export const Rule = ({ className = "" }: { className?: string }) => {
  const reduce = useReducedMotion();
  return <motion.span aria-hidden="true" className={`block h-px w-12 bg-brand-gold origin-left ${className}`}
    initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
    transition={{ duration: reduce ? 0 : 1.6, ease: EASE }} />;
};

const SERVICIOS: Record<Testimonio["servicio"], string> = {
  psicoterapia: "Psicoterapia", yoga: "Kundalini Yoga", ciclica: "Sabiduría Cíclica",
};
const longitud = (testimonio: Testimonio) => testimonio.parrafos.reduce((total, parrafo) => total + parrafo.length, 0);

const Firma = ({ testimonio, destacada = false }: { testimonio: Testimonio; destacada?: boolean }) => (
  <cite className={`block not-italic min-w-0 ${destacada ? "text-brand-cream" : "text-brand-ink"}`}>
    <span className="block text-[11px] font-light uppercase tracking-[0.3em] leading-relaxed break-words">{testimonio.nombre}</span>
    {testimonio.pais && <span className={`block mt-3 text-[10px] uppercase tracking-[0.3em] leading-relaxed ${destacada ? "text-brand-cream" : "text-brand-mauve"}`}>{testimonio.pais}</span>}
    <span className={`block mt-4 text-[10px] uppercase tracking-[0.25em] leading-relaxed ${destacada ? "text-brand-cream" : "text-brand-mauve"}`}>{SERVICIOS[testimonio.servicio]}</span>
  </cite>
);

type TestimoniosBlockProps = { ids: string[]; destacado?: string; titulo?: string; etiqueta?: string; verMas?: boolean; id?: string };

export const TestimoniosBlock = ({ ids, destacado, titulo = "En sus palabras", etiqueta = "Testimonios", verMas = false, id }: TestimoniosBlockProps) => {
  const headingId = useId();
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const protagonista = destacado ? porIds([destacado])[0] : undefined;
  const testimonios = porIds([...new Set(ids)]).filter((testimonio) => testimonio.id !== protagonista?.id);
  const largos = testimonios.filter((testimonio) => longitud(testimonio) > 260);
  const breves = testimonios.filter((testimonio) => longitud(testimonio) <= 260);
  const entrada = { ...inView, initial: reduce ? false as const : inView.initial };
  const variantes = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : fadeUp;
  const total = testimonios.length + (protagonista ? 1 : 0);
  return (
    <section id={id} aria-labelledby={headingId} className="bg-background py-24 md:py-40 scroll-mt-28">
      <div className="px-6">
        <motion.div {...entrada} variants={variantes} className="max-w-5xl mx-auto mb-14 md:mb-20">
          {etiqueta && <p className={TESTIMONIOS_LABEL}>{etiqueta}</p>}
          <h2 id={headingId} className="mt-6 text-foreground">{titulo}</h2>
          {(total >= 3 || pathname === "/testimonios") && <p className="mt-5 text-xs text-brand-mauve">Testimonios compartidos con autorización de cada persona.</p>}
          <Rule className="mt-8" />
        </motion.div>
      </div>
      {protagonista && (
        <motion.blockquote {...entrada} variants={variantes} data-testimonio={protagonista.id} data-destacado="true"
          className="m-0 bg-brand-mauve text-brand-cream px-6 pt-10 pb-14 md:pt-14 md:pb-20 text-center [container-type:inline-size]">
          <span aria-hidden="true" className="block h-24 md:h-32 font-serif font-light text-[96px] md:text-[128px] leading-none text-brand-gold/30">“</span>
          <div data-parrafos className={`max-w-3xl mx-auto font-serif font-light space-y-7 break-words ${longitud(protagonista) > 300 ? "text-[clamp(19px,2.8cqi,28px)]" : "text-[clamp(22px,3.8cqi,40px)]"}`}>
            {protagonista.parrafos.map((parrafo, i) => <p key={i} className="!leading-[1.6]">{parrafo}</p>)}
          </div>
          <span aria-hidden="true" className="block h-px w-12 bg-brand-gold mx-auto my-9" />
          <Firma testimonio={protagonista} destacada />
        </motion.blockquote>
      )}
      <div className="px-6">
        <div className="max-w-5xl mx-auto [container-type:inline-size]">
          {largos.length > 0 && (
            <div className={`${protagonista ? "mt-16 md:mt-24" : ""} border-t border-border`}>
              {largos.map((testimonio, index) => (
                <motion.blockquote key={testimonio.id} {...entrada} variants={variantes} data-testimonio={testimonio.id}
                  className="m-0 grid md:grid-cols-12 gap-7 md:gap-10 py-12 md:py-16 border-b border-border">
                  <div className="md:col-span-4 min-w-0">
                    <span aria-hidden="true" className="block mb-6 font-serif font-light text-4xl md:text-5xl text-brand-mauve leading-none">{String(index + 1).padStart(2, "0")}</span>
                    <Firma testimonio={testimonio} />
                  </div>
                  <div data-parrafos className={`md:col-span-8 min-w-0 font-serif font-light text-foreground space-y-6 break-words ${longitud(testimonio) > 400 ? "text-[clamp(17px,2cqi,20px)]" : "text-[clamp(17px,2.4cqi,24px)]"}`}>
                    {testimonio.parrafos.map((parrafo, i) => <p key={i} className="!leading-[1.6]">{parrafo}</p>)}
                  </div>
                </motion.blockquote>
              ))}
            </div>
          )}
          {breves.length > 0 && (
            <div className={`grid md:grid-cols-2 gap-x-16 gap-y-12 ${protagonista || largos.length ? "mt-16 md:mt-24" : ""}`}>
              {breves.map((testimonio) => (
                <motion.blockquote key={testimonio.id} {...entrada} variants={variantes} data-testimonio={testimonio.id}
                  className="m-0 border-t border-border pt-8 flex flex-col min-w-0">
                  <div data-parrafos className="font-serif font-light text-[18px] md:text-[20px] text-foreground space-y-6 break-words mb-8">
                    {testimonio.parrafos.map((parrafo, i) => <p key={i} className="!leading-[1.6]">{parrafo}</p>)}
                  </div>
                  <div className="mt-auto"><Firma testimonio={testimonio} /></div>
                </motion.blockquote>
              ))}
            </div>
          )}
          {verMas && <div className="mt-12 md:mt-16"><Link to="/testimonios" className={EDITORIAL_LINK}>Leer más historias</Link></div>}
        </div>
      </div>
    </section>
  );
};