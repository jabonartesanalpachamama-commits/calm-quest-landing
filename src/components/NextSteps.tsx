import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SPACES = [
  { to: "/mi-proceso-individual", title: "Acompañamiento individual", line: "Psicoterapia 1 a 1 por videollamada." },
  { to: "/proceso-de-pareja", title: "Proceso de pareja", line: "Un espacio para ambos." },
  { to: "/acompanamiento-individual", title: "Yoga y meditación 1:1", line: "Clases privadas a tu ritmo." },
  { to: "/curso-iniciacion-yoga", title: "Curso de iniciación", line: "Kundalini Yoga desde cero." },
  { to: "/sabiduria-ciclica-esencia-femenina", title: "Sabiduría Cíclica", line: "Taller en vivo sobre tu ciclo." },
];

/** "Sigue explorando": 3 tarjetas hacia otros espacios, excluyendo la ruta actual. */
const NextSteps = ({ exclude }: { exclude?: string }) => {
  const cards = SPACES.filter((s) => s.to !== exclude).slice(0, 3);
  return (
    <section aria-labelledby="next-steps-title" className="py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 id="next-steps-title" className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-8">
          Sigue explorando
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex flex-col justify-between gap-6 p-7 rounded-3xl bg-card border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-semibold text-foreground">{c.title}</h3>
                <p className="text-muted-foreground font-light">{c.line}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-[#795D64] transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NextSteps;
