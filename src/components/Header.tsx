import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import santoshaLogo from "@/assets/santosha-logo.webp";
import { getWhatsAppUrl } from "@/lib/utils";

interface HeaderProps {
  borderless?: boolean;
  palette: any;
  brandName?: string;
}

const NAV_ITEMS = [
  { label: "Psicoterapia individual", to: "/mi-proceso-individual" },
  { label: "Pareja", to: "/proceso-de-pareja" },
  { label: "Yoga y meditación", to: "/acompanamiento-individual" },
  { label: "Programas", to: "/cultivar-bienestar" },
  { label: "Quién soy", to: "/quien-soy" },
];

const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");

const Header = ({ palette, brandName, borderless }: HeaderProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to;
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`py-4 px-6 ${borderless ? '' : 'border-b border-border/40 shadow-sm'} ${palette.cardBackground} sticky top-0 z-40 backdrop-blur-md bg-opacity-90`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={santoshaLogo}
            alt="SantoSha Logo"
            className="h-10 md:h-16 lg:h-20 w-auto rounded-lg border border-border/20"
            onError={(e) => ((e.target as HTMLElement).style.display = "none")}
          />
          <span className={`hidden xl:inline font-serif text-xl font-semibold ${palette.primaryText}`}>
            {brandName || "SantoSha"}
          </span>
        </Link>
        <nav aria-label="Principal" className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? "page" : undefined}
              className={`whitespace-nowrap transition-colors hover:text-primary ${
                isActive(item.to) ? `${palette.primaryText} underline underline-offset-8 decoration-2` : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden lg:inline-flex items-center whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${palette.primary}`}
          >
            Escribir por WhatsApp
          </a>

          <button
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground/80 hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav aria-label="Principal móvil" className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border/40 shadow-lg py-4 px-6 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              aria-current={isActive(item.to) ? "page" : undefined}
              className={`min-h-[44px] flex items-center font-medium border-b border-border/10 hover:text-primary ${
                isActive(item.to) ? palette.primaryText : "text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className={`min-h-[44px] inline-flex items-center justify-center px-5 py-3 mt-2 rounded-full text-sm font-semibold tracking-wide uppercase ${palette.primary}`}
          >
            Escribir por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
