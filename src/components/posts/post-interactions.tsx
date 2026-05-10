"use client";

import { FormEvent, useEffect, useState } from "react";

import type { InteractionComment } from "@/lib/interactions";

type PostInteractionsProps = {
  slug: string;
};

export function PostInteractions({ slug }: PostInteractionsProps) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<InteractionComment[]>([]);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadInteractions() {
      const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/interactions`, { cache: "no-store" });
      const body = (await response.json()) as { likes: number; comments: InteractionComment[] };

      if (!ignore) {
        setLikes(body.likes);
        setComments(body.comments);
      }
    }

    loadInteractions();

    return () => {
      ignore = true;
    };
  }, [slug]);

  async function likePost() {
    const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "like" })
    });
    const body = (await response.json()) as { likes: number };

    setLikes(body.likes);
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();

    if (!content) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "comment", text: content })
    });
    const body = (await response.json().catch(() => null)) as { comment?: InteractionComment; message?: string } | null;

    setIsSubmitting(false);

    if (!response.ok || !body?.comment) {
      setMessage(body?.message || "评论失败");
      return;
    }

    setComments((current) => [body.comment!, ...current]);
    setText("");
    setMessage("评论已发布");
  }

  return (
    <section className="mt-8 rounded-[28px] border border-ink/10 bg-white/90 p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">互动</h2>
          <p className="mt-1 text-sm text-ink/60">{comments.length} 条评论</p>
        </div>
        <button
          type="button"
          onClick={likePost}
          className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink transition hover:border-clay hover:text-clay"
        >
          喜欢 {likes}
        </button>
      </div>

      <form onSubmit={submitComment} className="mt-6 space-y-3">
        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setMessage("");
          }}
          placeholder="写下你的评论"
          className="min-h-28 w-full resize-none rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          {message ? <p className="text-sm font-semibold text-moss">{message}</p> : <span />}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
          >
            {isSubmitting ? "发布中..." : "发布评论"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl border border-ink/10 bg-mist/55 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{comment.name}</h3>
              <time className="text-xs text-ink/45">{new Date(comment.createdAt).toLocaleString("zh-CN")}</time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink/72">{comment.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
