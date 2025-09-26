import PageHeader from "@/app/components/layout/PageHeader";
import { KpiSkeleton } from "@/app/components/skeletons/KpiSkeleton";

export default function DashboardPage() {
  // тутамд fetch хийж буй гэж төсөөлье
  return (
    <div>
      <PageHeader title="Хянах самбар" description="Гол үзүүлэлтүүдийн тойм." />
      <KpiSkeleton />
    </div>
  );
}
