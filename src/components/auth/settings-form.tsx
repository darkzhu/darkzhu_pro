"use client";

import { FormEvent, useState } from "react";

import { DEFAULT_PROFILE, type SessionUser, type UserProfile } from "@/lib/auth-shared";

type SettingsFormProps = {
  user: SessionUser;
};

export function SettingsForm({ user }: SettingsFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    ...DEFAULT_PROFILE,
    nickname: user.nickname,
    provider: user.provider
  });
  const [saved, setSaved] = useState(false);

  function updateProfile(key: keyof UserProfile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-ink/10 bg-white/85 p-8 shadow-card">
      <div className="grid gap-5">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">昵称</span>
          <input
            value={profile.nickname}
            onChange={(event) => updateProfile("nickname", event.target.value)}
            className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">头像地址</span>
          <input
            value={profile.avatar}
            onChange={(event) => updateProfile("avatar", event.target.value)}
            placeholder="https://..."
            className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink">一句话简介</span>
          <textarea
            value={profile.bio}
            onChange={(event) => updateProfile("bio", event.target.value)}
            className="min-h-28 w-full resize-none rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
          />
        </label>
        <div className="rounded-2xl bg-mist px-4 py-3 text-sm text-ink/68">登录方式：{profile.provider}</div>
        {saved ? <p className="text-sm font-semibold text-moss">已保存个人信息</p> : null}
        <button type="submit" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-clay">
          保存设置
        </button>
      </div>
    </form>
  );
}
