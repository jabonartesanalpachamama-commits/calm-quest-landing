
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, User } from "lucide-react";

interface SaleNotification {
  id: number;
  name: string;
  city: string;
  action: string;
  time: string;
}

const mockSales: SaleNotification[] = [
  { id: 1, name: "Maria G.", city: "Bogotá", action: "se registró para la Clase Maestra", time: "hace 2 min" },
  { id: 2, name: "Carlos R.", city: "Medellín", action: "se unió a la comunidad", time: "hace 5 min" },
  { id: 3, name: "Laura F.", city: "Cali", action: "comenzó su transformación", time: "hace 10 min" },
  { id: 4, name: "Andrés M.", city: "Barranquilla", action: "se registró para la Clase Maestra", time: "hace 15 min" },
  { id: 5, name: "Patricia S.", city: "Cartagena", action: "se unió a la comunidad", time: "hace 22 min" },
  { id: 6, name: "Roberto V.", city: "Pereira", action: "comenzó su transformación", time: "hace 30 min" },
  { id: 7, name: "Elena Q.", city: "Bucaramanga", action: "se registró para la Clase Maestra", time: "hace 45 min" },
];

const SalesNotification = () => {
  const [currentSale, setCurrentSale] = useState<SaleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomIndex = Math.floor(Math.random() * mockSales.length);
      setCurrentSale(mockSales[randomIndex]);
      setIsVisible(true);

      // Hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Initial delay before first notification
    const initialDelay = setTimeout(showNotification, 5000);

    // Set interval for subsequent notifications (every 15-25 seconds)
    const interval = setInterval(() => {
      showNotification();
    }, Math.floor(Math.random() * (25000 - 15000 + 1) + 15000));

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentSale && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-[100] max-w-[320px] w-full"
        >
          <div className="bg-card/95 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-xl flex items-center gap-4 glow-primary">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-serif font-semibold text-foreground text-sm truncate">
                  {currentSale.name} de {currentSale.city}
                </span>
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {currentSale.action}
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider">
                {currentSale.time}
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesNotification;
