import { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

export async function PageShell({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <>
      <NavBar user={user} />
      <main className="mx-auto max-w-7xl px-4 py-5 sm:py-8">{children}</main>
    </>
  );
}
