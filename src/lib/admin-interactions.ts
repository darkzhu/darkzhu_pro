import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "@/lib/db";
import type { HoleMessage, InteractionComment } from "@/lib/interactions";

type CommentRow = RowDataPacket & {
  id: string;
  post_slug?: string;
  name: string;
  text: string;
  likes: number;
  created_at: Date;
};

type HoleRow = RowDataPacket & {
  id: string;
  text: string;
  top: number;
  duration: number;
  created_at: Date;
};

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toComment(row: CommentRow): InteractionComment & { postSlug?: string } {
  return {
    id: row.id,
    postSlug: row.post_slug,
    name: row.name,
    text: row.text,
    likes: row.likes,
    createdAt: toIsoString(row.created_at)
  };
}

function toHole(row: HoleRow): HoleMessage {
  return {
    id: row.id,
    text: row.text,
    top: row.top,
    duration: row.duration,
    createdAt: toIsoString(row.created_at)
  };
}

export async function listGuestbookAdmin() {
  const [rows] = await db.query<CommentRow[]>(
    "SELECT id, name, text, likes, created_at FROM guestbook_messages ORDER BY created_at DESC"
  );

  return rows.map(toComment);
}

export async function createGuestbookAdmin(input: { name: string; text: string; likes: number }) {
  const id = crypto.randomUUID();

  await db.execute<ResultSetHeader>(
    "INSERT INTO guestbook_messages (id, name, text, likes, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, input.name.trim() || "访客", input.text.trim(), Number(input.likes || 0), new Date()]
  );

  return id;
}

export async function updateGuestbookAdmin(id: string, input: { name: string; text: string; likes: number }) {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE guestbook_messages SET name = ?, text = ?, likes = ? WHERE id = ?",
    [input.name.trim() || "访客", input.text.trim(), Number(input.likes || 0), id]
  );

  return result.affectedRows > 0;
}

export async function deleteGuestbookAdmin(id: string) {
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM guestbook_messages WHERE id = ?", [id]);

  return result.affectedRows > 0;
}

export async function listCommentsAdmin() {
  const [rows] = await db.query<CommentRow[]>(
    "SELECT id, post_slug, name, text, likes, created_at FROM post_comments ORDER BY created_at DESC"
  );

  return rows.map(toComment);
}

export async function createCommentAdmin(input: { postSlug: string; name: string; text: string; likes: number }) {
  const id = crypto.randomUUID();

  await db.execute<ResultSetHeader>(
    "INSERT INTO post_comments (id, post_slug, name, text, likes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, input.postSlug.trim(), input.name.trim() || "访客", input.text.trim(), Number(input.likes || 0), new Date()]
  );

  return id;
}

export async function updateCommentAdmin(id: string, input: { name: string; text: string; likes: number }) {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE post_comments SET name = ?, text = ?, likes = ? WHERE id = ?",
    [input.name.trim() || "访客", input.text.trim(), Number(input.likes || 0), id]
  );

  return result.affectedRows > 0;
}

export async function deleteCommentAdmin(id: string) {
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM post_comments WHERE id = ?", [id]);

  return result.affectedRows > 0;
}

export async function listHolesAdmin() {
  const [rows] = await db.query<HoleRow[]>(
    "SELECT id, text, top, duration, created_at FROM hole_messages ORDER BY created_at DESC"
  );

  return rows.map(toHole);
}

export async function createHoleAdmin(input: { text: string; top: number; duration: number }) {
  const id = crypto.randomUUID();

  await db.execute<ResultSetHeader>(
    "INSERT INTO hole_messages (id, text, top, duration, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, input.text.trim(), Number(input.top || 0), Number(input.duration || 16), new Date()]
  );

  return id;
}

export async function updateHoleAdmin(id: string, input: { text: string; top: number; duration: number }) {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE hole_messages SET text = ?, top = ?, duration = ? WHERE id = ?",
    [input.text.trim(), Number(input.top || 0), Number(input.duration || 16), id]
  );

  return result.affectedRows > 0;
}

export async function deleteHoleAdmin(id: string) {
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM hole_messages WHERE id = ?", [id]);

  return result.affectedRows > 0;
}
