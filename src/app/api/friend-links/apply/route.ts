import { NextResponse } from "next/server";

import { sendMail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";

type FriendLinkApplication = {
  name?: string;
  url?: string;
  description?: string;
  cover?: string;
  email?: string;
};

const ownerEmail = process.env.FRIEND_LINK_NOTIFY_EMAIL || "2283587900@qq.com";

function normalizeUrl(value: string) {
  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid URL protocol");
  }

  return url.toString();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "friend-link-apply", 5);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "提交太频繁，请稍后再试" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as FriendLinkApplication | null;
  const name = body?.name?.trim() || "";
  const description = body?.description?.trim() || "";
  const email = body?.email?.trim() || "";
  const cover = body?.cover?.trim() || "";

  if (name.length < 1 || name.length > 80) {
    return NextResponse.json({ message: "请填写 1-80 字的网站名称" }, { status: 400 });
  }

  if (description.length < 1 || description.length > 500) {
    return NextResponse.json({ message: "请填写 1-500 字的网站描述" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "请填写有效邮箱" }, { status: 400 });
  }

  let url = "";
  let coverUrl = "";

  try {
    url = normalizeUrl(body?.url || "");
    coverUrl = cover ? normalizeUrl(cover) : "";
  } catch {
    return NextResponse.json({ message: "请填写有效链接" }, { status: 400 });
  }

  const text = [
    "新的友链申请",
    "",
    `网站名称: ${name}`,
    `网站地址: ${url}`,
    `网站描述: ${description}`,
    `背景图片: ${coverUrl || "未填写"}`,
    `联系邮箱: ${email}`
  ].join("\n");

  const html = `
    <h2>新的友链申请</h2>
    <p><strong>网站名称：</strong>${escapeHtml(name)}</p>
    <p><strong>网站地址：</strong><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
    <p><strong>网站描述：</strong>${escapeHtml(description)}</p>
    <p><strong>背景图片：</strong>${coverUrl ? `<a href="${escapeHtml(coverUrl)}">${escapeHtml(coverUrl)}</a>` : "未填写"}</p>
    <p><strong>联系邮箱：</strong>${escapeHtml(email)}</p>
  `;

  try {
    await sendMail({
      to: ownerEmail,
      subject: `友链申请：${name}`,
      text,
      html
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "邮件发送失败，请稍后再试" }, { status: 500 });
  }
}
