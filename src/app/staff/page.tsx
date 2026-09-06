import { ItemType } from "@prisma/client";
import { ReactNode } from "react";
import { AlertTriangle, Clock, PackageCheck } from "lucide-react";
import { StatusForm } from "@/components/StatusForm";
import { PageShell } from "@/components/PageShell";
import { requireRole } from "@/lib/auth";
import { categoryLabels, itemStatusLabels, itemTypeLabels } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function StaffPage() {
  await requireRole(["STAFF", "ADMIN"]);

  const [items, reports, expiringSoon] = await Promise.all([
    prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      include: { claimRecord: true, createdBy: true },
      take: 80
    }),
    prisma.report.findMany({
      where: { status: "OPEN" },
      include: { item: true, reporter: true },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.item.count({
      where: {
        type: ItemType.FOUND,
        status: "FOUND",
        expiresAt: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  return (
    <PageShell>
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-violet-100 bg-white/80 p-4 shadow-soft md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">หน้าจัดการเจ้าหน้าที่</h1>
          <p className="mt-2 text-slate-600">เปลี่ยนสถานะ บันทึกการรับของ และติดตามรายการที่ต้องตรวจสอบ</p>
        </div>
        <Metric icon={<PackageCheck size={20} />} label="รายการทั้งหมด" value={items.length} />
        <Metric icon={<Clock size={20} />} label="ใกล้หมดอายุใน 3 วัน" value={expiringSoon} />
      </section>

      {reports.length ? (
        <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle size={18} />
            รายงานโพสต์ที่รอตรวจสอบ
          </h2>
          <div className="grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-md bg-white p-3 text-sm shadow-sm">
                <p className="font-semibold text-slate-900">{report.item.title}</p>
                <p className="text-slate-600">ผู้รายงาน: {report.reporter.name}</p>
                <p className="text-slate-700">เหตุผล: {report.reason}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-violet-100 bg-white p-4 shadow-soft">
            <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-semibold uppercase text-school">{itemTypeLabels[item.type]}</p>
                <h2 className="text-xl font-bold text-ink">{item.title}</h2>
                <p className="text-sm text-slate-600">
                  {categoryLabels[item.category]} · {item.location} · {item.eventDate.toLocaleDateString("th-TH")}
                </p>
                <p className="text-sm text-slate-600">
                  สร้างโดย {item.createdBy.name} · หมดอายุ {item.expiresAt ? item.expiresAt.toLocaleDateString("th-TH") : "-"}
                </p>
              </div>
              <span className="h-fit rounded-md bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-900">
                {itemStatusLabels[item.status]}
              </span>
            </div>

            {item.claimRecord ? (
              <div className="mb-3 rounded-md bg-honey p-3 text-sm text-violet-950">
                รับคืนโดย {item.claimRecord.receiverName} วันที่ {item.claimRecord.claimedAt.toLocaleDateString("th-TH")}
              </div>
            ) : null}

            <StatusForm item={item} />
          </article>
        ))}
      </section>
    </PageShell>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-white p-4 shadow-soft">
      <div className="mb-2 flex items-center gap-2 text-school">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
