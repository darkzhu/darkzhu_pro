import fs from "node:fs/promises";
import path from "node:path";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { envFlag } from "@/config/runtime";
import { getSessionUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getUploadUrl, uploadDirectory } from "@/lib/upload-paths";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedSvgTypes = new Set(["image/svg+xml"]);
const maxUploadBytes = Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024);

function getExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (extension) {
    return extension;
  }

  return file.type === "image/png" ? ".png" : ".jpg";
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "admin-upload", 20);

  if (rateLimit.limited) {
    return NextResponse.json({ message: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (contentLength > maxUploadBytes) {
    return NextResponse.json({ message: "Upload file is too large" }, { status: 413 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Missing upload file" }, { status: 400 });
  }

  if (!allowedTypes.has(file.type) && !(envFlag("ALLOW_SVG_UPLOADS") && allowedSvgTypes.has(file.type))) {
    return NextResponse.json({ message: "Unsupported image type" }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ message: "Upload file is too large" }, { status: 413 });
  }

  const extension = getExtension(file);
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, bytes, {
      access: "public",
      contentType: file.type
    });

    return NextResponse.json({ url: blob.url });
  }

  await fs.mkdir(uploadDirectory, { recursive: true });

  const targetPath = path.join(uploadDirectory, filename);

  await fs.writeFile(targetPath, bytes);

  return NextResponse.json({ url: getUploadUrl(filename) });
}
