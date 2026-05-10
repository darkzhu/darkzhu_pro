"use client";

import { FormEvent, useState } from "react";

type InteractionItem = {
  id: string;
  name?: string;
  postSlug?: string;
  text: string;
  likes?: number;
  top?: number;
  duration?: number;
  createdAt: string;
};

type InteractionModule = "guestbook" | "comments" | "holes";

function toForm(item: InteractionItem) {
  return {
    name: item.name || "",
    text: item.text,
    likes: item.likes || 0,
    top: item.top || 0,
    duration: item.duration || 16
  };
}

export function InteractionManager({
  module,
  title,
  initialItems
}: {
  module: InteractionModule;
  title: string;
  initialItems: InteractionItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [form, setForm] = useState(initialItems[0] ? toForm(initialItems[0]) : { name: "", text: "", likes: 0, top: 0, duration: 16 });
  const [message, setMessage] = useState("");
  const selected = items.find((item) => item.id === editingId);

  function startNew() {
    setEditingId(null);
    setForm({ name: "", text: "", likes: 0, top: 12, duration: 16 });
    setMessage("");
  }

  function edit(item: InteractionItem) {
    setEditingId(item.id);
    setForm(toForm(item));
    setMessage("");
  }

  async function refresh() {
    const response = await fetch(`/api/admin/interactions/${module}`, { cache: "no-store" });
    const body = (await response.json()) as { items: InteractionItem[] };
    setItems(body.items);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(editingId ? `/api/admin/interactions/${module}/${editingId}` : `/api/admin/interactions/${module}`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, postSlug: form.name })
    });

    if (!response.ok) {
      setMessage("保存失败");
      return;
    }

    setMessage("保存成功");
    await refresh();
  }

  async function remove() {
    if (!editingId) {
      return;
    }

    const response = await fetch(`/api/admin/interactions/${module}/${editingId}`, { method: "DELETE" });

    if (!response.ok) {
      setMessage("删除失败");
      return;
    }

    setMessage("删除成功");
    setEditingId(null);
    await refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <aside className="rounded-2xl border border-ink/10 bg-white/85 p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button type="button" onClick={startNew} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-clay">
            新建
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => edit(item)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                editingId === item.id ? "border-clay bg-mist" : "border-ink/10 bg-white hover:border-clay"
              }`}
            >
              <span className="block truncate text-sm font-semibold text-ink">{item.name || item.postSlug || "树洞消息"}</span>
              <span className="mt-1 line-clamp-2 text-xs text-ink/55">{item.text}</span>
            </button>
          ))}
        </div>
      </aside>

      <form onSubmit={save} className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-ink">{editingId ? "编辑内容" : "新增内容"}</h2>
          <div className="flex gap-2">
            {editingId ? (
              <button type="button" onClick={remove} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50">
                删除
              </button>
            ) : null}
            <button type="submit" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-clay">
              保存
            </button>
          </div>
        </div>

        {selected || !editingId ? (
          <div className="mt-6 grid gap-4">
            {module !== "holes" ? (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">{module === "comments" ? "文章 Slug / 名称" : "名称"}</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
            ) : null}
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">内容</span>
              <textarea
                value={form.text}
                onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
                className="min-h-40 w-full resize-y rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            {module !== "holes" ? (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">点赞数</span>
                <input
                  type="number"
                  value={form.likes}
                  onChange={(event) => setForm((current) => ({ ...current, likes: Number(event.target.value) }))}
                  className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                />
              </label>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-ink">高度</span>
                  <input
                    type="number"
                    value={form.top}
                    onChange={(event) => setForm((current) => ({ ...current, top: Number(event.target.value) }))}
                    className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-ink">时长</span>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(event) => setForm((current) => ({ ...current, duration: Number(event.target.value) }))}
                    className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
                  />
                </label>
              </div>
            )}
            {message ? <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-ink">{message}</p> : null}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-mist px-4 py-3 text-sm text-ink/65">请先从左侧选择一条记录。</p>
        )}
      </form>
    </div>
  );
}
