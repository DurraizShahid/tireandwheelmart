import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Tire Selection",
      items: [
        {
          question: "How do I choose the right tire for my vehicle?",
          answer: "The right tire depends on your vehicle type, driving habits, and local climate. All-season tires work well for most drivers, while winter tires are essential for cold climates. Performance tires are ideal for sports cars. Check your vehicle's owner's manual for recommended tire sizes and specifications.",
        },
        {
          question: "What's the difference between all-season, summer, and winter tires?",
          answer: "All-season tires provide balanced performance year-round but may not excel in extreme conditions. Summer tires offer superior dry and wet traction in warm weather but shouldn't be used in freezing temperatures. Winter tires use special rubber compounds and tread patterns designed for snow, ice, and cold weather traction.",
        },
        {
          question: "How often should I replace my tires?",
          answer: "Tires should typically be replaced every 6 years or when tread depth reaches 2/32 of an inch (check local regulations). However, driving conditions, maintenance, and tire quality can affect lifespan. Regular inspections are recommended.",
        },
        {
          question: "Can I mix different tire brands or models?",
          answer: "While it's possible, it's not recommended. Different tire models have varying performance characteristics, which can affect handling, braking, and stability. For best results, use matching tires on all four wheels, or at least matching pairs on each axle.",
        },
      ],
    },
    {
      title: "Wheel Selection",
      items: [
        {
          question: "How do I know what size wheels fit my vehicle?",
          answer: "Check your vehicle's owner's manual or the tire placard on the driver's door jamb for the original wheel size. When upgrading, ensure the new wheels match your vehicle's bolt pattern, offset, center bore, and load capacity. Our team can help you find compatible wheels.",
        },
        {
          question: "What's the difference between alloy and steel wheels?",
          answer: "Alloy wheels are lighter, offer better heat dissipation, and provide more aesthetic options. Steel wheels are more durable, less expensive, and often preferred for winter use. Both have their advantages depending on your needs and budget.",
        },
        {
          question: "Can I install larger wheels on my vehicle?",
          answer: "Yes, but you need to maintain the overall tire diameter to keep your speedometer accurate. Larger wheels typically require lower-profile tires. Always ensure proper clearance and that the wheels meet your vehicle's load requirements.",
        },
      ],
    },
    {
      title: "Installation & Services",
      items: [
        {
          question: "Do you offer tire installation services?",
          answer: "Yes! We offer professional tire mounting and balancing services. Our certified technicians use state-of-the-art equipment to ensure proper installation. Contact us to schedule an appointment.",
        },
        {
          question: "How long does tire installation take?",
          answer: "Standard tire installation typically takes 30-60 minutes for a set of four tires, depending on the vehicle and whether wheel alignment is included. We'll provide an estimated time when you schedule your appointment.",
        },
        {
          question: "Do you offer wheel alignment services?",
          answer: "Yes, we provide wheel alignment services to ensure your vehicle tracks properly and tires wear evenly. We recommend alignment when installing new tires or if you notice uneven tire wear or pulling.",
        },
      ],
    },
    {
      title: "Shipping & Returns",
      items: [
        {
          question: "How long does shipping take?",
          answer: "Shipping times vary by location and product availability. Most orders ship within 1-2 business days, with delivery typically taking 3-7 business days. Express shipping options are available for faster delivery.",
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy on unused tires and wheels in original packaging. Items must be in new, unused condition. Please see our Returns & Refunds page for complete details and return procedures.",
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we ship within the United States. For international shipping inquiries, please contact our customer service team to discuss options.",
        },
      ],
    },
    {
      title: "Warranty & Support",
      items: [
        {
          question: "Do tires come with a warranty?",
          answer: "Yes, most tires come with manufacturer warranties covering defects and tread wear. Warranty terms vary by manufacturer and tire model. We'll provide warranty information with your purchase.",
        },
        {
          question: "What if I have issues with my purchase?",
          answer: "Contact our customer service team immediately. We're committed to resolving any issues quickly and ensuring your satisfaction. You can reach us by phone, email, or through our contact form.",
        },
        {
          question: "Do you offer price matching?",
          answer: "Yes, we offer competitive pricing and will match prices from authorized dealers on identical in-stock items. Contact us with the competitor's price and we'll review your request.",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-12 min-h-[calc(100vh-128px)]">
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

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
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

