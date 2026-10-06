import { Link } from "react-router-dom";
import santoshaLogo from "@/assets/santosha-logo-transparent.webp";
import { WHATSAPP_URL } from "@/lib/utils";

interface SiteFooterProps {
  palette?: any;
}

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  { title: "Psicoterapia", links: [
    { label: "Programas", to: "/programas" },
    { label: "Acompañamiento individual", to: "/mi-proceso-individual" },
    { label: "Proceso de pareja", to: "/proceso-de-pareja" },
  ] },
  { title: "Yoga y meditación", links: [
    { label: "Yoga y meditación 1:1", to: "/acompanamiento-individual" },
    { label: "Curso de iniciación", to: "/curso-iniciacion-yoga" },
    { label: "Cultivar bienestar", to: "/cultivar-bienestar" },
    { label: "Sabiduría Cíclica", to: "/sabiduria-ciclica-esencia-femenina" },
    { label: "Clase gratuita", to: "/clase-gratuita" },
  ] },
  { title: "SantoSha", links: [
    { label: "Quién soy", to: "/quien-soy" },
    { label: "Filosofía", to: "/filosofia" },
    { label: "Blog", to: "/blog" },
    { label: "Términos y política de datos", to: "/terminos-y-condiciones" },
  ] },
];

const LINK = "inline-flex min-h-[32px] items-center text-brand-cream/90 hover:text-brand-cream hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
const TITLE = "text-brand-cream mb-4";

const SiteFooter = (_props: SiteFooterProps) => (
  <footer className="bg-brand-ink text-brand-cream px-6 pt-14 pb-8">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-10 border-b border-brand-cream/15">
        <img src={santoshaLogo} alt="SantoSha Logo" className="h-14 w-auto self-start brightness-0 invert" loading="lazy" />
        <p className="font-serif uppercase tracking-[0.2em] text-sm">Psicología, yoga y meditación</p>
      </div>
      <nav aria-label="Mapa del sitio" className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 text-sm">
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <h2 className={TITLE}>{c.title}</h2>
            <ul className="space-y-1.5">
              {c.links.map((l) => <li key={l.to}><Link to={l.to} className={LINK}>{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h2 className={TITLE}>Contacto</h2>
          <ul className="space-y-1.5">
            <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={LINK}>WhatsApp</a></li>
            <li className="text-brand-cream/90">Atención virtual por Google Meet</li>
          </ul>
        </div>
      </nav>
      <p className="pt-6 border-t border-brand-cream/15 text-xs text-brand-cream/80 text-center">
        © 2026 SantoSha - Espacio de Bienestar y Kundalini Yoga.
      </p>
    </div>
  </footer>
);

export default SiteFooter;
