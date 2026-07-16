"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/admin-context";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Tag,
  Percent,
  Star,
  LogOut,
  Menu,
  Building2,
  MessageSquare,
  MessageCircle,
  PhoneCall,
  Phone,
  LayoutList,
  Puzzle,
  Mail,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarGroup {
  label?: string;
  links: SidebarLink[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    links: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Commerce",
    links: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Brands", href: "/admin/brands", icon: Building2 },
      { name: "Categories", href: "/admin/categories", icon: Tag },
      { name: "Promotions", href: "/admin/promotions", icon: Percent },
      { name: "Featured Deals", href: "/admin/featured-deals", icon: Star },
      { name: "Suppliers", href: "/admin/suppliers", icon: Users },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Customers",
    links: [
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Leads", href: "/admin/leads", icon: PhoneCall },
      { name: "Dialer", href: "/admin/dialer", icon: Phone },
      { name: "Reviews", href: "/admin/reviews", icon: MessageCircle },
      { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ],
  },
  {
    label: "Sales",
    links: [
      { name: "Pipeline", href: "/admin/opportunities", icon: TrendingUp },
    ],
  },
  {
    label: "Marketing",
    links: [
      { name: "Email Automations", href: "/admin/email-automations", icon: Mail },
      { name: "SMS Automations", href: "/admin/sms-automations", icon: Smartphone },
      { name: "Integrations", href: "/admin/integrations", icon: Puzzle },
    ],
  },
  {
    label: "Insights",
    links: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Site Settings", href: "/admin/site-settings", icon: LayoutList },
    ],
  },
  {
    label: "System",
    links: [{ name: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

function SidebarLinkItem({
  link,
  collapsed,
  isMobile,
  pathname,
  onClick,
}: {
  link: SidebarLink;
  collapsed: boolean;
  isMobile: boolean;
  pathname: string;
  onClick: () => void;
}) {
  const Icon = link.icon;
  const isActive = pathname === link.href;

  const linkElement = (
    <Link
      href={link.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md transition-colors",
        collapsed && !isMobile ? "justify-center px-2 py-2" : "px-3 py-2",
        isActive
          ? "bg-red-600 text-white"
          : "text-foreground hover:bg-muted"
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
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed: collapsed } = useAdmin();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={cn("py-4 border-b flex items-center", collapsed && !isMobile ? "px-3 justify-center" : "px-6")}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Tire&Wheel Logo" className="h-8 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {sidebarGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (!collapsed || isMobile) && (
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.links.map((link) => (
                <SidebarLinkItem
                  key={link.href}
                  link={link}
                  collapsed={collapsed}
                  isMobile={isMobile}
                  pathname={pathname}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-4 border-t">
        {collapsed && !isMobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => signOut()}
                variant="destructive"
                size="icon"
                className="w-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
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
            <Button variant="ghost" size="icon" aria-label="Toggle sidebar menu">
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
