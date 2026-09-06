import { PrismaClient, Role, Category, ItemStatus, ItemType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(email: string, name: string, role: Role, studentCode?: string) {
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

  const admin = await upsertUser("admin@kjn.ac.th", "ผู้ดูแลระบบ", Role.ADMIN);
  const staff = await upsertUser("pr@kjn.ac.th", "เจ้าหน้าที่ประชาสัมพันธ์", Role.STAFF);
  const student = await upsertUser("student01@kjn.ac.th", "นักเรียนตัวอย่าง", Role.STUDENT, "STU001");
  await upsertUser("teacher01@kjn.ac.th", "ครูตัวอย่าง", Role.TEACHER);

  await prisma.item.createMany({
    data: [
      {
        type: ItemType.FOUND,
        status: ItemStatus.FOUND,
        title: "กระเป๋าดินสอสีกรม",
        quantity: 1,
        category: Category.STATIONERY,
        location: "อาคาร 2 ชั้น 1",
        eventDate: new Date(),
        description: "มีปากกาและไม้บรรทัดอยู่ด้านใน",
        finderName: "เด็กชายต้นกล้า",
        finderCode: "STU245",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdById: staff.id
      },
      {
        type: ItemType.LOST,
        status: ItemStatus.FOUND,
        title: "ขวดน้ำสแตนเลส",
        quantity: 1,
        category: Category.OTHER,
        location: "สนามบาส",
        eventDate: new Date(),
        description: "สีเงิน มีสติกเกอร์ดาว",
        createdById: student.id
      },
      {
        type: ItemType.FOUND,
        status: ItemStatus.CLAIMED,
        title: "บัตรนักเรียน",
        quantity: 1,
        category: Category.DOCUMENT,
        location: "ห้องสมุด",
        eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        finderName: "ครูเวร",
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdById: admin.id
      }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
