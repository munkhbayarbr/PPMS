import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({
  title,
  actions,
  description,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <Breadcrumbs />
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
    </div>
  );
}
