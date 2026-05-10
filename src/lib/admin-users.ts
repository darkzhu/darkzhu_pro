import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export type Role = {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
};

export type AdminUser = {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  status: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  permissions: string[];
  createdAt: string;
};

type UserRow = RowDataPacket & {
  id: string;
  username: string;
  password_hash: string;
  nickname: string;
  avatar: string | null;
  status: string;
  role_id: string;
  role_code: string;
  role_name: string;
  permissions: string | null;
  created_at: Date;
};

type RoleRow = RowDataPacket & {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string | null;
};

function toPermissions(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function toUser(row: UserRow): AdminUser {
  return {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    avatar: row.avatar || "",
    status: row.status,
    roleId: row.role_id,
    roleCode: row.role_code,
    roleName: row.role_name,
    permissions: toPermissions(row.permissions),
    createdAt: row.created_at.toISOString()
  };
}

function toRole(row: RoleRow): Role {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    permissions: toPermissions(row.permissions)
  };
}

export async function ensureAuthSeeds() {
  const adminRoleId = "00000000-0000-0000-0000-000000000001";
  const userRoleId = "00000000-0000-0000-0000-000000000002";
  const permissions = ["admin:access", "site:manage", "system:manage", "users:manage", "roles:manage", "permissions:manage", "menus:manage", "logs:view", "monitor:view"];

  await db.execute(
    `INSERT INTO roles (id, name, code, description)
     VALUES (?, '超级管理员', 'admin', '拥有所有后台权限')
     ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
    [adminRoleId]
  );
  await db.execute(
    `INSERT INTO roles (id, name, code, description)
     VALUES (?, '普通用户', 'user', '注册用户默认角色')
     ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
    [userRoleId]
  );

  for (const code of permissions) {
    await db.execute(
      `INSERT INTO permissions (id, name, code, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
      [crypto.randomUUID(), code, code, code]
    );
  }

  await db.execute(
    `INSERT IGNORE INTO role_permissions (role_id, permission_id)
     SELECT ?, id FROM permissions`,
    [adminRoleId]
  );
  await db.execute(
    `INSERT IGNORE INTO role_permissions (role_id, permission_id)
     SELECT ?, id FROM permissions WHERE code = 'admin:access'`,
    [userRoleId]
  );

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminUsername && adminPassword) {
    await db.execute(
      `INSERT INTO users (id, username, password_hash, nickname, status, role_id)
       VALUES (?, ?, ?, ?, 'active', ?)
       ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), status = 'active'`,
      [crypto.randomUUID(), adminUsername, hashPassword(adminPassword), adminUsername, adminRoleId]
    );
  }
}

async function getUserByUsername(username: string) {
  await ensureAuthSeeds();
  const [rows] = await db.query<UserRow[]>(
    `SELECT u.id, u.username, u.password_hash, u.nickname, u.avatar, u.status, u.role_id,
            r.code AS role_code, r.name AS role_name,
            GROUP_CONCAT(p.code ORDER BY p.code) AS permissions,
            u.created_at
     FROM users u
     JOIN roles r ON r.id = u.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     WHERE u.username = ?
     GROUP BY u.id, r.id`,
    [username]
  );

  return rows[0] || null;
}

export async function authenticateUser(username: string, password: string) {
  const row = await getUserByUsername(username);

  if (!row || row.status !== "active" || !verifyPassword(password, row.password_hash)) {
    return null;
  }

  return toUser(row);
}

export async function registerUser(input: { username: string; password: string; nickname?: string }) {
  await ensureAuthSeeds();
  const username = input.username.trim();
  const password = input.password;

  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(username)) {
    throw new Error("用户名需为 3-32 位字母、数字、下划线或短横线");
  }

  if (password.length < 6) {
    throw new Error("密码至少 6 位");
  }

  const [roles] = await db.query<(RowDataPacket & { id: string })[]>("SELECT id FROM roles WHERE code = 'user' LIMIT 1");
  const roleId = roles[0]?.id;

  if (!roleId) {
    throw new Error("默认角色未初始化");
  }

  try {
    await db.execute<ResultSetHeader>(
      "INSERT INTO users (id, username, password_hash, nickname, status, role_id) VALUES (?, ?, ?, ?, 'active', ?)",
      [crypto.randomUUID(), username, hashPassword(password), input.nickname?.trim() || username, roleId]
    );
  } catch {
    throw new Error("用户名已存在");
  }
}

export async function upsertOAuthUser(input: { provider: "github"; providerId: string; nickname: string; avatar: string }) {
  await ensureAuthSeeds();

  const username = `${input.provider}_${input.providerId}`;
  const [roles] = await db.query<(RowDataPacket & { id: string })[]>("SELECT id FROM roles WHERE code = 'user' LIMIT 1");
  const roleId = roles[0]?.id;

  if (!roleId) {
    throw new Error("Default role is not initialized");
  }

  await db.execute<ResultSetHeader>(
    `INSERT INTO users (id, username, password_hash, nickname, avatar, status, role_id)
     VALUES (?, ?, ?, ?, ?, 'active', ?)
     ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), avatar = VALUES(avatar), status = 'active'`,
    [crypto.randomUUID(), username, hashPassword(crypto.randomUUID()), input.nickname, input.avatar, roleId]
  );

  const row = await getUserByUsername(username);

  if (!row) {
    throw new Error("OAuth user was not created");
  }

  return toUser(row);
}

export async function listUsers() {
  await ensureAuthSeeds();
  const [rows] = await db.query<UserRow[]>(
    `SELECT u.id, u.username, u.password_hash, u.nickname, u.avatar, u.status, u.role_id,
            r.code AS role_code, r.name AS role_name,
            GROUP_CONCAT(p.code ORDER BY p.code) AS permissions,
            u.created_at
     FROM users u
     JOIN roles r ON r.id = u.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     GROUP BY u.id, r.id
     ORDER BY u.created_at DESC`
  );

  return rows.map(toUser);
}

export async function listRoles() {
  await ensureAuthSeeds();
  const [rows] = await db.query<RoleRow[]>(
    `SELECT r.id, r.name, r.code, r.description, GROUP_CONCAT(p.code ORDER BY p.code) AS permissions
     FROM roles r
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     GROUP BY r.id
     ORDER BY r.created_at ASC`
  );

  return rows.map(toRole);
}

export async function listPermissions() {
  await ensureAuthSeeds();
  const [rows] = await db.query<(RowDataPacket & { id: string; name: string; code: string; description: string })[]>(
    "SELECT id, name, code, description FROM permissions ORDER BY code ASC"
  );

  return rows;
}
