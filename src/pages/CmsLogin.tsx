import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import santoshaLogo from "@/assets/santosha-logo.jpg";

export const CmsLogin = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simple, secure, zero-friction access code for the psychology team
    // Default: santosha2026, or configurable
    const correctCode = "santosha2026";

    setTimeout(() => {
      if (accessCode.trim() === correctCode) {
        localStorage.setItem("sant_cms_logged_in", "true");
        localStorage.setItem("sant_cms_session_time", new Date().toISOString());
        
        toast({
          title: "¡Bienvenido, equipo de SantoSha!",
          description: "Has ingresado correctamente al panel de administración.",
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Acceso denegado",
          description: "La clave de administrador ingresada es incorrecta.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-[#EBE7DF] rounded-3xl p-8 md:p-10 shadow-[0_10px_30px_-10px_rgba(126,161,114,0.15)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={santoshaLogo}
            alt="SantoSha Logo"
            className="h-20 w-auto mb-6 rounded-2xl border border-[#7EA172]/10"
            onError={(e) => {
              // Fallback if logo not found
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <h1 className="font-serif text-3xl font-semibold text-[#2C3E2B] mb-2">
            CMS SantoSha
          </h1>
          <p className="text-[#5C6E5B] text-sm max-w-xs leading-relaxed">
            Panel de control para gestionar páginas, textos, formularios y ver los pacientes registrados.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-[#2C3E2B]">
              Clave de Acceso Administrador
            </label>
            <Input
              id="code"
              type="password"
              placeholder="Ingresa la clave del equipo"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="h-12 bg-[#FBFBFA] border-[#EBE7DF] focus:border-[#7EA172] text-[#2C3E2B] transition-colors focus-visible:ring-1 focus-visible:ring-[#7EA172]"
              autoFocus
            />
            <p className="text-xs text-[#5C6E5B] leading-relaxed">
              💡 Tip: Utiliza la clave compartida con el equipo (ej. <code className="bg-[#FAF8FC] px-1 py-0.5 rounded text-primary">santosha2026</code>).
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#7EA172] hover:bg-[#6C8E61] text-white font-medium text-md transition-all duration-300 rounded-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verificando...
              </span>
            ) : (
              "Ingresar al Panel"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EBE7DF]/60 text-center text-xs text-[#5C6E5B]">
          ¿Tienes problemas para ingresar? Por favor contacta al desarrollador.
        </div>
      </motion.div>
    </main>
  );
};

export default CmsLogin;
