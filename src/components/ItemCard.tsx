import Image from "next/image";
import { Item } from "@prisma/client";
import { CalendarDays, Flag, MapPin, Package } from "lucide-react";
import { categoryLabels, itemStatusLabels, itemTypeLabels } from "@/lib/constants";

export function ItemCard({ item }: { item: Item }) {
  return (
    <article className="overflow-hidden rounded-lg border border-violet-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-honey">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-violet-300">
            <Package size={44} />
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-school">{itemTypeLabels[item.type]}</p>
            <h2 className="mt-1 text-lg font-bold text-ink">{item.title}</h2>
          </div>
          <span className="rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-900">
            {itemStatusLabels[item.status]}
          </span>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin size={15} />
            {item.location}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={15} />
            {item.eventDate.toLocaleDateString("th-TH")}
          </p>
          <p>{categoryLabels[item.category]} · จำนวน {item.quantity}</p>
        </div>
        {item.description ? <p className="line-clamp-3 text-sm text-slate-700">{item.description}</p> : null}
        <details className="border-t border-violet-100 pt-3">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-violet-900">
            <Flag size={15} />
            รายงานโพสต์
          </summary>
          <form action={`/api/items/${item.id}/report`} method="post" className="mt-3 space-y-2">
            <textarea name="reason" className="field min-h-20" placeholder="เหตุผลที่รายงาน" required />
            <button className="btn-secondary" type="submit">
              ส่งรายงาน
            </button>
          </form>
        </details>
      </div>
    </article>
  );
}
