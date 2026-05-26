import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FloatingCTAProps {
  formAnchor?: string; // e.g. "#form-home-hero"
  ctaText?: string;
  subText?: string;
}

/**
 * Floating CTA bar — appears once the hero form scrolls out of view.
 * On mobile: fixed bottom bar (full width).
 * On desktop: fixed bottom-right card.
 */
const FloatingCTA = ({
  formAnchor = "#form-home-hero",
  ctaText = "Accede a tu Clase Gratuita",
  subText = "🔥 +247 personas se registraron esta semana",
}: FloatingCTAProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleScroll = useCallback(() => {
    if (dismissed) return;

    const anchor = document.querySelector(formAnchor);
    if (!anchor) {
      // Fallback: show after 600px scroll
      setVisible(window.scrollY > 600);
      return;
    }

    const rect = anchor.getBoundingClientRect();
    // Show when the form is completely above the viewport
    setVisible(rect.bottom < -80);
  }, [formAnchor, dismissed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToForm = () => {
    const anchor = document.querySelector(formAnchor);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <>
          {/* ── Mobile: full-width bottom bar ── */}
          <motion.div
            key="floating-cta-mobile"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-card border-t border-border/60 shadow-2xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{subText}</p>
              </div>
              <Button
                id="floating-cta-mobile-btn"
                onClick={scrollToForm}
                size="sm"
                className="shrink-0 rounded-full font-semibold text-xs px-4"
              >
                Registrarme gratis
              </Button>
              <button
                onClick={handleDismiss}
                aria-label="Cerrar"
                className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* ── Desktop: bottom-right card ── */}
          <motion.div
            key="floating-cta-desktop"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block fixed bottom-8 right-8 z-[90] max-w-xs w-full"
          >
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-2xl shadow-foreground/[0.06] relative">
              {/* Dismiss */}
              <button
                onClick={handleDismiss}
                aria-label="Cerrar"
                className="absolute top-3 right-3 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Social counter */}
              <p className="text-xs text-muted-foreground mb-3 pr-4">{subText}</p>

              {/* Trust strip */}
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Gratis
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Sin tarjeta
                </span>
                <span>·</span>
                <span>Acceso inmediato</span>
              </div>

              <Button
                id="floating-cta-desktop-btn"
                onClick={scrollToForm}
                className="w-full rounded-full font-semibold"
              >
                {ctaText}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
