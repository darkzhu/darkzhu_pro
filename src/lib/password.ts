import "server-only";

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const iterations = 120_000;
const keyLength = 32;
const digest = "sha256";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");

  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, rawIterations, salt, hash] = storedHash.split("$");

  if (scheme !== "pbkdf2" || !rawIterations || !salt || !hash) {
    return false;
  }

  const candidate = pbkdf2Sync(password, salt, Number(rawIterations), keyLength, digest);
  const expected = Buffer.from(hash, "hex");

  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
