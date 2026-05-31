import { Link, useLocation, useNavigate } from "react-router-dom";
import santoshaLogo from "@/assets/santosha-logo.jpg";

interface HeaderProps {
  palette: any;
  brandName?: string;
}

const Header = ({ palette, brandName }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

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
        <Link
          to="/clase-gratuita"
          className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${palette.primary}`}
        >
          🎁 Clase Gratis
        </Link>
      </div>
    </header>
  );
};

export default Header;
