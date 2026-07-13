import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; // Import Space_Grotesk
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { CompareProvider } from "@/contexts/compare-context";
import Header from "@/components/header";
import { LeadCreator } from "@/components/LeadCreator";
import Footer from "@/components/footer"; // Import the new Footer
import { AnnouncementBar } from "@/components/promotions/AnnouncementBar";

// Define Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tire&Wheel Mart – Premium Tires, Wheels & Accessories",
    template: "%s | Tire&Wheel Mart",
  },
  description:
    "Shop premium tires, wheels, and automotive accessories at Tire&Wheel Mart. All-season, summer, winter tires and more with expert support.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Tire&Wheel Mart – Premium Tires, Wheels & Accessories",
    description:
      "Shop premium tires, wheels, and automotive accessories at Tire&Wheel Mart.",
    siteName: "Tire&Wheel Mart",
    type: "website",
    locale: "en_US",
    url: "https://tireandwheelmart.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tire&Wheel Mart – Premium Tires, Wheels & Accessories",
    description:
      "Shop premium tires, wheels, and automotive accessories at Tire&Wheel Mart.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <ClerkProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light"]}
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
          >
          <CartProvider>
          <WishlistProvider>
          <CompareProvider>
          <div className="sticky top-0 z-50 w-full">
            <AnnouncementBar />
            <Header />
          </div>
          <main id="main-content" className="flex-grow outline-none">
          {children}
          </main>
          <LeadCreator />
          <Toaster />
          <Footer /> {/* Render the Footer */}
          </CompareProvider>
          </WishlistProvider>
          </CartProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}