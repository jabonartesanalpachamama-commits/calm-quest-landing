/**
 * Separador suave entre capítulos con fondos distintos: degradado de 80 px con un borde ondulado muy sutil.
 * `from` y `to` son colores CSS (p. ej. "hsl(var(--brand-cream))").
 */
export const SectionTransition = ({ from, to, wave = true, className = "" }: { from: string; to: string; wave?: boolean; className?: string }) => (
  <div aria-hidden="true" className={`relative h-20 w-full ${className}`} style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}>
    {wave && (
      <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 1440 24" preserveAspectRatio="none">
        <path d="M0 24 C 360 4, 1080 4, 1440 24 Z" fill={to} />
      </svg>
    )}
  </div>
);

export default SectionTransition;
