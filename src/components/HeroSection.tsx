import { motion } from "framer-motion";
import RegistrationForm from "./RegistrationForm";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-gentle-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10 px-4 py-20 md:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-5 py-2 mb-8 text-sm font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full"
            >
              Clase Maestra Gratuita
            </motion.span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] mb-8">
              Encuentra tu{" "}
              <span className="text-gradient">Paz Interior</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
              Clase Maestra de Kundalini Yoga
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              ¿La incapacidad para gestionar tus emociones está ganando la batalla?
            </p>

            {/* Mobile form indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 lg:hidden flex items-center justify-center gap-2 text-muted-foreground"
            >
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-sm tracking-wide">Regístrate abajo</span>
            </motion.div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <RegistrationForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
