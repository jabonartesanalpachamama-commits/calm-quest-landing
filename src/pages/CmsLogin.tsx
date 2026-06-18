import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import santoshaLogo from "@/assets/santosha-logo.jpg";

type Mode = "signin" | "signup";

export const CmsLogin = () => {
  const [mode, setMode] = useState<Mode>("signin");
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

  const finishLogin = async () => {
    // Ensure the user has a session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Confirma tu correo",
        description: "Revisa tu bandeja de entrada para confirmar la cuenta antes de ingresar.",
      });
      return;
    }

    // Bootstrap: the first registered user becomes the administrator
    await supabase.rpc("bootstrap_admin");

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/login` },
        });
        if (error) throw error;
        await finishLogin();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        await finishLogin();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo completar la operación.";
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
    <main className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-[#EBE7DF] rounded-3xl p-8 md:p-10 shadow-[0_10px_30px_-10px_rgba(126,161,114,0.15)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={santoshaLogo}
            alt="SantoSha Logo"
            className="h-20 w-auto mb-6 rounded-2xl border border-[#7EA172]/10"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <h1 className="font-serif text-3xl font-semibold text-[#2C3E2B] mb-2">
            CMS SantoSha
          </h1>
          <p className="text-[#5C6E5B] text-sm max-w-xs leading-relaxed">
            {mode === "signin"
              ? "Panel de control para gestionar páginas, textos, formularios y ver los pacientes registrados."
              : "Crea tu cuenta de administrador. La primera cuenta registrada obtiene acceso completo."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#2C3E2B]">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@santosha.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-[#FBFBFA] border-[#EBE7DF] focus:border-[#7EA172] text-[#2C3E2B] transition-colors focus-visible:ring-1 focus-visible:ring-[#7EA172]"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#2C3E2B]">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-[#FBFBFA] border-[#EBE7DF] focus:border-[#7EA172] text-[#2C3E2B] transition-colors focus-visible:ring-1 focus-visible:ring-[#7EA172]"
            />
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
                Procesando...
              </span>
            ) : (
              mode === "signin" ? "Ingresar al Panel" : "Crear cuenta de administrador"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-sm text-[#7EA172] hover:text-[#6C8E61] font-medium transition-colors"
          >
            {mode === "signin"
              ? "¿Primera vez? Crea tu cuenta de administrador"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-[#EBE7DF]/60 text-center text-xs text-[#5C6E5B]">
          ¿Tienes problemas para ingresar? Por favor contacta al desarrollador.
        </div>
      </motion.div>
    </main>
  );
};

export default CmsLogin;
