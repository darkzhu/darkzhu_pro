import "server-only";

import os from "node:os";

import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "@/lib/db";

export async function logLogin(input: { username: string; ip: string; userAgent: string; success: boolean; message: string }) {
  await db.execute<ResultSetHeader>(
    "INSERT INTO login_logs (id, username, ip, user_agent, success, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [crypto.randomUUID(), input.username, input.ip, input.userAgent.slice(0, 500), input.success ? 1 : 0, input.message, new Date()]
  );
}

export async function listLoginLogs() {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, username, ip, user_agent AS userAgent, success, message, created_at AS createdAt FROM login_logs ORDER BY created_at DESC LIMIT 200"
  );

  return rows;
}

export async function listMenus() {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, parent_id AS parentId, title, href, permission_code AS permissionCode, sort_order AS sortOrder, status FROM admin_menus ORDER BY sort_order ASC, created_at DESC"
  );

  return rows;
}

export function getServiceMonitor() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  return {
    nodeVersion: process.version,
    platform: `${os.type()} ${os.release()}`,
    uptime: Math.round(process.uptime()),
    loadAverage: os.loadavg(),
    memory: {
      total: totalMemory,
      free: freeMemory,
      used: totalMemory - freeMemory
    },
    cpuCount: os.cpus().length
  };
}
