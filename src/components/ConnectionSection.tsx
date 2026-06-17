import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import instructor from "@/assets/fransury_portal.jpg";

const ConnectionSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-left order-2 lg:order-1"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight">
              ¿La incapacidad para gestionar tus emociones está{" "}
              <span className="text-primary">ganando la batalla?</span>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Las sensaciones de incomodidad que te drenan en tu día a día por no tener la capacidad o las herramientas para gestionar tus emociones y que están afectando no solo tu vitalidad, tu motivación, también la relación con los demás, sí tienen solución.
              </p>

              <p>
                No tienes que aceptar vivir en un estado de descontento, constante irritabilidad y reactividad que nubla tu juicio y afecta tu salud mental y física.
              </p>

              <div className="w-16 h-px bg-primary/30 my-8" />

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-xl md:text-2xl text-foreground font-medium mb-8"
              >
                Nuestra clase gratuita para <span className="text-primary">Crear Equilibrio Emocional</span> te ofrece una solución práctica para calmar tu sistema nervioso y recuperar el control de tus emociones.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-4"
              >
                <Button
                  onClick={scrollToTop}
                  size="lg"
                  className="h-14 px-10 text-lg font-medium glow-primary hover:scale-105 transition-transform"
                >
                  Quiero mi clase gratuita
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10">
              <img
                src={instructor}
                alt="Profesora de Yoga"
                className="w-full h-auto object-cover aspect-[4/5] md:aspect-[3/4] lg:aspect-auto"
              />
            </div>

            {/* Decorative background elements behind image */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl text-accent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionSection;
