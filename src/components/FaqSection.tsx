import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqSectionProps {
  items: { q: string; a: string }[];
  title?: string;
}

const renderAnswer = (a: string) => {
  const match = a.match(/^(\S+)(\s[\s\S]*)?$/);
  if (!match) return a;
  return (
    <>
      <strong className="font-semibold text-brand-ink">{match[1]}</strong>
      {match[2] ?? ""}
    </>
  );
};

const FaqSection = ({ items, title }: FaqSectionProps) => (
  <section className="w-full">
    {title && <h2 className="font-serif text-3xl text-brand-ink mb-6">{title}</h2>}
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-brand-gold/40">
          <AccordionTrigger className="min-h-[44px] py-3 text-left text-base text-brand-ink hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-brand-ink/90">
            {renderAnswer(item.a)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FaqSection;
