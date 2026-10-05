import { Link } from "react-router-dom";
import santoshaLogo from "@/assets/santosha-logo.webp";
import { WHATSAPP_URL } from "@/lib/utils";

interface SiteFooterProps {
  palette: any;
}

const LINKS = [
  { label: "Filosofía", to: "/filosofia" },
  { label: "Blog", to: "/blog" },
  { label: "Clase gratuita", to: "/clase-gratuita" },
  { label: "Términos y política de datos", to: "/terminos-y-condiciones" },
];

const SiteFooter = ({ palette }: SiteFooterProps) => (
  <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground}`}>
    <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
      <img src={santoshaLogo} alt="SantoSha Logo" className="h-14 w-auto rounded-lg" loading="lazy" />
      <p className={`text-sm ${palette.secondaryText ?? "text-muted-foreground"}`}>
        SantoSha · Psicología, yoga y meditación · Atención virtual por Google Meet
      </p>
      <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="min-h-[44px] inline-flex items-center hover:text-primary transition-colors">
            {l.label}
          </Link>
        ))}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center hover:text-primary transition-colors"
        >
          WhatsApp
        </a>
      </nav>
    </div>
  </footer>
);

export default SiteFooter;
