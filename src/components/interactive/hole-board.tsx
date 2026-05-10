"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import type { SessionUser } from "@/lib/auth-shared";
import type { HoleMessage } from "@/lib/interactions";

export function HoleBoard() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [message, setMessage] = useState("");
  const [bullets, setBullets] = useState<HoleMessage[]>([]);
  const [feedback, setFeedback] = useState("");
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    let ignore = false;

    async function syncAuthState() {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const body = (await response.json()) as { user: SessionUser | null };

      if (!ignore) {
        setUser(body.user);
      }
    }

    async function loadBullets() {
      const response = await fetch("/api/hole", { cache: "no-store" });
      const body = (await response.json()) as { messages: HoleMessage[] };

      if (!ignore) {
        setBullets(body.messages);
      }
    }

    syncAuthState();
    loadBullets();
    window.addEventListener("auth-change", syncAuthState);

    return () => {
      ignore = true;
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();

    if (!text || !isAuthenticated) {
      return;
    }

    const response = await fetch("/api/hole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });
    const body = (await response.json().catch(() => null)) as { message?: HoleMessage | string } | null;

    if (!response.ok || !body?.message || typeof body.message === "string") {
      setFeedback(typeof body?.message === "string" ? body.message : "发送失败");
      return;
    }

    setBullets((current) => [...current, body.message as HoleMessage]);
    setMessage("");
    setFeedback("");
  }

  return (
    <section className="rounded-[32px] border border-ink/10 bg-white/85 p-6 shadow-card">
      <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-ink/10 bg-[linear-gradient(135deg,rgba(255,214,231,0.72),rgba(255,247,251,0.92))]">
        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="hole-bullet absolute whitespace-nowrap rounded-full bg-white/88 px-4 py-2 text-sm font-medium text-ink shadow-card"
            style={{ top: `${bullet.top}%`, animationDuration: `${bullet.duration}s` }}
          >
            {bullet.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="absolute inset-x-6 bottom-6 mx-auto flex max-w-2xl gap-3 rounded-full border border-ink/10 bg-white/92 p-2 shadow-card">
          <input
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setFeedback("");
            }}
            disabled={!isAuthenticated}
            placeholder={isAuthenticated ? "写一句想藏起来的话" : "登录后可以发送弹幕"}
            className="min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink/45 disabled:cursor-not-allowed"
          />
          {isAuthenticated ? (
            <button type="submit" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay">
              发送
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay">
              登录
            </Link>
          )}
        </form>
        {feedback ? <p className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-card">{feedback}</p> : null}
      </div>
    </section>
  );
}
