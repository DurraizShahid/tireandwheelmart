"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Shield } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CategoryDropdown } from "@/components/category-dropdown";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistBadge } from "@/components/wishlist/WishlistBadge";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { CompareBar } from "@/components/compare/CompareBar";
import { SearchModal } from "@/components/search/SearchModal";
import { useTranslation } from "@/i18n/use-locale";
import { LanguageSelector } from "@/i18n/language-selector";

const Header = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="w-full border-b bg-background">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <img src="/logo.svg" alt={t("nav.logo")} className="h-8 w-auto" />
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
            {t("nav.home")}
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/about" ? "text-red-600" : ""
            }`}
          >
            {t("nav.about")}
          </Link>
          <CategoryDropdown />
          <Link
            href="/contact"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/contact" ? "text-red-600" : ""
            }`}
          >
            {t("nav.contact")}
          </Link>
          <Link
            href="/track-order"
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium ${
              pathname === "/track-order" ? "text-red-600" : ""
            }`}
          >
            {t("nav.trackOrder")}
          </Link>
        </nav>

        {/* Desktop Search, Admin, and Cart */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            suppressHydrationWarning
            onClick={() => setSearchModalOpen(true)}
            className="relative w-[200px] h-9 flex items-center gap-2 pl-9 pr-3 rounded-md bg-muted/50 border border-muted hover:border-primary transition-colors"
            aria-label={t("nav.search")}
          >
            <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
                <span className="text-sm text-muted-foreground">{t("nav.search")}</span>
          </button>
          <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
          <LanguageSelector />
          <WishlistBadge />
          <CartBadge />
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">{t("nav.signIn")}</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">{t("nav.signUp")}</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/account/orders">
                <Button variant="ghost" size="sm">{t("nav.myOrders")}</Button>
              </Link>
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
                <span className="sr-only">{t("nav.toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground mb-6">
                <img src="/logo.svg" alt={t("nav.logo")} className="h-8 w-auto" />
                Tire&Wheel
              </Link>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/about" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t("nav.about")}
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/contact" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t("nav.contact")}
                </Link>
                <Link
                  href="/track-order"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/track-order" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t("nav.trackOrder")}
                </Link>
                <div className="mt-2">
                  <LanguageSelector />
                </div>
                <Show when="signed-out">
                  <div className="flex items-center gap-2 mt-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm">{t("nav.signIn")}</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm">{t("nav.signUp")}</Button>
                    </SignUpButton>
                  </div>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/account/orders"
                    className="text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
                  >
                    {t("nav.myOrders")}
                  </Link>
                  <div className="flex justify-center mt-2">
                    <UserButton />
                  </div>
                </Show>
              </nav>
              <button
                suppressHydrationWarning
                onClick={() => setSearchModalOpen(true)}
                className="relative w-full h-9 flex items-center gap-2 pl-9 pr-3 rounded-md bg-muted/50 border border-muted hover:border-primary transition-colors mt-6"
                aria-label={t("nav.search")}
              >
                <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
            <span className="text-sm text-muted-foreground">{t("nav.search")}</span>
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
