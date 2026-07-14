import { motion } from "framer-motion";
import RegistrationForm from "./RegistrationForm";
import santoshaLogo from "@/assets/santosha-logo.webp";

const Footer = () => {
  return (
    <footer className="py-24 md:py-32 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Comienza tu <span className="text-primary">Transformación</span>
            </h2>
            <p className="text-muted-foreground">
              Da el primer paso hacia una vida con más claridad, paz y vitalidad.
            </p>
          </div>

          <RegistrationForm />

          <div className="mt-16 pt-8 border-t border-border/40 text-center space-y-6">
            <img 
              src={santoshaLogo} 
              alt="SantoSha Logo" 
              className="h-28 md:h-32 w-auto mx-auto"
            />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SantoSha Yoga. Todos los derechos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
