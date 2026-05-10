import { NextResponse } from "next/server";

import { addPostComment, getPostInteractions, likePost } from "@/lib/interactions";
import { checkRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  return NextResponse.json(await getPostInteractions(params.slug));
}

export async function POST(request: Request, { params }: RouteContext) {
  const rateLimit = checkRateLimit(request, "post-interactions", 30);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { action?: string; text?: string } | null;

  try {
    if (body?.action === "like") {
      return NextResponse.json({ likes: await likePost(params.slug) });
    }

    if (body?.action === "comment") {
      return NextResponse.json({ comment: await addPostComment(params.slug, body.text || "") }, { status: 201 });
    }

    return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
