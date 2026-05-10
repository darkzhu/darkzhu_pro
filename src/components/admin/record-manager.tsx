"use client";

import { FormEvent, useState } from "react";

import type { AdminRecord, AdminRecordModule } from "@/lib/admin-records";

type RecordForm = {
  title: string;
  content: string;
  url: string;
  status: string;
  sortOrder: number;
};

const emptyForm: RecordForm = {
  title: "",
  content: "",
  url: "",
  status: "active",
  sortOrder: 0
};

function toForm(record: AdminRecord): RecordForm {
  return {
    title: record.title,
    content: record.content,
    url: record.url,
    status: record.status,
    sortOrder: record.sortOrder
  };
}

export function RecordManager({
  module,
  title,
  initialRecords
}: {
  module: AdminRecordModule;
  title: string;
  initialRecords: AdminRecord[];
}) {
  const [records, setRecords] = useState(initialRecords);
  const [editingId, setEditingId] = useState<string | null>(initialRecords[0]?.id ?? null);
  const [form, setForm] = useState<RecordForm>(initialRecords[0] ? toForm(initialRecords[0]) : emptyForm);
  const [message, setMessage] = useState("");

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function edit(record: AdminRecord) {
    setEditingId(record.id);
    setForm(toForm(record));
    setMessage("");
  }

  async function refresh(nextId?: string) {
    const response = await fetch(`/api/admin/records/${module}`, { cache: "no-store" });
    const body = (await response.json()) as { records: AdminRecord[] };
    setRecords(body.records);

    if (nextId) {
      const next = body.records.find((record) => record.id === nextId);

      if (next) {
        setEditingId(next.id);
        setForm(toForm(next));
      }
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(editingId ? `/api/admin/records/${module}/${editingId}` : `/api/admin/records/${module}`, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const body = (await response.json().catch(() => null)) as { record?: AdminRecord; message?: string } | null;

    if (!response.ok || !body?.record) {
      setMessage(body?.message || "保存失败");
      return;
    }

    setMessage("保存成功");
    await refresh(body.record.id);
  }

  async function remove() {
    if (!editingId) {
      return;
    }

    const response = await fetch(`/api/admin/records/${module}/${editingId}`, { method: "DELETE" });

    if (!response.ok) {
      setMessage("删除失败");
      return;
    }

    setMessage("删除成功");
    setEditingId(null);
    setForm(emptyForm);
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
          {records.map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => edit(record)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                editingId === record.id ? "border-clay bg-mist" : "border-ink/10 bg-white hover:border-clay"
              }`}
            >
              <span className="block text-sm font-semibold text-ink">{record.title}</span>
              <span className="mt-1 block text-xs text-ink/55">{record.status}</span>
            </button>
          ))}
        </div>
      </aside>

      <form onSubmit={save} className="rounded-2xl border border-ink/10 bg-white/85 p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-ink">{editingId ? "编辑记录" : "新增记录"}</h2>
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

        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">标题</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
              className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">内容</span>
            <textarea
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              className="min-h-32 w-full resize-y rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">链接</span>
              <input
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">状态</span>
              <input
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-ink">排序</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-clay focus:ring-4 focus:ring-clay/10"
              />
            </label>
          </div>
          {message ? <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-ink">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
