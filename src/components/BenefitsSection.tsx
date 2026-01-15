import { motion } from "framer-motion";
import { Brain, Heart, Sparkles, Moon } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Claridad Mental y Memoria",
    description: "Estimula las áreas motoras y sensoriales del cerebro para revertir la pérdida de memoria y mejorar tu agudeza cognitiva.",
  },
  {
    icon: Heart,
    title: "Equilibrio Emocional",
    description: "Reduce significativamente los niveles de ansiedad y depresión, fomentando un estado de paz interior y resiliencia.",
  },
  {
    icon: Sparkles,
    title: "Vitalidad Inmediata",
    description: "Aprende a utilizar la respiración consciente y mudras para estimular tus recursos naturales y sentirte renovado desde la primera práctica.",
  },
  {
    icon: Moon,
    title: "Descanso Reparador",
    description: "Entrena tu cerebro para silenciar el ruido mental, permitiéndote acceder a niveles de relajación más profundos.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 md:py-28 hero-gradient">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            Beneficios que <span className="text-gradient">Obtendrás</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforma tu bienestar con solo 12 minutos de práctica diaria
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:glow-accent transition-shadow duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
