import type { Metadata } from "next";
import React from "react";
import { getFaqs } from "@/lib/supabase/queries";
import type { Faq } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about tires, wheels, ordering, shipping, and returns at Tire&Wheel Mart.",
};
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function FAQPage() {
  let faqItems: Faq[] = [];
  try {
    faqItems = await getFaqs();
  } catch {}

  const faqCategories = faqItems.length > 0
    ? faqItems.reduce((cats: { title: string; items: { question: string; answer: string }[] }[], item) => {
        const existing = cats.find((c) => c.title === item.category);
        if (existing) {
          existing.items.push({ question: item.question, answer: item.answer });
        } else {
          cats.push({ title: item.category, items: [{ question: item.question, answer: item.answer }] });
        }
        return cats;
      }, [])
    : [];

  return (
    <div className="flex flex-col items-center bg-white text-foreground py-12 min-h-[calc(100vh-128px)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Find answers to common questions about wheels, tires, and our services
        </p>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem
                    key={itemIndex}
                    value={`item-${categoryIndex}-${itemIndex}`}
                    className="border rounded-lg mb-2 px-4"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            Still have questions?
          </p>
          <p className="text-muted-foreground mb-4">
            Our team is here to help! Contact us for personalized assistance.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

