"use client";

import { FormEvent, useState } from "react";

type FriendLink = {
  name: string;
  description: string;
  href: string;
  cover: string;
};

const emptyForm = {
  name: "",
  url: "",
  description: "",
  cover: "",
  email: ""
};

export function FriendLinks({ links }: { links: FriendLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/friend-links/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const body = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(body?.message || "提交失败，请稍后再试");
        return;
      }

      setMessage("申请已提交，我会尽快处理。");
      setForm(emptyForm);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">Friends</p>
          <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">友链花园</h1>
          <p className="max-w-2xl text-base leading-7 text-ink/70">
            这里放着一些常去串门的朋友博客，欢迎一起交换日常和灵感。
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setMessage("");
            setError("");
          }}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-clay"
        >
          申请友链
        </button>
      </div>

      {message ? <p className="mt-6 rounded-2xl bg-white/86 px-4 py-3 text-sm font-semibold text-ink shadow-card">{message}</p> : null}

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-[24px] border border-ink/10 bg-white/86 shadow-card transition hover:-translate-y-1 hover:border-clay"
          >
            <div
              className="h-36 bg-cover bg-center"
              style={{ backgroundImage: `url(${link.cover})` }}
              aria-hidden="true"
            />
            <div className="p-6">
              <span className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold text-moss">
                Friend
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{link.name}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{link.description}</p>
            </div>
          </a>
        ))}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <form
            onSubmit={submitApplication}
            className="w-full max-w-xl rounded-[24px] border border-ink/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss">Apply</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink">申请友链</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink transition hover:border-clay hover:text-clay"
                aria-label="关闭申请框"
              >
                x
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">网站名称</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">网站地址</span>
                <input
                  type="url"
                  value={form.url}
                  onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                  required
                  className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">网站描述</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  required
                  className="min-h-24 w-full resize-none rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">背景图片</span>
                <input
                  type="url"
                  value={form.cover}
                  onChange={(event) => setForm((current) => ({ ...current, cover: event.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">邮箱地址</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink transition hover:border-clay hover:text-clay"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? "提交中..." : "提交申请"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
