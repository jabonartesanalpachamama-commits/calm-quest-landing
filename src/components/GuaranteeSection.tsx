import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="py-20 md:py-28 hero-gradient">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-8">
            <Mail className="w-10 h-10 text-accent" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Garantía de <span className="text-gradient">Entrega Inmediata</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            Al registrarte, recibirás el enlace de acceso <strong className="text-foreground">inmediatamente</strong> en tu bandeja de entrada para que comiences tu camino hacia la <span className="text-primary font-semibold">maestría personal</span> hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Acceso inmediato</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>100% gratuito</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
