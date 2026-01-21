import { motion } from "framer-motion";
import { Brain, Heart, Sparkles, Moon } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Claridad Mental",
    description: "Estimula las áreas motoras y sensoriales del cerebro para mejorar tu memoria y agudeza cognitiva.",
  },
  {
    icon: Heart,
    title: "Equilibrio Emocional",
    description: "Reduce los niveles de ansiedad y depresión, fomentando un estado de paz interior y resiliencia.",
  },
  {
    icon: Sparkles,
    title: "Vitalidad",
    description: "Utiliza la respiración consciente y mudras para estimular tus recursos naturales desde la primera práctica.",
  },
  {
    icon: Moon,
    title: "Descanso Profundo",
    description: "Entrena tu cerebro para silenciar el ruido mental, accediendo a niveles de relajación más profundos.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-5">
            Beneficios que <span className="text-gradient">Obtendrás</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Transforma tu bienestar con solo 30 minutos de práctica diaria
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-background border border-border/60 rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <benefit.icon className="w-6 h-6 text-primary" />
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
