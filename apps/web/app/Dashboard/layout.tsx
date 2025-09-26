// app/dashboard/layout.tsx
import AppShell from "../components/layout/Appshell"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
