import path from "node:path";

export const uploadDirectory = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

export const uploadPublicPath = (process.env.UPLOAD_PUBLIC_PATH || "/uploads").replace(/\/$/, "");

export function getUploadUrl(filename: string) {
  return `${uploadPublicPath}/${filename}`;
}

export function getUploadFilePath(filename: string) {
  return path.join(uploadDirectory, filename);
}
