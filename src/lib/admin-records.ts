import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "@/lib/db";

export const adminRecordModules = [
  "tags",
  "categories",
  "favorites",
  "chats",
  "links"
] as const;

export type AdminRecordModule = (typeof adminRecordModules)[number];

export type AdminRecord = {
  id: string;
  module: AdminRecordModule;
  title: string;
  content: string;
  url: string;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminRecordInput = {
  title: string;
  content?: string;
  url?: string;
  status?: string;
  sortOrder?: number;
};

type AdminRecordRow = RowDataPacket & {
  id: string;
  module: AdminRecordModule;
  title: string;
  content: string;
  url: string | null;
  status: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export function assertAdminRecordModule(module: string): asserts module is AdminRecordModule {
  if (!adminRecordModules.includes(module as AdminRecordModule)) {
    throw new Error("Unsupported module");
  }
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toAdminRecord(row: AdminRecordRow): AdminRecord {
  return {
    id: row.id,
    module: row.module,
    title: row.title,
    content: row.content,
    url: row.url || "",
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at)
  };
}

export async function listAdminRecords(module: AdminRecordModule) {
  const [rows] = await db.query<AdminRecordRow[]>(
    `SELECT id, module, title, content, url, status, sort_order, created_at, updated_at
     FROM admin_records
     WHERE module = ?
     ORDER BY sort_order ASC, created_at DESC`,
    [module]
  );

  return rows.map(toAdminRecord);
}

export async function createAdminRecord(module: AdminRecordModule, input: AdminRecordInput) {
  const title = input.title.trim();

  if (!title) {
    throw new Error("标题不能为空");
  }

  const record: AdminRecord = {
    id: crypto.randomUUID(),
    module,
    title,
    content: input.content?.trim() || "",
    url: input.url?.trim() || "",
    status: input.status?.trim() || "active",
    sortOrder: Number(input.sortOrder || 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await db.execute<ResultSetHeader>(
    `INSERT INTO admin_records (id, module, title, content, url, status, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id,
      record.module,
      record.title,
      record.content,
      record.url || null,
      record.status,
      record.sortOrder,
      new Date(record.createdAt),
      new Date(record.updatedAt)
    ]
  );

  return record;
}

export async function updateAdminRecord(module: AdminRecordModule, id: string, input: AdminRecordInput) {
  const title = input.title.trim();

  if (!title) {
    throw new Error("标题不能为空");
  }

  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE admin_records
     SET title = ?, content = ?, url = ?, status = ?, sort_order = ?
     WHERE module = ? AND id = ?`,
    [
      title,
      input.content?.trim() || "",
      input.url?.trim() || null,
      input.status?.trim() || "active",
      Number(input.sortOrder || 0),
      module,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await db.query<AdminRecordRow[]>(
    `SELECT id, module, title, content, url, status, sort_order, created_at, updated_at
     FROM admin_records
     WHERE module = ? AND id = ?`,
    [module, id]
  );

  return rows[0] ? toAdminRecord(rows[0]) : null;
}

export async function deleteAdminRecord(module: AdminRecordModule, id: string) {
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM admin_records WHERE module = ? AND id = ?", [module, id]);

  return result.affectedRows > 0;
}
