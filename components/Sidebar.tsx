"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTree,
  Map,
  BarChart3,
  Bell,
  FileText,
  FolderOpen,
  Settings,
  Radar,
} from "lucide-react";
import { cn } from "@/lib/cn";

const MONITORING = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: ListTree },
  { href: "/map", label: "Map View", icon: Map },
  { href: "/risk-analysis", label: "Risk Analysis", icon: BarChart3 },
];

const PLANNED = [
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-forest-700 text-forest-50 shrink-0">
      <div className="flex flex-col h-full sticky top-0 max-h-screen">
        <Link href="/" className="flex items-center gap-3 px-5 pt-6 pb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-600 ring-1 ring-forest-400/40">
            <Radar className="h-4.5 w-4.5 text-emerald-300" size={18} />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-white">YUGBHOOMI</span>
            <span className="block text-[11px] text-forest-100/70 leading-tight">भूमि प्रहरी</span>
            <span className="block text-[10px] text-forest-100/50 leading-tight">Land Acquisition Monitoring System</span>
          </span>
        </Link>

        <nav className="mt-4 flex-1 overflow-y-auto px-3">
          <p className="px-2 text-[10px] font-medium tracking-[0.14em] text-forest-100/45">MONITORING</p>
          <ul className="mt-2 space-y-0.5">
            {MONITORING.map((item) => (
              <NavItem key={item.href} item={item} active={pathname?.startsWith(item.href)} />
            ))}
          </ul>

          <p className="mt-6 px-2 text-[10px] font-medium tracking-[0.14em] text-forest-100/45">PLANNED</p>
          <ul className="mt-2 space-y-0.5">
            {PLANNED.map((item) => (
              <NavItem key={item.href} item={item} active={pathname?.startsWith(item.href)} muted />
            ))}
          </ul>
        </nav>

        <div className="px-4 py-5 text-[11px] text-forest-100/50 border-t border-forest-600/60">
          <p>Infrastructure monitoring prototype</p>
          <span className="mt-2 inline-block rounded bg-forest-600 px-2 py-1 text-[10px] font-medium tracking-wide text-emerald-200">
            SYNTHETIC DATA
          </span>
          <p className="mt-2">Not an official Government of India application.</p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  item,
  active,
  muted,
}: {
  item: { href: string; label: string; icon: any };
  active?: boolean;
  muted?: boolean;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] transition-colors",
          active
            ? "bg-forest-600 text-white font-medium"
            : muted
            ? "text-forest-100/45 hover:text-forest-100/80 hover:bg-forest-600/40"
            : "text-forest-100/80 hover:text-white hover:bg-forest-600/60"
        )}
      >
        <Icon size={16} strokeWidth={1.8} />
        {item.label}
      </Link>
    </li>
  );
}
