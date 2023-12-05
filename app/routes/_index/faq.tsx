import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function Faqs() {
  return (
    <div className="max-w-7xl mx-auto py-24 sm:py-32 px-6 lg:px-8">
      <h1 className="text-4xl font-medium tracking-tight sm:text-5xl text-center wrap-balance">
        Frequently Asked{" "}
        <span className="bg-gradient-to-br from-white to-[hsla(0,0%,100%,.5)] bg-clip-text text-transparent">
          Questions
        </span>
      </h1>
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-xl mx-auto mt-10"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
