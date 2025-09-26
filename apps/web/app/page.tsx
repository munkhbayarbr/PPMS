import Image, { type ImageProps } from "next/image";
import Link from "next/link";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, className, ...rest } = props;
  return (
    <>
      <Image {...rest} src={srcLight} className={["imgLight", className].join(" ")} />
      <Image {...rest} src={srcDark}  className={["imgDark", className].join(" ")} />
    </>
  );
};

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-0px)]">
      {/* Hero */}
      <section className="bg-card text-card-foreground border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center gap-8">
          <ThemeImage
            srcLight="/ppms-gear.png"
            srcDark="/ppms-gear-dark.png"
            alt="PPMS"
            width={64}
            height={64}
            priority
            className="rounded-md"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Үйлдвэрлэлийн процессын менежментийн систем
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Захиалга, үйлдвэрлэл, агуулах, ээлжийн мэдээллээ нэг цонхноос—түргэн, алдаагүй.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-secondary text-secondary-foreground hover:opacity-90"
              >
                Танилцах
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards (өнгө турших жижиг блок) */}
      <section className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Идэвхтэй захиалга</p>
          <p className="mt-2 text-2xl font-semibold text-primary">24</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Өнөөдрийн үйлдвэрлэл</p>
          <p className="mt-2 text-2xl font-semibold text-secondary">1,280</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Агуулах анхааруулга</p>
          <p className="mt-2 text-2xl font-semibold text-destructive">5</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Амжилттай хаалт</p>
          <p className="mt-2 text-2xl font-semibold text-accent">312</p>
        </div>
      </section>
    </main>
  );
}
