import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(email, name, role, studentCode = null) {
  const passwordHash = await bcrypt.hash("password123", 10);
  return prisma.user.upsert({
    where: { email },
    update: { name, role, studentCode, passwordHash },
    create: { email, name, role, studentCode, passwordHash }
  });
}

async function main() {
  await prisma.report.deleteMany();
  await prisma.claimRecord.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany({ where: { email: { endsWith: "@school.ac.th" } } });

  const admin = await upsertUser("admin@kjn.ac.th", "ผู้ดูแลระบบ", "ADMIN");
  const staff = await upsertUser("pr@kjn.ac.th", "เจ้าหน้าที่ประชาสัมพันธ์", "STAFF");
  const student = await upsertUser("student01@kjn.ac.th", "นักเรียนตัวอย่าง", "STUDENT", "STU001");
  await upsertUser("teacher01@kjn.ac.th", "ครูตัวอย่าง", "TEACHER");

  await prisma.item.createMany({
    data: [
      {
        type: "FOUND",
        status: "FOUND",
        title: "กระเป๋าดินสอสีกรม",
        quantity: 1,
        category: "STATIONERY",
        location: "อาคาร 2 ชั้น 1",
        eventDate: new Date(),
        description: "มีปากกาและไม้บรรทัดอยู่ด้านใน",
        finderName: "เด็กชายต้นกล้า",
        finderCode: "STU245",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdById: staff.id
      },
      {
        type: "LOST",
        status: "FOUND",
        title: "ขวดน้ำสแตนเลส",
        quantity: 1,
        category: "OTHER",
        location: "สนามบาส",
        eventDate: new Date(),
        description: "สีเงิน มีสติกเกอร์ดาว",
        createdById: student.id
      },
      {
        type: "FOUND",
        status: "CLAIMED",
        title: "บัตรนักเรียน",
        quantity: 1,
        category: "DOCUMENT",
        location: "ห้องสมุด",
        eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        finderName: "ครูเวร",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdById: admin.id
      }
    ]
  });

  console.log("Seeded demo users and items");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
