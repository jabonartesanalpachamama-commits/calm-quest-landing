import { motion } from "framer-motion";

const ConnectionSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-10 leading-tight">
            ¿El agotamiento está{" "}
            <span className="text-gradient">ganando la batalla?</span>
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              El estrés crónico drena tu vitalidad, manifestándose en pensamientos acelerados, tensión muscular e incapacidad para descansar profundamente.
            </p>

            <p>
              No tienes que aceptar vivir en un estado de hiperalerta constante que nubla tu juicio y afecta tu salud.
            </p>

            <div className="w-16 h-px bg-primary/30 mx-auto my-10" />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-foreground font-medium"
            >
              Nuestra clase gratuita de <span className="text-primary">Kirtan Kriya</span> te ofrece una solución práctica para calmar tu sistema nervioso y recuperar el control de tu mente.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConnectionSection;
