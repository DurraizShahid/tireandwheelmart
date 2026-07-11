"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Shield } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CategoryDropdown } from "@/components/category-dropdown";
import { useCart } from "@/contexts/cart-context";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistBadge } from "@/components/wishlist/WishlistBadge";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { CompareBar } from "@/components/compare/CompareBar";
import { SearchModal } from "@/components/search/SearchModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Track Order", href: "/track-order" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/admin")) return null;
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <img src="/logo.svg" alt="Tire&Wheel Logo" className="h-8 w-auto" />
          Tire&Wheel
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex flex-grow justify-center items-center space-x-6">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/" ? "text-red-600" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/about" ? "text-red-600" : ""
            }`}
          >
            About
          </Link>
          <CategoryDropdown />
          <Link
            href="/contact"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/contact" ? "text-red-600" : ""
            }`}
          >
            Contact
          </Link>
          <Link
            href="/track-order"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/track-order" ? "text-red-600" : ""
            }`}
          >
            Track Order
          </Link>
        </nav>

        {/* Desktop Search, Admin, and Cart */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="relative w-[200px] h-9 flex items-center gap-2 pl-9 pr-3 rounded-md bg-muted/50 border border-muted hover:border-primary transition-colors"
            aria-label="Open search"
          >
            <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
            <span className="text-sm text-muted-foreground">Search...</span>
          </button>
          <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
          <Link href="/admin" aria-label="Admin panel">
            <Button variant="ghost" size="icon" className="relative">
              <Shield className="h-5 w-5" />
            </Button>
          </Link>
          <WishlistBadge />
          <CartBadge />
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <WishlistBadge className="mr-1" />
          <CartBadge className="mr-2" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
                <img src="/logo.svg" alt="Tire&Wheel Logo" className="h-8 w-auto" />
                Tire&Wheel
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary flex items-center gap-2",
                    pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
                <Show when="signed-out">
                  <div className="flex items-center gap-2 mt-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm">Sign Up</Button>
                    </SignUpButton>
                  </div>
                </Show>
                <Show when="signed-in">
                  <div className="flex justify-center mt-2">
                    <UserButton />
                  </div>
                </Show>
              </nav>
              <button
                onClick={() => setSearchModalOpen(true)}
                className="relative w-full h-9 flex items-center gap-2 pl-9 pr-3 rounded-md bg-muted/50 border border-muted hover:border-primary transition-colors mt-6"
                aria-label="Open search"
              >
                <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
                <span className="text-sm text-muted-foreground">Search...</span>
              </button>
              <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartDrawer />
      <WishlistDrawer />
      <CompareBar />
    </header>
  );
};

export default Header;