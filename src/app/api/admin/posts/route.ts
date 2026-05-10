import { NextResponse } from "next/server";

import { getEditablePosts, saveEditablePost, type PostInput } from "@/lib/admin-posts";
import { getSessionUser } from "@/lib/auth";

async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ posts: await getEditablePosts() });
}

export async function POST(request: Request) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json().catch(() => null)) as PostInput | null;

  if (!input?.title || !input.date || !input.description || !input.category) {
    return NextResponse.json({ message: "Missing required post fields" }, { status: 400 });
  }

  try {
    return NextResponse.json({ post: await saveEditablePost(input) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to save post" }, { status: 400 });
  }
}
