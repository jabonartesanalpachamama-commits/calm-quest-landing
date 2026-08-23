import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Ingresa tu nombre" }).max(100),
  email: z.string().trim().email({ message: "Correo inválido" }).max(255),
});

interface FreeClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FreeClassDialog = ({ open, onOpenChange }: FreeClassDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email });
    if (!parsed.success) {
      toast({
        title: "Revisa tus datos",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("registrations").insert({
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
      });
      if (error && error.code !== "23505") throw error;
      onOpenChange(false);
      navigate("/clase-gratuita");
    } catch {
      toast({
        title: "Error",
        description: "Hubo un problema al registrarte. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Accede a tu Clase Gratuita</DialogTitle>
          <DialogDescription>
            Déjanos tus datos y entra de inmediato, sin costo alguno.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label htmlFor="fc-name" className="block text-sm font-medium mb-2">Nombre</label>
            <Input
              id="fc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              maxLength={100}
              className="h-12"
            />
          </div>
          <div>
            <label htmlFor="fc-email" className="block text-sm font-medium mb-2">Correo Electrónico</label>
            <Input
              id="fc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              maxLength={255}
              className="h-12"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-medium">
            {isSubmitting ? "Procesando..." : "Ver la clase gratuita"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            🔒 Tus datos están seguros y protegidos.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FreeClassDialog;
