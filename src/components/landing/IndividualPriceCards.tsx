import { Button } from "@/components/ui/button";
import { INDIVIDUAL_PRICES as prices, ORIGINAL_PACKAGE_PRICE, PACKAGE_SAVINGS } from "@/data/individualPrices";
export default function IndividualPriceCards({ singleHref, packageHref }: { singleHref: string; packageHref: string }) {
  return <div className="individual-prices grid md:grid-cols-2 gap-8 items-stretch">
    <article className="individual-price-card bg-card text-foreground">
      <h3>1 Sesión</h3>
      <p className="individual-price-amount"><strong>{prices.single}</strong><span>USD</span></p>
      <div className="flex-grow text-sm text-muted-foreground"><p>Ideal para explorar una situación puntual, tener un primer acercamiento o abordar un bloqueo específico.</p></div>
      <Button asChild variant="outline" className="individual-price-button"><a href={singleHref} target="_blank" rel="noopener noreferrer">Quiero 1 sesión · {prices.single} USD</a></Button>
    </article>
    <article className="individual-price-card individual-price-recommended bg-brand-mauve text-primary-foreground">
      <span className="individual-price-badge">Recomendado</span>
      <h3>3 Sesiones</h3>
      <p className="individual-price-amount"><del>{ORIGINAL_PACKAGE_PRICE} USD</del><strong>{prices.package}</strong><span>USD</span></p>
      <p className="text-sm mb-5">Ahorras {PACKAGE_SAVINGS} USD</p>
      <div className="flex-grow text-sm space-y-3"><p>Proceso de acompañamiento más profundo para trabajar patrones y generar verdaderas herramientas de cambio.</p><p>Incluye una sesión adicional de 30 minutos, de psicoterapia o de yoga y meditación. Precio válido hasta el 31 de diciembre de 2026.</p></div>
      <Button asChild variant="outline" className="individual-price-button individual-price-glow"><a href={packageHref} target="_blank" rel="noopener noreferrer">Quiero 3 sesiones · {prices.package} USD</a></Button>
    </article>
  </div>;
}
