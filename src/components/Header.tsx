import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import santoshaLogo from "@/assets/santosha-logo-transparent.webp";
import { getWhatsAppUrl } from "@/lib/utils";

interface HeaderProps {
  borderless?: boolean;
  palette: any;
  brandName?: string;
}

type NavLinkItem = { label: string; to: string; hint?: string };
type NavGroup = { label: string; items: NavLinkItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Psicoterapia",
    items: [
      { label: "Acompañamiento individual", to: "/mi-proceso-individual", hint: "Sesión 1 a 1 por videollamada" },
      { label: "Proceso de pareja", to: "/proceso-de-pareja", hint: "En pareja" },
    ],
  },
  {
    label: "Yoga y meditación",
    items: [
      { label: "Yoga y meditación 1:1", to: "/acompanamiento-individual", hint: "Clases privadas" },
      { label: "Curso de iniciación", to: "/curso-iniciacion-yoga", hint: "6 módulos, un año" },
      { label: "Sabiduría Cíclica", to: "/sabiduria-ciclica-esencia-femenina", hint: "Taller en vivo" },
      { label: "Clase gratuita", to: "/clase-gratuita", hint: "30 minutos gratis" },
    ],
  },
  {
    label: "Quién soy",
    items: [
      { label: "Mi historia", to: "/quien-soy", hint: "Trayectoria y formación" },
      { label: "Filosofía", to: "/filosofia", hint: "El enfoque de SantoSha" },
    ],
  },
];

const WHATSAPP_HREF = getWhatsAppUrl("Hola Fransury, quiero información para agendar una sesión.");
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const ACTIVE_LINE = "after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-0.5 after:bg-brand-gold after:rounded-full";

const Dropdown = ({ group, active }: { group: NavGroup; active: boolean }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = `menu-${group.label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) { setOpen(false); btnRef.current?.focus(); }
        if (e.key === "ArrowDown" && !open) { e.preventDefault(); setOpen(true); }
      }}
    >
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`relative inline-flex items-center gap-1 py-2 rounded-md whitespace-nowrap text-brand-ink hover:text-[#795D64] transition-colors ${FOCUS} ${active ? ACTIVE_LINE : ""}`}
      >
        {group.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div
        id={id}
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 ${open ? "visible opacity-100" : "invisible opacity-0"} transition-opacity duration-150`}
      >
        <ul className="w-72 bg-card rounded-2xl border border-border/50 shadow-xl p-2">
          {group.items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 hover:bg-brand-cream/70 transition-colors ${FOCUS}`}
              >
                <span className="block font-medium text-brand-ink">{item.label}</span>
                {item.hint && <span className="block text-xs text-muted-foreground mt-0.5">{item.hint}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Header = ({ borderless }: HeaderProps) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
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

  const groupActive = (g: NavGroup) => g.items.some((i) => i.to === pathname);

  return (
    <header
      className={`sticky top-0 z-50 py-3 px-6 bg-brand-cream/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_20px_-12px_hsl(var(--brand-ink)/0.35)]" : borderless ? "" : "border-b border-border/30"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className={`flex items-center gap-3 shrink-0 rounded-lg ${FOCUS}`} aria-label="SantoSha, inicio">
          <img
            src={santoshaLogo}
            alt="SantoSha Logo"
            className="h-10 md:h-14 lg:h-16 w-auto"
          />
        </Link>

        <nav aria-label="Principal" className="hidden lg:flex items-center gap-7 text-[15px] font-medium">
          {NAV_GROUPS.map((g) => <Dropdown key={g.label} group={g} active={groupActive(g)} />)}
          <Link
            to="/blog"
            aria-current={pathname.startsWith("/blog") ? "page" : undefined}
            className={`relative py-2 rounded-md text-brand-ink hover:text-[#795D64] transition-colors ${FOCUS} ${pathname.startsWith("/blog") ? ACTIVE_LINE : ""}`}
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden lg:inline-flex items-center whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold bg-[#795D64] hover:bg-[#6A5057] text-white transition-colors ${FOCUS}`}
          >
            Agendar por WhatsApp
          </a>
          <button
            type="button"
            className={`lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-brand-ink ${FOCUS}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            aria-controls="menu-movil"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && createPortal(
        <div id="menu-movil" className="lg:hidden fixed inset-x-0 bottom-0 top-[64px] md:top-[80px] z-50 bg-brand-cream flex flex-col">
          <nav aria-label="Principal móvil" className="flex-1 overflow-y-auto px-6 py-4">
            {NAV_GROUPS.map((g) => {
              const isOpen = openGroup === g.label;
              const panel = `movil-${g.label.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <div key={g.label} className="border-b border-brand-gold/30">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpenGroup(isOpen ? null : g.label)}
                    className={`w-full min-h-[56px] flex items-center justify-between font-serif text-2xl text-brand-ink ${FOCUS}`}
                  >
                    <span className={groupActive(g) ? "underline decoration-brand-gold decoration-2 underline-offset-8" : ""}>{g.label}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <ul id={panel} className="pb-3">
                      {g.items.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            aria-current={pathname === item.to ? "page" : undefined}
                            className={`block min-h-[44px] py-2.5 pl-3 rounded-lg ${FOCUS}`}
                          >
                            <span className="block font-medium text-brand-ink">{item.label}</span>
                            {item.hint && <span className="block text-sm text-muted-foreground">{item.hint}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <Link to="/blog" className={`flex items-center min-h-[56px] font-serif text-2xl text-brand-ink border-b border-brand-gold/30 ${FOCUS}`}>
              Blog
            </Link>
          </nav>
          <div className="p-4 border-t border-brand-gold/30 bg-brand-cream">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={`min-h-[48px] w-full inline-flex items-center justify-center rounded-full text-base font-semibold bg-[#795D64] text-white ${FOCUS}`}
            >
              Agendar por WhatsApp
            </a>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Header;
