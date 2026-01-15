import { motion } from "framer-motion";
import RegistrationForm from "./RegistrationForm";
import heroImage from "@/assets/hero-meditation.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Meditación Kundalini Yoga" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-wide uppercase bg-primary/10 text-primary rounded-full"
            >
              Clase Maestra Gratuita
            </motion.span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight mb-6">
              Despierta tu{" "}
              <span className="text-gradient">Máximo Potencial</span>
            </h1>

            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-muted-foreground mb-8 leading-relaxed">
              Clase Maestra de Kundalini Yoga{" "}
              <span className="text-primary font-semibold">Gratuitamente</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Domina tu enfoque y <strong className="text-foreground">elimina el estrés</strong> con una técnica milenaria de solo 12 minutos respaldada por la ciencia.
            </p>

            {/* Mobile form indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 lg:hidden flex items-center justify-center gap-2 text-muted-foreground"
            >
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-sm">Regístrate abajo</span>
            </motion.div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <RegistrationForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
