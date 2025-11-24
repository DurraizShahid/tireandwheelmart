"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-8 mt-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} Tire&Wheel. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;