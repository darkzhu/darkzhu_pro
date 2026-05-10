import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { addHoleMessage, getHoleMessages } from "@/lib/interactions";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json({ messages: await getHoleMessages() });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "hole", 10);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { text?: string } | null;

  try {
    return NextResponse.json({ message: await addHoleMessage(body?.text || "") }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
