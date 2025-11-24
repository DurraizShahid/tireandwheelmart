import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header"; // Import the new Header
import Footer from "@/components/footer"; // Import the new Footer

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header /> {/* Render the Header */}
          <main className="flex-grow"> {/* Main content area */}
            {children}
          </main>
          <Toaster />
          <Footer /> {/* Render the Footer */}
        </ThemeProvider>
      </body>
    </html>
  );
}