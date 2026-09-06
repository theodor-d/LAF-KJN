import { ItemForm } from "@/components/ItemForm";
import { PageShell } from "@/components/PageShell";
import { requireRole } from "@/lib/auth";

export default async function NewFoundPage() {
  await requireRole(["STAFF", "ADMIN"]);

  return (
    <PageShell>
      <div className="mb-5 rounded-lg border border-violet-100 bg-white/80 p-4 shadow-soft sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">โพสต์ของที่เจอ</h1>
        <p className="mt-2 text-slate-600">บันทึกรายละเอียดสิ่งของ รูปภาพ สถานที่ วันที่ และผู้นำมาส่ง</p>
      </div>
      <ItemForm type="FOUND" />
    </PageShell>
  );
}
