"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react"; // Import social media icons

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-12 mt-16 text-muted-foreground">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info / Logo */}
        <div className="col-span-full md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 text-3xl font-bold text-primary dark:text-primary-foreground mb-4">
            <img src="/logo.svg" alt="Tire&Wheel Logo" className="h-8 w-auto" />
            Tire&Wheel
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Your trusted source for high-quality automotive parts and accessories.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-4">Quick Links</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/category/tires" className="text-sm hover:text-primary transition-colors">
              Shop Categories
            </Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-4">Customer Service</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/track-order" className="text-sm hover:text-primary transition-colors">
              Track Order
            </Link>
            <Link href="/faq" className="text-sm hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/returns" className="text-sm hover:text-primary transition-colors">
              Returns & Refunds
            </Link>
            <Link href="/shipping" className="text-sm hover:text-primary transition-colors">
              Shipping Info
            </Link>
          </nav>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border flex flex-col items-center justify-between gap-4 md:flex-row">
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