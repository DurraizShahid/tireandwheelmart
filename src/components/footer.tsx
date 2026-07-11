"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full border-t bg-background py-8 sm:py-12 mt-16 text-muted-foreground">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {/* Company Info / Logo */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
          <Link href="/" className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-foreground mb-4">
            <img src="/logo.svg" alt="Tire&Wheel Logo" className="h-6 sm:h-8 w-auto" />
            Tire&Wheel
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed max-w-xs">
            Your trusted source for high-quality wheels, tires, and wheel accessories.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Quick Links</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-xs sm:text-sm hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-xs sm:text-sm hover:text-primary transition-colors">
              Shop All Products
            </Link>
            <Link href="/about" className="text-xs sm:text-sm hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-xs sm:text-sm hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Customer Service</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/track-order" className="text-xs sm:text-sm hover:text-primary transition-colors">
              Track Order
            </Link>
            <Link href="/faq" className="text-xs sm:text-sm hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/returns" className="text-xs sm:text-sm hover:text-primary transition-colors">
              Returns & Refunds
            </Link>
            <Link href="/shipping" className="text-xs sm:text-sm hover:text-primary transition-colors">
              Shipping Info
            </Link>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Contact Info</h3>
          <nav className="flex flex-col gap-3">
            <a href="tel:510-581-2200" className="text-xs sm:text-sm hover:text-primary transition-colors flex items-center justify-center sm:justify-start gap-2">
              <Phone className="h-4 w-4" />
              (510) 581-2200
            </a>
            <a href="https://maps.google.com/?q=24087+Mission+Blvd+Hayward+CA+94544" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-primary transition-colors">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <div className="text-left">
                  24087 Mission Blvd<br />
                  Hayward, CA 94544
                </div>
              </div>
            </a>
          </nav>
        </div>

        {/* Follow Us */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 sm:h-6 w-5 sm:w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 sm:h-6 w-5 sm:w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 sm:h-6 w-5 sm:w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row text-center md:text-left">
        <p className="text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tire&Wheel. All rights reserved.
        </p>
        <nav className="flex gap-3 sm:gap-4 lg:gap-6 flex-wrap justify-center md:justify-end">
          <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;