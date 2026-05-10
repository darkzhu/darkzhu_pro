import { NextResponse } from "next/server";

import { deleteEditablePost, getEditablePost, saveEditablePost, type PostInput } from "@/lib/admin-posts";
import { getSessionUser } from "@/lib/auth";

type RouteContext = {
  params: {
    slug: string;
  };
};

async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = getEditablePost(params.slug);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json().catch(() => null)) as PostInput | null;

  if (!input?.title || !input.date || !input.description || !input.category) {
    return NextResponse.json({ message: "Missing required post fields" }, { status: 400 });
  }

  try {
    return NextResponse.json({ post: saveEditablePost(input, params.slug) });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to save post" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const deleted = deleteEditablePost(params.slug);

  return NextResponse.json({ deleted });
}
