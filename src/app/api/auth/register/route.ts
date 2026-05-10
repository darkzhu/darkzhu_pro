import { NextResponse } from "next/server";

import { envFlag } from "@/config/runtime";
import { registerUser } from "@/lib/admin-users";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!envFlag("ENABLE_PUBLIC_REGISTER")) {
    return NextResponse.json({ message: "Registration is disabled" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, "register", 5);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "注册过于频繁，请稍后再试" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string; nickname?: string } | null;

  try {
    await registerUser({
      username: body?.username || "",
      password: body?.password || "",
      nickname: body?.nickname
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "注册失败" }, { status: 400 });
  }
}
