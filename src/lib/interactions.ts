import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type InteractionComment = {
  id: string;
  name: string;
  text: string;
  likes: number;
  createdAt: string;
};

export type HoleMessage = {
  id: string;
  text: string;
  top: number;
  duration: number;
  createdAt: string;
};

type CommentRow = RowDataPacket & {
  id: string;
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

type LikeRow = RowDataPacket & {
  likes: number;
};

function trimText(text: string, maxLength: number) {
  return text.trim().slice(0, maxLength);
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toComment(row: CommentRow): InteractionComment {
  return {
    id: row.id,
    name: row.name,
    text: row.text,
    likes: row.likes,
    createdAt: toIsoString(row.created_at)
  };
}

function toHoleMessage(row: HoleRow): HoleMessage {
  return {
    id: row.id,
    text: row.text,
    top: row.top,
    duration: row.duration,
    createdAt: toIsoString(row.created_at)
  };
}

export async function getPostInteractions(slug: string) {
  const [[likeRows], [commentRows]] = await Promise.all([
    db.query<LikeRow[]>("SELECT likes FROM post_likes WHERE post_slug = ?", [slug]),
    db.query<CommentRow[]>(
      "SELECT id, name, text, likes, created_at FROM post_comments WHERE post_slug = ? ORDER BY created_at DESC",
      [slug]
    )
  ]);

  return {
    likes: likeRows[0]?.likes ?? 0,
    comments: commentRows.map(toComment)
  };
}

export async function likePost(slug: string) {
  await db.execute<ResultSetHeader>(
    `INSERT INTO post_likes (post_slug, likes)
     VALUES (?, 1)
     ON DUPLICATE KEY UPDATE likes = likes + 1`,
    [slug]
  );

  const [rows] = await db.query<LikeRow[]>("SELECT likes FROM post_likes WHERE post_slug = ?", [slug]);
  return rows[0]?.likes ?? 1;
}

export async function addPostComment(slug: string, text: string) {
  const user = await getSessionUser();
  const content = trimText(text, 1000);

  if (!content) {
    throw new Error("评论内容不能为空");
  }

  const comment: InteractionComment = {
    id: crypto.randomUUID(),
    name: user?.nickname || "访客",
    text: content,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  await db.execute<ResultSetHeader>(
    "INSERT INTO post_comments (id, post_slug, name, text, likes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [comment.id, slug, comment.name, comment.text, comment.likes, new Date(comment.createdAt)]
  );

  return comment;
}

export async function getGuestbookMessages() {
  const [rows] = await db.query<CommentRow[]>(
    "SELECT id, name, text, likes, created_at FROM guestbook_messages ORDER BY created_at DESC"
  );

  return rows.map(toComment);
}

export async function addGuestbookMessage(name: string, text: string) {
  const content = trimText(text, 1000);

  if (!content) {
    throw new Error("留言内容不能为空");
  }

  const message: InteractionComment = {
    id: crypto.randomUUID(),
    name: trimText(name, 40) || "访客",
    text: content,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  await db.execute<ResultSetHeader>(
    "INSERT INTO guestbook_messages (id, name, text, likes, created_at) VALUES (?, ?, ?, ?, ?)",
    [message.id, message.name, message.text, message.likes, new Date(message.createdAt)]
  );

  return message;
}

export async function likeGuestbookMessage(id: string) {
  const [result] = await db.execute<ResultSetHeader>("UPDATE guestbook_messages SET likes = likes + 1 WHERE id = ?", [
    id
  ]);

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await db.query<CommentRow[]>(
    "SELECT id, name, text, likes, created_at FROM guestbook_messages WHERE id = ?",
    [id]
  );

  return rows[0] ? toComment(rows[0]) : null;
}

export async function getHoleMessages() {
  const [rows] = await db.query<HoleRow[]>(
    "SELECT id, text, top, duration, created_at FROM hole_messages ORDER BY created_at ASC"
  );

  return rows.map(toHoleMessage);
}

export async function addHoleMessage(text: string) {
  const content = trimText(text, 280);

  if (!content) {
    throw new Error("内容不能为空");
  }

  const [countRows] = await db.query<(RowDataPacket & { count: number })[]>("SELECT COUNT(*) AS count FROM hole_messages");
  const count = countRows[0]?.count ?? 0;
  const message: HoleMessage = {
    id: crypto.randomUUID(),
    text: content,
    top: 12 + ((count * 17) % 72),
    duration: 16 + (content.length % 7),
    createdAt: new Date().toISOString()
  };

  await db.execute<ResultSetHeader>(
    "INSERT INTO hole_messages (id, text, top, duration, created_at) VALUES (?, ?, ?, ?, ?)",
    [message.id, message.text, message.top, message.duration, new Date(message.createdAt)]
  );
  await db.execute(
    `DELETE FROM hole_messages
     WHERE id NOT IN (
       SELECT id FROM (
         SELECT id FROM hole_messages ORDER BY created_at DESC LIMIT 80
       ) recent_messages
     )`
  );

  return message;
}
