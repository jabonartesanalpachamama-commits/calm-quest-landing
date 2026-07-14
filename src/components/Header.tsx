import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gift, Menu, X } from "lucide-react";
import santoshaLogo from "@/assets/santosha-logo.webp";

interface HeaderProps {
  palette: any;
  brandName?: string;
}

const Header = ({ palette, brandName }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleProgramasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.querySelector("#programas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Navegar a home y luego hacer scroll
      navigate("/");
      setTimeout(() => {
        document.querySelector("#programas")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`py-4 px-6 border-b border-border/40 ${palette.cardBackground} sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-90`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={santoshaLogo}
            alt="SantoSha Logo"
            className="h-10 w-auto rounded-lg border border-border/20"
            onError={(e) => ((e.target as HTMLElement).style.display = "none")}
          />
          <span className={`font-serif text-xl font-semibold ${palette.primaryText}`}>
            {brandName || "SantoSha"}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/quien-soy" className="hover:text-primary transition-colors">Quién Soy</Link>
          <Link to="/filosofia" className="hover:text-primary transition-colors">Filosofía</Link>
          <a
            href="/#programas"
            onClick={handleProgramasClick}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Programas
          </a>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/clase-gratuita"
            className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${palette.primary}`}
          >
            <Gift className="w-4 h-4" /> Clase Gratis
          </Link>
          <button 
            className="md:hidden p-2 text-foreground/80 hover:text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/40 shadow-lg py-4 px-6 flex flex-col gap-4">
          <Link to="/quien-soy" onClick={handleLinkClick} className="text-foreground hover:text-primary font-medium py-2 border-b border-border/10">Quién Soy</Link>
          <Link to="/filosofia" onClick={handleLinkClick} className="text-foreground hover:text-primary font-medium py-2 border-b border-border/10">Filosofía</Link>
          <a
            href="/#programas"
            onClick={handleProgramasClick}
            className="text-foreground hover:text-primary font-medium py-2 border-b border-border/10"
          >
            Programas
          </a>
          <Link to="/blog" onClick={handleLinkClick} className="text-foreground hover:text-primary font-medium py-2 border-b border-border/10">Blog</Link>
          <Link
            to="/clase-gratuita"
            onClick={handleLinkClick}
            className={`inline-flex items-center justify-center gap-1.5 px-5 py-3 mt-2 rounded-full text-sm font-semibold tracking-wide uppercase ${palette.primary}`}
          >
            <Gift className="w-4 h-4" /> Clase Gratis
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
