import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import santoshaLogo from "@/assets/santosha-logo-transparent.webp";
import { getWhatsAppUrl } from "@/lib/utils";
import ScrollProgress from "@/components/ScrollProgress";

interface HeaderProps {
  borderless?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  palette: any;
  brandName?: string;
}

type NavLinkItem = { label: string; to: string };

/** Barra editorial: logo al centro y enlaces visibles a ambos lados (sin desplegables). */
export const NAV_LEFT: NavLinkItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Acompañamiento individual", to: "/mi-proceso-individual" },
  { label: "Proceso de pareja", to: "/proceso-de-pareja" },
  { label: "Yoga y meditación", to: "/acompanamiento-individual" },
];
export const NAV_RIGHT: NavLinkItem[] = [
  { label: "Programas", to: "/programas" },
  { label: "Quién soy", to: "/quien-soy" },
  { label: "Blog", to: "/blog" },
];

const NO_PROGRESS = ["/sabiduria-ciclica-esencia-femenina", "/clase-gratuita"];
const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");
const FOCUS = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background";
const BTN = `inline-flex items-center justify-center whitespace-nowrap border border-brand-ink text-brand-ink text-[11px] tracking-[0.28em] uppercase hover:bg-brand-ink hover:text-primary-foreground transition-colors duration-500 ${FOCUS}`;

const isActive = (pathname: string, to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/"));

const NavItem = ({ item, pathname }: { item: NavLinkItem; pathname: string }) => {
  const active = isActive(pathname, item.to);
  return (
    <Link to={item.to} aria-current={active ? "page" : undefined}
      className={`relative py-2 whitespace-nowrap text-[12.5px] tracking-[0.04em] text-brand-ink hover:text-brand-mauve transition-colors duration-300 ${FOCUS}
        after:absolute after:left-0 after:right-0 after:bottom-0.5 after:h-px after:bg-brand-ink after:origin-left after:transition-transform after:duration-500
        ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}>
      {item.label}
    </Link>
  );
};

const Header = ({ borderless }: HeaderProps) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [mobileOpen]);

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-[border-color] duration-500 border-b ${
      scrolled ? "border-border" : borderless ? "border-transparent" : "border-transparent"}`}>
      {!NO_PROGRESS.includes(pathname) && <ScrollProgress />}
      <div className="max-w-[86rem] mx-auto px-5 md:px-8 h-[76px] md:h-[96px] grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        <nav aria-label="Principal" className="hidden xl:flex items-center gap-7 justify-start">
          {NAV_LEFT.map((i) => <NavItem key={i.to} item={i} pathname={pathname} />)}
        </nav>
        <span className="xl:hidden" />

        <Link to="/" className={`justify-self-center ${FOCUS}`} aria-label="SantoSha, inicio">
          <img src={santoshaLogo} alt="SantoSha Logo" className="h-12 md:h-16 w-auto" />
        </Link>

        <div className="flex items-center justify-end gap-7">
          <nav aria-label="Secundaria" className="hidden xl:flex items-center gap-7">
            {NAV_RIGHT.map((i) => <NavItem key={i.to} item={i} pathname={pathname} />)}
          </nav>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={`hidden xl:inline-flex px-6 py-3 ${BTN}`}>
            Escríbeme
          </a>
          <button type="button"
            className={`xl:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-brand-ink ${FOCUS}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen} aria-controls="menu-movil">
            {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.25} /> : <Menu className="w-6 h-6" strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {mobileOpen && createPortal(
        <div id="menu-movil" className="lux xl:hidden fixed inset-x-0 bottom-0 top-[76px] md:top-[96px] z-50 bg-background flex flex-col">
          <nav aria-label="Principal móvil" className="flex-1 overflow-y-auto px-8 py-10">
            <ul className="space-y-1">
              {[...NAV_LEFT, ...NAV_RIGHT].map((item) => {
                const active = isActive(pathname, item.to);
                return (
                  <li key={item.to}>
                    <Link to={item.to} aria-current={active ? "page" : undefined}
                      className={`flex items-center min-h-[56px] font-serif font-light uppercase tracking-[0.14em] text-xl text-brand-ink ${FOCUS}`}>
                      <span className={active ? "border-b border-brand-ink pb-1" : ""}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-6 border-t border-border">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={`w-full min-h-[52px] ${BTN}`}>Escríbeme</a>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Header;
