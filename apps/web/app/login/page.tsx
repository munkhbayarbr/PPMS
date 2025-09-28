"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  // If you want to honor a callback in the URL, uncomment next line:
  // const callbackUrl = params.get("callbackUrl") || "/Dashboard";
  const callbackUrl = "/Dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  // Redirect after successful auth (run on client only)
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // Prefill email from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ppms_last_email");
      if (saved) setEmail(saved);
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      // Persist or clear remembered email
      try {
        if (remember) localStorage.setItem("ppms_last_email", email);
        else localStorage.removeItem("ppms_last_email");
      } catch {}

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!res || res.error) {
        // Map common NextAuth error codes to a friendly message
        const message =
          res?.error === "CredentialsSignin"
            ? "И-мэйл эсвэл нууц үг буруу байна"
            : "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.";
        toast.error(message);
        return;
      }

      toast.success("Амжилттай нэвтэрлээ");
      router.push(res.url ?? callbackUrl);
    } catch {
      toast.error("Сүлжээний алдаа. Дараа дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-svh w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-xl">
          <div className="flex flex-col items-center mb-6 space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">Нэвтрэх</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">И-мэйл</Label>
              <Input
                id="email"
                type="email"
                placeholder="ta@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                  aria-label={showPw ? "Нууц үгийг нуух" : "Нууц үгийг харах"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                  disabled={loading}
                />
                Сануулах
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Нэвтэрч байна…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <LogIn size={18} /> Нэвтрэх
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => router.push("/login/register")}
              disabled={loading}
            >
              Бүртгүүлэх
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PPMS
        </p>
      </div>
    </div>
  );
}
