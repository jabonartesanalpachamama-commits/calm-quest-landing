import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PLAYFAIR = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const LORA = { fontFamily: "'Lora', Georgia, serif" } as const;

export const CmsLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already signed in as admin, go straight to the panel
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roles) navigate("/admin");
    };
    check();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No se pudo iniciar la sesión. Inténtalo de nuevo.");

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleRow) {
        await supabase.auth.signOut();
        toast({
          title: "Acceso no autorizado",
          description: "Tu cuenta no tiene permisos de administrador. Contacta al equipo de SantoSha.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "¡Bienvenido, equipo de SantoSha!",
        description: "Has ingresado correctamente al panel de administración.",
      });
      navigate("/admin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      toast({
        title: "Acceso denegado",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2E1020] p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-5xl md:h-[640px] bg-white rounded-3xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Brand Visual Panel */}
        <div className="hidden md:flex w-1/2 bg-[#2E1020] flex-col justify-between p-16 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-[#A64179] opacity-10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-[#E9C9DA] opacity-5 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative z-10"
          >
            <h1 style={PLAYFAIR} className="text-5xl text-white font-medium tracking-tight">
              Santo<span className="italic text-[#A64179]">Sha</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10"
          >
            <div className="w-12 h-1 bg-[#A64179] mb-6" />
            <p style={LORA} className="text-[#E9C9DA] text-xl leading-relaxed max-w-xs font-light">
              Administración unificada para tu santuario de bienestar.
            </p>
          </motion.div>
        </div>

        {/* Login Form Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-[#FCF7F9]">
          <div className="max-w-sm w-full mx-auto">
            <header className="mb-10 text-center md:text-left">
              <h2 style={PLAYFAIR} className="text-3xl text-[#2E1020] font-bold mb-2">
                Panel de administración
              </h2>
              <p style={LORA} className="text-[#2E1020]/60 text-sm">
                Acceso seguro al panel de SantoSha.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  style={LORA}
                  className="block text-xs uppercase tracking-widest font-bold text-[#2E1020]/80"
                >
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@santosha.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={LORA}
                  className="h-auto w-full px-4 py-4 rounded-xl border-[#E9C9DA] bg-white text-[#2E1020] placeholder:text-[#2E1020]/30 transition-all focus-visible:ring-2 focus-visible:ring-[#A64179] focus-visible:border-transparent"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  style={LORA}
                  className="block text-xs uppercase tracking-widest font-bold text-[#2E1020]/80"
                >
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={LORA}
                  className="h-auto w-full px-4 py-4 rounded-xl border-[#E9C9DA] bg-white text-[#2E1020] placeholder:text-[#2E1020]/30 transition-all focus-visible:ring-2 focus-visible:ring-[#A64179] focus-visible:border-transparent"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                style={LORA}
                className="w-full h-auto bg-[#A64179] hover:bg-[#8e3767] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-[#A64179]/30 active:scale-[0.98] mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            <div className="mt-10 pt-6 border-t border-[#E9C9DA]/60 text-center">
              <p style={LORA} className="text-[#2E1020]/40 text-xs leading-relaxed">
                Las cuentas se crean únicamente desde el panel interno.
                <br />
                ¿Problemas para ingresar? Contacta al desarrollador.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default CmsLogin;
