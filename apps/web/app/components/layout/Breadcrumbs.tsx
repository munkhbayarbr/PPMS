"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "dashboard": "Хянах самбар",
  "orders": "Захиалга",
  "processes": "Процесс",
  "products": "Бүтээгдэхүүн",
  "employees": "Ажилчид",
  "reports": "Тайлан",
  "settings": "Тохиргоо",
};

export default function Breadcrumbs() {
  const pathname = usePathname();               // /orders/123/edit
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts.map((seg, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const label = LABELS[seg] ?? decodeURIComponent(seg);
    const isLast = i === parts.length - 1;
    return { href, label, isLast };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav className="text-sm text-muted-foreground">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href="/dashboard" className="hover:underline">Нүүр</Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            <span>/</span>
            {c.isLast ? (
              <span className="text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:underline">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
