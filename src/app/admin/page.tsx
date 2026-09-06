import { Role } from "@prisma/client";
import { ReactNode } from "react";
import { BarChart3, MapPin, Users } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { requireRole } from "@/lib/auth";
import { itemStatusLabels, itemTypeLabels, roleLabels, schoolDomain, itemExpireDays } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);

  const [users, byType, byStatus, topLocations, openReports] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.item.groupBy({ by: ["type"], _count: true }),
    prisma.item.groupBy({ by: ["status"], _count: true }),
    prisma.item.groupBy({
      by: ["location"],
      _count: true,
      orderBy: { _count: { location: "desc" } },
      take: 5
    }),
    prisma.report.count({ where: { status: "OPEN" } })
  ]);

  return (
    <PageShell>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_240px_240px]">
        <div className="rounded-lg border border-violet-100 bg-white/80 p-4 shadow-soft lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard แอดมิน</h1>
          <p className="mt-2 text-slate-600">
            โดเมนที่อนุญาต @{schoolDomain} · อายุรายการของที่เจอ {itemExpireDays} วัน
          </p>
        </div>
        <Metric icon={<Users size={20} />} label="ผู้ใช้ทั้งหมด" value={users.length} />
        <Metric icon={<BarChart3 size={20} />} label="รายงานเปิดอยู่" value={openReports} />
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Panel title="จำนวนตามประเภท">
          {byType.map((row) => (
            <StatRow key={row.type} label={itemTypeLabels[row.type]} value={row._count} />
          ))}
        </Panel>
        <Panel title="จำนวนตามสถานะ">
          {byStatus.map((row) => (
            <StatRow key={row.status} label={itemStatusLabels[row.status]} value={row._count} />
          ))}
        </Panel>
        <Panel title="สถานที่เจอบ่อย">
          {topLocations.map((row) => (
            <StatRow key={row.location} label={row.location} value={row._count} />
          ))}
        </Panel>
      </section>

      <section className="rounded-lg border border-violet-100 bg-white shadow-soft">
        <div className="border-b border-violet-100 p-4">
          <h2 className="text-xl font-bold text-ink">จัดการผู้ใช้เบื้องต้น</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-violet-50 text-violet-900">
              <tr>
                <th className="px-4 py-3">ชื่อ</th>
                <th className="px-4 py-3">อีเมล</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">รหัสนักเรียน</th>
                <th className="px-4 py-3">สร้างเมื่อ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-violet-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">{roleLabels[user.role as Role]}</td>
                  <td className="px-4 py-3 text-slate-600">{user.studentCode ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{user.createdAt.toLocaleDateString("th-TH")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-white p-4 shadow-soft">
      <h2 className="mb-3 flex items-center gap-2 font-bold text-ink">
        <MapPin size={18} />
        {title}
      </h2>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-violet-50 px-3 py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <span className="font-bold text-school">{value}</span>
    </div>
  );
}
