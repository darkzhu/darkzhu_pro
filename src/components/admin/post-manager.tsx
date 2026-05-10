"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { PostFrontmatter } from "@/types/post";

type EditablePost = PostFrontmatter & {
  slug: string;
  content: string;
};

type PostManagerProps = {
  initialPosts: EditablePost[];
  initialMode?: "list" | "new";
};

type PostFormState = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string;
  category: string;
  draft: boolean;
  cover: string;
  content: string;
};

const emptyForm: PostFormState = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  tags: "",
  category: "",
  draft: false,
  cover: "",
  content: ""
};

function toFormState(post: EditablePost): PostFormState {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags.join(", "),
    category: post.category,
    draft: Boolean(post.draft),
    cover: post.cover || "",
    content: post.content
  };
}

function toPayload(form: PostFormState) {
  return {
    ...form,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  };
}

export function PostManager({ initialPosts, initialMode = "list" }: PostManagerProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const initialPost = initialMode === "new" ? null : initialPosts[0] ?? null;
  const [editingSlug, setEditingSlug] = useState<string | null>(initialPost?.slug ?? null);
  const [form, setForm] = useState<PostFormState>(initialPost ? toFormState(initialPost) : emptyForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );

  function updateField(key: keyof PostFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function startNewPost() {
    setEditingSlug(null);
    setForm(emptyForm);
    setMessage("");
  }

  function editPost(post: EditablePost) {
    setEditingSlug(post.slug);
    setForm(toFormState(post));
    setMessage("");
  }

  async function refreshPosts(nextSelectedSlug?: string) {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    const body = (await response.json()) as { posts: EditablePost[] };
    setPosts(body.posts);

    if (nextSelectedSlug) {
      const selected = body.posts.find((post) => post.slug === nextSelectedSlug);

      if (selected) {
        setEditingSlug(selected.slug);
        setForm(toFormState(selected));
      }
    }

    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch(editingSlug ? `/api/admin/posts/${encodeURIComponent(editingSlug)}` : "/api/admin/posts", {
      method: editingSlug ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toPayload(form))
    });
    const body = (await response.json().catch(() => null)) as { post?: EditablePost; message?: string } | null;

    setIsSaving(false);

    if (!response.ok || !body?.post) {
      setMessage(body?.message || "保存失败");
      return;
    }

    setMessage("文章已保存");
    await refreshPosts(body.post.slug);
  }

  async function handleDelete() {
    if (!editingSlug) {
      return;
    }

    const response = await fetch(`/api/admin/posts/${encodeURIComponent(editingSlug)}`, { method: "DELETE" });

    if (!response.ok) {
      setMessage("删除失败");
      return;
    }

    setMessage("文章已删除");
    setEditingSlug(null);
    setForm(emptyForm);
    await refreshPosts();
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    const body = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;

    setIsUploading(false);
    event.target.value = "";

    if (!response.ok || !body?.url) {
      setMessage(body?.message || "上传失败");
      return;
    }

    const uploadedUrl = body.url;

    setForm((current) => ({
      ...current,
      cover: uploadedUrl,
      content: `${current.content.trimEnd()}\n\n![${file.name}](${uploadedUrl})\n`
    }));
    setMessage("图片已上传");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <aside className="rounded-2xl border border-ink/10 bg-white/85 p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">文章列表</h2>
          <button
            type="button"
            onClick={startNewPost}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-clay"
          >
            新建
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {sortedPosts.map((post) => (
            <button
              key={post.slug}
              type="button"
              onClick={() => editPost(post)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                editingSlug === post.slug ? "border-clay bg-mist" : "border-ink/10 bg-white hover:border-clay"
              }`}
            >
              <span className="block text-sm font-semibold text-ink">{post.title}</span>
              <span className="mt-1 block text-xs text-ink/55">{post.date}</span>
            </button>
          ))}
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{editingSlug ? "编辑文章" : "发布文章"}</h2>
            {editingSlug ? (
              <Link href={`/posts/${editingSlug}`} className="mt-1 inline-flex text-sm font-semibold text-moss hover:text-clay">
                查看前台文章
              </Link>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {editingSlug ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                删除
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-60"
            >
              {isSaving ? "保存中..." : "保存文章"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">标题</span>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="留空时根据标题生成"
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">摘要</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              required
              className="min-h-24 w-full resize-none rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">日期</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                required
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">分类</span>
              <input
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                required
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">标签</span>
              <input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="用英文逗号分隔"
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">封面图</span>
              <input
                value={form.cover}
                onChange={(event) => updateField("cover", event.target.value)}
                placeholder="/uploads/image.png"
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            <label className="inline-flex cursor-pointer rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:border-clay hover:text-clay">
              {isUploading ? "上传中..." : "上传图片"}
              <input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="sr-only" />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={form.draft}
              onChange={(event) => updateField("draft", event.target.checked)}
              className="h-4 w-4"
            />
            草稿，不在前台列表展示
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">正文 Markdown</span>
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              className="min-h-[420px] w-full resize-y rounded-2xl border border-ink/15 bg-white px-4 py-3 font-mono text-sm leading-6 text-ink outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
            />
          </label>

          {message ? <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-ink">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
