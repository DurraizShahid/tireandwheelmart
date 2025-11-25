"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/admin-context";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-6 border-t">
        <Button
          onClick={logout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r flex-col bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
