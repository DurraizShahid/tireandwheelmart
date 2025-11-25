import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; // Import Space_Grotesk
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/cart-context";
import Header from "@/components/header"; // Import the new Header
import Footer from "@/components/footer"; // Import the new Footer

// Define Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tire&Wheel E-commerce",
  description: "Modern automotive e-commerce mobile app for selling car parts, accessories, and tires.",
  icons: {
    icon: "/favicon.svg",
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
        className={`${spaceGrotesk.variable} font-sans antialiased flex flex-col min-h-screen`} // Apply Space Grotesk variable and font-sans
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light"]}
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          <CartProvider>
            <Header /> {/* Render the Header */}
            <main className="flex-grow"> {/* Main content area */}
              {children}
            </main>
            <Toaster />
            <Footer /> {/* Render the Footer */}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}