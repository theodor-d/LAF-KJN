# School Lost & Found

MVP ระบบหาของหายสำหรับโรงเรียน สร้างด้วย Next.js 15, TypeScript, Tailwind CSS, Prisma และ SQLite

## ฟีเจอร์

- Login ด้วยอีเมลโดเมนโรงเรียนเท่านั้น
- Role-based access control: นักเรียน, ครู, เจ้าหน้าที่ประชาสัมพันธ์, แอดมิน
- โพสต์ของที่เจอ พร้อมรูป รายละเอียด สถานที่ วันที่ และผู้นำมาส่ง
- โพสต์ตามหาของหาย
- ค้นหาและกรองตามประเภท วันที่ สถานที่ หมวดหมู่ สถานะ
- เจ้าหน้าที่เปลี่ยนสถานะและบันทึกการรับของ
- ระบบรายงานโพสต์ไม่เหมาะสม
- Dashboard แอดมินพร้อมสถิติเบื้องต้น
- รายการของที่เจอกำหนดวันหมดอายุตาม `ITEM_EXPIRE_DAYS`

## ติดตั้ง

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

เปิดเว็บที่ `http://localhost:3000`

ตรวจคุณภาพโค้ดและ build:

```bash
npm run lint
npm run build
```

## บัญชีทดลอง

รหัสผ่านทุกบัญชีคือ `password123`

- `student01@kjn.ac.th` role นักเรียน
- `teacher01@kjn.ac.th` role ครู
- `pr@kjn.ac.th` role เจ้าหน้าที่ประชาสัมพันธ์
- `admin@kjn.ac.th` role แอดมิน

## เปลี่ยนโดเมนโรงเรียน

แก้ค่าใน `.env`

```env
SCHOOL_EMAIL_DOMAIN="your-school.ac.th"
```

จากนั้นปรับอีเมลใน `prisma/seed.mjs` ให้ตรงโดเมนใหม่แล้วรัน

```bash
npm run prisma:seed
```
