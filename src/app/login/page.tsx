import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { schoolDomain } from "@/lib/constants";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSessionUser();
  if (user) redirect("/");

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-violet-100 bg-white/95 p-5 shadow-soft backdrop-blur sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-md bg-school p-3 text-white shadow-sm">
            <LockKeyhole size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">เข้าสู่ระบบ Lost & Found</h1>
            <p className="text-sm text-slate-600">ใช้อีเมล @{schoolDomain} เท่านั้น</p>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <form action="/api/auth/login" method="post" className="grid gap-4">
          <div className="grid gap-2">
            <label className="label" htmlFor="email">
              อีเมลโรงเรียน
            </label>
            <input id="email" name="email" type="email" className="field" placeholder={`student01@${schoolDomain}`} required />
          </div>
          <div className="grid gap-2">
            <label className="label" htmlFor="password">
              รหัสผ่าน
            </label>
            <input id="password" name="password" type="password" className="field" required />
          </div>
          <button className="btn-primary" type="submit">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-5 rounded-md border border-violet-100 bg-honey p-3 text-sm text-violet-900">
          <p className="font-semibold text-ink">บัญชีทดลอง</p>
          <p>student01@{schoolDomain} / password123</p>
          <p>pr@{schoolDomain} / password123</p>
          <p>admin@{schoolDomain} / password123</p>
        </div>
      </section>
    </main>
  );
}
