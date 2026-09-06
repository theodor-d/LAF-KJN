import { ItemForm } from "@/components/ItemForm";
import { PageShell } from "@/components/PageShell";
import { requireUser } from "@/lib/auth";

export default async function NewLostPage() {
  await requireUser();

  return (
    <PageShell>
      <div className="mb-5 rounded-lg border border-violet-100 bg-white/80 p-4 shadow-soft sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">โพสต์ตามหาของหาย</h1>
        <p className="mt-2 text-slate-600">ระบุสิ่งของ วันที่หาย สถานที่โดยประมาณ และรายละเอียดที่ช่วยให้พบของเร็วขึ้น</p>
      </div>
      <ItemForm type="LOST" />
    </PageShell>
  );
}
