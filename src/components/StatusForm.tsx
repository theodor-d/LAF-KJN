import { Item, ItemStatus } from "@prisma/client";
import { itemStatusLabels } from "@/lib/constants";

export function StatusForm({ item }: { item: Item }) {
  return (
    <form action={`/api/items/${item.id}/status`} method="post" className="grid gap-3 rounded-md border border-violet-100 bg-violet-50/60 p-3">
      <div className="grid gap-2 md:grid-cols-2">
        <select name="status" defaultValue={item.status} className="field">
          {Object.values(ItemStatus).map((status) => (
            <option key={status} value={status}>
              {itemStatusLabels[status]}
            </option>
          ))}
        </select>
        <input name="receiverName" className="field" placeholder="ชื่อผู้รับของ เมื่อรับคืน" />
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <input name="receiverCode" className="field" placeholder="รหัสนักเรียน/บุคลากร" />
        <input name="receiverEmail" type="email" className="field" placeholder="อีเมลผู้รับ" />
        <input name="note" className="field" placeholder="หมายเหตุการยืนยันตัวตน" />
      </div>
      <button className="btn-primary w-full sm:w-fit" type="submit">
        อัปเดตสถานะ
      </button>
    </form>
  );
}
