import { motion } from "framer-motion";
import { Check } from "lucide-react";

const guarantees = [
  "Sin tarjeta de crédito",
  "Acceso inmediato",
  "100% gratuito",
];

const GuaranteeSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Acceso <span className="text-primary">Inmediato</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
            Al registrarte, obtendrás acceso instantáneo a tu clase gratuita para comenzar tu camino hacia la maestría personal hoy mismo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            {guarantees.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
