"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Boxes,
  Users,
  BarChart2,
  Settings,
  UserCircle,
  Palette,
  Droplets,
  Layers,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ElementType };

const nav: NavItem[] = [
  { href: "/Dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/Dashboard/orders", label: "Захиалга", icon: ClipboardList },
  { href: "/processes", label: "Процесс", icon: Boxes },
  { href: "/products", label: "Бүтээгдэхүүн", icon: Package },
  { href: "/employees", label: "Ажилчид", icon: Users },
  { href: "/Dashboard/reports", label: "Тайлан", icon: BarChart2 },
  { href: "/settings", label: "Тохиргоо", icon: Settings },
  { href: "/Dashboard/customers", label: "Үйлчлүүлэгчид", icon: UserCircle },

  // --- NEW LOOKUPS & PROCESSES ---
  { href: "/Dashboard/fiber-types", label: "Fiber Types", icon: Layers },
  { href: "/Dashboard/fiber-colors", label: "Fiber Colors", icon: Palette },
  { href: "/Dashboard/out-colors", label: "Out Colors", icon: Droplets },
  { href: "/Dashboard/p1", label: "P1 Intake", icon: Boxes },
  { href: "/Dashboard/p2-dyeing", label: "P2 Dyeing", icon: Droplets },
  { href: "/Dashboard/p3-carding", label: "P3 Самнах", icon: Boxes },
  { href: "/Dashboard/p4-spinning", label: "P4 Spinning", icon: Boxes },
  { href: "/Dashboard/p5-winding", label: "P5 winding", icon: Boxes },
  { href: "/Dashboard/p6-doubling", label: "P6 Doubling", icon: Boxes },
  { href: "/Dashboard/p7-twisting", label: "P7 Twisting", icon: Boxes },
  { href: "/Dashboard/factory-process", label: "Процесс нэршил", icon: Settings },
  { href: "/Dashboard/bobbins", label: "Боббин", icon: Package },




];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 border-r bg-card text-card-foreground flex flex-col">
      <div className="h-16 flex items-center px-4 border-b font-semibold">
        ҮПМС
      </div>
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
      <div className="p-4 border-t text-xs text-muted-foreground">
        © {new Date().getFullYear()} PPMS
      </div>
    </aside>
  );
}
