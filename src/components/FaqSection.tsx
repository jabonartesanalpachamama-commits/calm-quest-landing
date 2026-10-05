import type React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqSectionProps {
  items: { q: string; a: string }[];
  title?: string;
  titleSlot?: React.ReactNode;
}

const renderAnswer = (a: string) => {
  const match = a.match(/^(\S+)(\s[\s\S]*)?$/);
  if (!match) return a;
  return (
    <>
      <strong className="font-semibold text-foreground">{match[1]}</strong>
      {match[2] ?? ""}
    </>
  );
};

const FaqSection = ({ items, title, titleSlot }: FaqSectionProps) => (
  <section className="w-full">
    {titleSlot}
    {title && <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-6">{title}</h2>}
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
          <AccordionTrigger className="min-h-[44px] py-4 text-left font-serif text-lg text-foreground hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {renderAnswer(item.a)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FaqSection;
