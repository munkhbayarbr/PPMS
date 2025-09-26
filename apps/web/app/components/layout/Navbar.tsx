"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User } from "lucide-react";
import Image from "next/image";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  return (
    <header className="h-16 border-b bg-card text-card-foreground flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu size={20} />
        </Button>
        <span className="font-semibold">Үйлдвэрлэлийн процессын менежмент</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
            <Image src="/avatar.png" alt="Profile" width={32} height={32} className="rounded-full border" />
            <span className="hidden md:block text-sm font-medium">
              {session?.user?.name ?? session?.user?.email ?? "Хэрэглэгч"}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { /* router.push('/profile') */ }}>
            <User size={16} className="mr-2" /> Профайл
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut size={16} className="mr-2" /> Гарах
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
