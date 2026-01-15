import { motion } from "framer-motion";

const ConnectionSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight">
            ¿Sientes que el agotamiento está{" "}
            <span className="text-gradient">ganando la batalla?</span>
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              ¿Sientes que el agotamiento y la falta de enfoque están ganando la batalla en tu día a día?
            </p>
            
            <p>
              El <strong className="text-foreground">estrés crónico</strong> no solo drena tu vitalidad, sino que puede manifestarse en pensamientos acelerados, tensión muscular e incapacidad para descansar profundamente.
            </p>

            <p>
              No tienes que aceptar vivir en un estado de hiperalerta constante que nubla tu juicio y afecta tu salud a largo plazo.
            </p>

            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-foreground font-medium pt-4"
            >
              Nuestra clase gratuita de <span className="text-primary font-semibold">Kirtan Kriya</span> te ofrece una solución práctica para calmar tu sistema nervioso y recuperar el control total de tu mente.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConnectionSection;
