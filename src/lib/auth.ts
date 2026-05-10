import "server-only";

import { cookies } from "next/headers";

import { type SessionUser } from "@/lib/auth-shared";

export const AUTH_SESSION_COOKIE = "my-blog-session";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  uid?: string;
  nickname: string;
  avatar?: string;
  provider: string;
  role?: string;
  permissions?: string[];
  exp: number;
};

function getJwtSecret() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("Missing required environment variable: AUTH_SECRET");
  }

  return process.env.AUTH_SECRET;
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string) {
  const padded = input.padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

async function sign(data: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getJwtSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  return base64UrlEncode(Buffer.from(signature));
}

export async function createSessionToken(user: SessionUser) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload: SessionPayload = {
    sub: user.username,
    uid: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    provider: user.provider,
    role: user.role,
    permissions: user.permissions || [],
    exp: Math.floor(Date.now() / 1000) + AUTH_SESSION_MAX_AGE
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${header}.${body}`;
  const signature = await sign(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const expectedSignature = await sign(`${header}.${body}`);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;

    if (!payload.sub || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.uid,
      username: payload.sub,
      nickname: payload.nickname || payload.sub,
      avatar: payload.avatar || "",
      provider: payload.provider || "账号登录",
      role: payload.role,
      permissions: payload.permissions || []
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const token = cookies().get(AUTH_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function requirePermission(permission: string) {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  if (user.role !== "admin" && !user.permissions?.includes(permission)) {
    return null;
  }

  return user;
}
