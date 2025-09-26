"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPw) {
      toast.error("Нууц үг таарахгүй байна");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Бүртгэл амжилтгүй боллоо");
      }

      toast.success("Амжилттай бүртгэгдлээ!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-svh w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-xl">
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-6 space-y-3">
            <Image
              src="/Logo.png"
              alt="PPMS"
              width={160}
              height={80}
              priority
              className="h-16 w-auto"
            />
            <h1 className="text-2xl font-semibold tracking-tight">Бүртгүүлэх</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Нэр</Label>
              <Input
                id="name"
                type="text"
                placeholder="Таны нэр"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">И-мэйл</Label>
              <Input
                id="email"
                type="email"
                placeholder="ta@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Нууц үг давтах</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Бүртгэж байна…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UserPlus size={18} /> Бүртгүүлэх
                </span>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Та бүртгэлтэй юу?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Нэвтрэх
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
