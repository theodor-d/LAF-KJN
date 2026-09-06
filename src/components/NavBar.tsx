import Link from "next/link";
import { LogOut, PackageSearch, PlusCircle, ShieldCheck, Users } from "lucide-react";
import { canManageItems, SessionUser } from "@/lib/auth";
import { roleLabels } from "@/lib/constants";

export function NavBar({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-school">
          <PackageSearch size={22} />
          Lost & Found โรงเรียน
        </Link>

        <nav className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <Link className="btn-secondary min-h-10 px-3" href="/lost/new">
            <PlusCircle size={16} />
            แจ้งของหาย
          </Link>
          {canManageItems(user.role) ? (
            <>
              <Link className="btn-secondary min-h-10 px-3" href="/found/new">
                <PlusCircle size={16} />
                ลงของที่เจอ
              </Link>
              <Link className="btn-secondary min-h-10 px-3" href="/staff">
                <ShieldCheck size={16} />
                เจ้าหน้าที่
              </Link>
            </>
          ) : null}
          {user.role === "ADMIN" ? (
            <Link className="btn-secondary min-h-10 px-3" href="/admin">
              <Users size={16} />
              แอดมิน
            </Link>
          ) : null}
          <span className="col-span-2 rounded-md bg-violet-50 px-3 py-2 text-center text-sm text-violet-900 sm:col-span-1">
            {user.name} · {roleLabels[user.role]}
          </span>
          <form action="/api/auth/logout" method="post">
            <button className="btn-secondary min-h-10 w-full px-3 sm:w-auto" type="submit" title="ออกจากระบบ">
              <LogOut size={16} />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
