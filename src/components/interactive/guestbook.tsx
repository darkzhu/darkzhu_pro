"use client";

import { FormEvent, useEffect, useState } from "react";

import type { InteractionComment } from "@/lib/interactions";

const emojis = ["😊", "✨", "🌷", "💬", "🎵", "☁️"];

export function Guestbook() {
  const [name, setName] = useState("访客");
  const [text, setText] = useState("");
  const [comments, setComments] = useState<InteractionComment[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      const response = await fetch("/api/guestbook", { cache: "no-store" });
      const body = (await response.json()) as { messages: InteractionComment[] };

      if (!ignore) {
        setComments(body.messages);
      }
    }

    loadMessages();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();

    if (!content) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/guestbook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, text: content })
    });
    const body = (await response.json().catch(() => null)) as { message?: InteractionComment | string } | null;

    setIsSubmitting(false);

    if (!response.ok || !body?.message || typeof body.message === "string") {
      setMessage(typeof body?.message === "string" ? body.message : "留言失败");
      return;
    }

    setComments((current) => [body.message as InteractionComment, ...current]);
    setText("");
    setMessage("留言已发布");
  }

  async function likeComment(id: string) {
    const response = await fetch(`/api/guestbook/${encodeURIComponent(id)}/like`, { method: "POST" });
    const body = (await response.json().catch(() => null)) as { message?: InteractionComment } | null;

    if (!response.ok || !body?.message) {
      return;
    }

    setComments((current) => current.map((comment) => (comment.id === id ? body.message! : comment)));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="rounded-[28px] border border-ink/10 bg-white/85 p-6 shadow-card">
        <div className="space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
            placeholder="昵称"
          />
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setMessage("");
            }}
            className="min-h-40 w-full resize-none rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
            placeholder="写点什么..."
          />
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setText((current) => `${current}${emoji}`)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-mist text-lg transition hover:border-clay"
              >
                {emoji}
              </button>
            ))}
          </div>
          {message ? <p className="text-sm font-semibold text-moss">{message}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
          >
            {isSubmitting ? "发送中..." : "发送留言"}
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-[24px] border border-ink/10 bg-white/85 p-5 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-ink">{comment.name}</h2>
                <time className="mt-1 block text-xs text-ink/45">{new Date(comment.createdAt).toLocaleString("zh-CN")}</time>
              </div>
              <button
                type="button"
                onClick={() => likeComment(comment.id)}
                className="rounded-full border border-ink/10 px-3 py-1 text-sm font-semibold text-ink/70 transition hover:border-clay hover:text-clay"
              >
                喜欢 {comment.likes}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/70">{comment.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
