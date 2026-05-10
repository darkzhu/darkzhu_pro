import { NextResponse } from "next/server";

import { authenticateUser } from "@/lib/admin-users";
import { logLogin } from "@/lib/admin-system";
import { AUTH_SESSION_COOKIE, AUTH_SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "login", 8);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "登录过于频繁，请稍后再试" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim() || "";
  const password = body?.password || "";
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "";
  const user = await authenticateUser(username, password);

  if (!user) {
    await logLogin({ username, ip, userAgent, success: false, message: "用户名或密码错误" });
    return NextResponse.json({ message: "用户名或密码错误" }, { status: 401 });
  }

  await logLogin({ username, ip, userAgent, success: true, message: "登录成功" });

  const sessionUser = {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    provider: "账号登录",
    role: user.roleCode,
    permissions: user.permissions
  };
  const token = await createSessionToken(sessionUser);
  const response = NextResponse.json({ user: sessionUser });

  response.cookies.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_SESSION_MAX_AGE,
    path: "/"
  });

  return response;
}
