import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_URL } from "@/lib/utils";


const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error: dbError } = await supabase
        .from("registrations")
        .insert({ name: name.trim(), email: email.trim().toLowerCase() });
      
      if (dbError) {
        if (dbError.code === "23505") {
          window.location.href = WHATSAPP_URL;
          return;
        }
        throw dbError;
      }

      window.location.href = WHATSAPP_URL;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al registrarte. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <motion.div
      className="bg-card border border-border/60 rounded-2xl p-8 md:p-10"
    >
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-3">
          Accede a tu Clase Gratuita
        </h3>
        <p className="text-muted-foreground">
          Obtén acceso inmediato sin costo alguno.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nombre
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 bg-background border-border focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Correo Electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-background border-border focus:border-primary transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-medium transition-all duration-300"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando...
            </span>
          ) : (
            "Quiero mi clase gratuita"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        🔒 Tus datos están seguros y protegidos.
      </p>
    </motion.div>
  );
};

export default RegistrationForm;
