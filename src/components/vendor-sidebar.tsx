"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, Store } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const vendorLinks = [
  { name: "Dashboard", href: "/vendor", icon: LayoutDashboard },
  { name: "Products", href: "/vendor/products", icon: Package },
  { name: "Orders", href: "/vendor/orders", icon: ShoppingCart },
];

export function VendorSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={cn("py-4 border-b flex items-center", collapsed && !isMobile ? "px-3 justify-center" : "px-6")}>
        <Link href="/vendor" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-red-600" />
          {(!collapsed || isMobile) && <span className="font-bold text-sm">Vendor Panel</span>}
        </Link>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {vendorLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const linkElement = (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md transition-colors",
                collapsed && !isMobile ? "justify-center px-2 py-2" : "px-3 py-2",
                isActive ? "bg-red-600 text-white" : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {(!collapsed || isMobile) && <span>{link.name}</span>}
            </Link>
          );

          if (collapsed && !isMobile) {
            return (
              <Tooltip key={link.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                <TooltipContent side="right">{link.name}</TooltipContent>
              </Tooltip>
            );
          }
          return linkElement;
        })}
      </nav>
      <div className="px-3 py-4 border-t">
        <div className="px-3 mb-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Back to Store
            </Button>
          </Link>
        </div>
        <Button onClick={() => signOut()} variant="destructive" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          {(!collapsed || isMobile) && "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden lg:flex border-r flex-col bg-background transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      <div className="lg:hidden flex items-center gap-2 mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
