"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/admin-context";
import { useTranslation } from "@/i18n/use-locale";
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
  const { t } = useTranslation();

  const sidebarGroups: SidebarGroup[] = [
    {
      links: [{ name: t("admin.sidebar.dashboard"), href: "/admin", icon: LayoutDashboard }],
    },
    {
      label: t("admin.sidebar.commerce"),
      links: [
        { name: t("admin.sidebar.products"), href: "/admin/products", icon: Package },
        { name: t("admin.sidebar.brands"), href: "/admin/brands", icon: Building2 },
        { name: t("admin.sidebar.categories"), href: "/admin/categories", icon: Tag },
        { name: t("admin.sidebar.promotions"), href: "/admin/promotions", icon: Percent },
        { name: t("admin.sidebar.featuredDeals"), href: "/admin/featured-deals", icon: Star },
        { name: t("admin.sidebar.suppliers"), href: "/admin/suppliers", icon: Users },
        { name: t("admin.sidebar.orders"), href: "/admin/orders", icon: ShoppingCart },
      ],
    },
    {
      label: t("admin.sidebar.customers"),
      links: [
        { name: t("admin.sidebar.customers"), href: "/admin/customers", icon: Users },
        { name: t("admin.sidebar.leads"), href: "/admin/leads", icon: PhoneCall },
        { name: t("admin.sidebar.dialer"), href: "/admin/dialer", icon: Phone },
        { name: t("admin.sidebar.reviews"), href: "/admin/reviews", icon: MessageCircle },
        { name: t("admin.sidebar.testimonials"), href: "/admin/testimonials", icon: MessageSquare },
      ],
    },
    {
      label: t("admin.sidebar.sales"),
      links: [
        { name: t("admin.sidebar.pipeline"), href: "/admin/opportunities", icon: TrendingUp },
      ],
    },
    {
      label: t("admin.sidebar.marketing"),
      links: [
        { name: t("admin.sidebar.emailAutomations"), href: "/admin/email-automations", icon: Mail },
        { name: t("admin.sidebar.smsAutomations"), href: "/admin/sms-automations", icon: Smartphone },
        { name: t("admin.sidebar.integrations"), href: "/admin/integrations", icon: Puzzle },
      ],
    },
    {
      label: t("admin.sidebar.insights"),
      links: [
        { name: t("admin.sidebar.analytics"), href: "/admin/analytics", icon: BarChart3 },
        { name: t("admin.sidebar.siteSettings"), href: "/admin/site-settings", icon: LayoutList },
      ],
    },
    {
      label: t("admin.sidebar.system"),
      links: [{ name: t("admin.sidebar.settings"), href: "/admin/settings", icon: Settings }],
    },
  ];

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
            <TooltipContent side="right">{t("admin.sidebar.logout")}</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("admin.sidebar.logout")}
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
            <Button variant="ghost" size="icon" aria-label={t("admin.sidebar.toggleSidebar")}>
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
