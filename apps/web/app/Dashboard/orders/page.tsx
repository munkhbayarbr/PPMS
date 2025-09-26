import { Button } from "@/components/ui/button";
import PageHeader from "@/app/components/layout/PageHeader"
import { Plus } from "lucide-react";

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Захиалга"
        description="Захиалгуудын жагсаалт, төлөв."
        actions={
          <Button className="bg-primary text-primary-foreground">
            <Plus className="mr-2" size={16} /> Шинэ захиалга
          </Button>
        }
      />

    </div>
  );
}
