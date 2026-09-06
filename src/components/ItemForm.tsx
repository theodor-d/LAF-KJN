import { Category, ItemType } from "@prisma/client";
import { categoryLabels, locations } from "@/lib/constants";

export function ItemForm({ type }: { type: ItemType }) {
  const isFound = type === "FOUND";

  return (
    <form action="/api/items" method="post" encType="multipart/form-data" className="grid gap-5 rounded-lg border border-violet-100 bg-white p-4 shadow-soft sm:p-6">
      <input type="hidden" name="type" value={type} />

      <div className="grid gap-2">
        <label className="label" htmlFor="title">
          ชื่อสิ่งของ
        </label>
        <input id="title" name="title" className="field" required />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <label className="label" htmlFor="quantity">
            จำนวน
          </label>
          <input id="quantity" name="quantity" type="number" min="1" defaultValue="1" className="field" required />
        </div>
        <div className="grid gap-2">
          <label className="label" htmlFor="category">
            หมวดหมู่
          </label>
          <select id="category" name="category" className="field" required>
            {Object.values(Category).map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="label" htmlFor="eventDate">
            วันที่{isFound ? "พบ" : "หาย"}
          </label>
          <input id="eventDate" name="eventDate" type="date" className="field" required />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="label" htmlFor="location">
          สถานที่
        </label>
        <input id="location" name="location" className="field" list="locations" required />
        <datalist id="locations">
          {locations.map((location) => (
            <option key={location} value={location} />
          ))}
        </datalist>
      </div>

      <div className="grid gap-2">
        <label className="label" htmlFor="description">
          รายละเอียดเพิ่มเติม
        </label>
        <textarea id="description" name="description" className="field min-h-28" />
      </div>

      {isFound ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="label" htmlFor="finderName">
              ชื่อผู้นำมาส่ง
            </label>
            <input id="finderName" name="finderName" className="field" />
          </div>
          <div className="grid gap-2">
            <label className="label" htmlFor="finderCode">
              รหัสนักเรียน/บุคลากรผู้นำมาส่ง
            </label>
            <input id="finderCode" name="finderCode" className="field" />
          </div>
        </div>
      ) : null}

      <div className="grid gap-2">
        <label className="label" htmlFor="image">
          รูปภาพ
        </label>
        <input id="image" name="image" type="file" accept="image/*" className="field" />
      </div>

      <button className="btn-primary w-full sm:w-fit" type="submit">
        บันทึกรายการ
      </button>
    </form>
  );
}
