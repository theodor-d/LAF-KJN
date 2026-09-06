import { Category, ItemStatus, ItemType, Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { ItemCard } from "@/components/ItemCard";
import { PageShell } from "@/components/PageShell";
import { categoryLabels, itemStatusLabels, itemTypeLabels, locations } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type HomeProps = {
  searchParams: Promise<{
    q?: string;
    type?: ItemType;
    status?: ItemStatus;
    category?: Category;
    location?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const filters = await searchParams;
  const where: Prisma.ItemWhereInput = {
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q } },
            { description: { contains: filters.q } },
            { location: { contains: filters.q } }
          ]
        }
      : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.location ? { location: { contains: filters.location } } : {}),
    ...(filters.from || filters.to
      ? {
          eventDate: {
            ...(filters.from ? { gte: new Date(filters.from) } : {}),
            ...(filters.to ? { lte: new Date(filters.to) } : {})
          }
        }
      : {})
  };

  const [items, foundCount, lostCount] = await Promise.all([
    prisma.item.findMany({ where, orderBy: { createdAt: "desc" }, take: 60 }),
    prisma.item.count({ where: { type: "FOUND" } }),
    prisma.item.count({ where: { type: "LOST" } })
  ]);

  return (
    <PageShell>
      <section className="mb-6 grid gap-4 md:grid-cols-[1fr_220px_220px] lg:grid-cols-[1fr_280px_280px]">
        <div className="rounded-lg border border-violet-100 bg-white/80 p-4 shadow-soft sm:bg-transparent sm:p-0 sm:shadow-none sm:border-0">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">รายการของหายและของที่เจอ</h1>
          <p className="mt-2 text-slate-600">ค้นหา กรอง และรายงานรายการที่ไม่เหมาะสมได้จากหน้าเดียว</p>
        </div>
        <div className="rounded-lg border border-violet-100 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">ของที่เจอทั้งหมด</p>
          <p className="text-3xl font-bold text-school">{foundCount}</p>
        </div>
        <div className="rounded-lg border border-violet-100 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">โพสต์ตามหาของหาย</p>
          <p className="text-3xl font-bold text-accent">{lostCount}</p>
        </div>
      </section>

      <form className="mb-6 grid gap-3 rounded-lg border border-violet-100 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-7">
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="label" htmlFor="q">
            ค้นหา
          </label>
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
            <input id="q" name="q" defaultValue={filters.q} className="field pl-9" placeholder="ชื่อสิ่งของ/สถานที่" />
          </div>
        </div>
        <FilterSelect name="type" label="ประเภท" value={filters.type} items={itemTypeLabels} />
        <FilterSelect name="category" label="หมวดหมู่" value={filters.category} items={categoryLabels} />
        <FilterSelect name="status" label="สถานะ" value={filters.status} items={itemStatusLabels} />
        <div>
          <label className="label" htmlFor="location">
            สถานที่
          </label>
          <input id="location" name="location" defaultValue={filters.location} className="field mt-1" list="locations" />
          <datalist id="locations">
            {locations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button className="btn-primary w-full" type="submit">
            กรอง
          </button>
        </div>
      </form>

      {items.length ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      ) : (
        <div className="rounded-lg border border-dashed border-violet-200 bg-white p-10 text-center text-slate-600">
          ไม่พบรายการตามเงื่อนไขที่เลือก
        </div>
      )}
    </PageShell>
  );
}

function FilterSelect<T extends string>({
  name,
  label,
  value,
  items
}: {
  name: string;
  label: string;
  value?: T;
  items: Record<T, string>;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} defaultValue={value ?? ""} className="field mt-1">
        <option value="">ทั้งหมด</option>
        {Object.entries(items).map(([key, labelText]) => (
          <option key={key} value={key}>
            {labelText as string}
          </option>
        ))}
      </select>
    </div>
  );
}
