/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CmsForm, getLocalSubmissions, saveLocalSubmissions } from "@/lib/CmsFallbackData";

interface CmsFormRendererProps {
  form: CmsForm;
  pageSlug: string;
  buttonClassName?: string;
}

export const CmsFormRenderer = ({ form, pageSlug, buttonClassName }: CmsFormRendererProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccessRedirect = () => {
    if (form.redirectUrl && form.redirectUrl.trim()) {
      const url = form.redirectUrl.trim();
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.location.href = url;
      } else {
        navigate(url);
      }
    } else {
      setIsSuccess(true);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = form.fields.filter(
      (f) => f.required && (!formData[f.id] || (typeof formData[f.id] === "string" && !formData[f.id].trim()))
    );

    if (missingFields.length > 0) {
      toast({
        title: "Campos pendientes",
        description: `Por favor completa los siguientes campos: ${missingFields.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try to save to Supabase
      const { error } = await supabase.from("cms_submissions").insert({
        form_id: form.id,
        page_slug: pageSlug,
        data: formData,
      });

      if (error) throw error;

      toast({
        title: "¡Formulario enviado!",
        description: "Tus datos se registraron correctamente. Nos comunicaremos contigo a la brevedad.",
      });
      handleSuccessRedirect();
    } catch (dbError) {
      console.warn("Could not save submission to Supabase, backing up to LocalStorage:", dbError);

      // 2. Local fallback if Supabase table is not configured or offline
      try {
        const localSubs = getLocalSubmissions();
        const newSub = {
          id: `sub-local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          formId: form.id,
          pageSlug: pageSlug,
          data: formData,
          createdAt: new Date().toISOString(),
        };
        saveLocalSubmissions([newSub, ...localSubs]);

        toast({
          title: "¡Formulario enviado!",
          description: "Tus datos se guardaron localmente de forma segura. Nos comunicaremos contigo.",
        });
        handleSuccessRedirect();
      } catch (localError) {
        console.error("Local save error:", localError);
        toast({
          title: "Error de conexión",
          description: "No se pudieron guardar los datos. Por favor inténtalo más tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 px-4 bg-primary/10 rounded-2xl border border-primary/20 animate-fade-in">
        <span className="text-4xl block mb-4">✨</span>
        <h4 className="font-serif text-2xl font-semibold mb-2 text-primary">¡Muchas gracias!</h4>
        <p className="text-muted-foreground max-w-md mx-auto">
          Hemos recibido tus datos con éxito. Nuestro equipo se pondrá en contacto contigo muy pronto a través de WhatsApp o correo electrónico para guiarte en tu camino.
        </p>
        <Button 
          variant="outline" 
          onClick={() => {
            setFormData({});
            setIsSuccess(false);
          }} 
          className="mt-6 font-medium"
        >
          Enviar otra consulta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {form.fields.map((field) => {
        const value = formData[field.id] || "";
        return (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-medium text-foreground/90">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>

            {field.type === "textarea" ? (
              <Textarea
                id={field.id}
                placeholder={field.placeholder || `Escribe aquí...`}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                className="min-h-[100px] bg-background border-border focus:border-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary"
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-start gap-3 py-1">
                <input
                  type="checkbox"
                  id={field.id}
                  checked={!!formData[field.id]}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  required={field.required}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <label htmlFor={field.id} className="text-sm leading-none text-muted-foreground select-none">
                  {field.placeholder || "Acepto los términos y condiciones"}
                </label>
              </div>
            ) : field.type === "select" ? (
              <div className="relative">
                <select
                  id={field.id}
                  value={value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>{field.placeholder || "Selecciona una opción"}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder || ""}
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                className="h-12 bg-background border-border focus:border-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary"
              />
            )}
          </div>
        );
      })}

      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full h-13 text-base font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${buttonClassName || ""}`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando...
          </span>
        ) : (
          "Quiero mi acceso gratuito"
        )}
      </Button>

      {/* Trust strip */}
      <div className="flex items-center justify-center gap-4 pt-3 text-[11px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Datos protegidos
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          100% gratuito
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Acceso inmediato
        </span>
      </div>
    </form>
  );
};
