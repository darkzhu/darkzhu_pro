import Link from "next/link";
import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/auth/settings-form";
import { SectionTitle } from "@/components/layout/section-title";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "个人设置"
};

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <SectionTitle eyebrow="Settings" title="个人设置" description="设置昵称、头像和一句话简介。" />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay">
          进入后台
        </Link>
      </div>
      <div className="mt-8">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
