"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ClipboardList, Package, Boxes, Users, BarChart2, Settings } from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ElementType; };
const nav: NavItem[] = [
  { href: "/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/Dashboard/orders",    label: "Захиалга",     icon: ClipboardList },
  { href: "/processes", label: "Процесс",      icon: Boxes },
  { href: "/products",  label: "Бүтээгдэхүүн", icon: Package },
  { href: "/employees", label: "Ажилчид",      icon: Users },
  { href: "/reports",   label: "Тайлан",       icon: BarChart2 },
  { href: "/settings",  label: "Тохиргоо",     icon: Settings },
  { href: "/Dashboard/customers",  label: "Үйлчлүүлэгчид",     icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 border-r bg-card text-card-foreground flex flex-col">
      <div className="h-16 flex items-center px-4 border-b font-semibold">ҮПМС</div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition",
                active ? "bg-muted text-primary" : "text-foreground"
              )}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">© {new Date().getFullYear()} PPMS</div>
    </aside>
  );
}
