import "server-only";

import mysql from "mysql2/promise";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function createDbPool() {
  return mysql.createPool({
    host: requireEnv("MYSQL_HOST"),
    port: Number(process.env.MYSQL_PORT || 3306),
    user: requireEnv("MYSQL_USER"),
    password: requireEnv("MYSQL_PASSWORD"),
    database: requireEnv("MYSQL_DATABASE"),
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    namedPlaceholders: true,
    charset: "utf8mb4"
  });
}

let pool: mysql.Pool | null = null;

function getDbPool() {
  pool = pool ?? createDbPool();
  return pool;
}

export const db = new Proxy({} as mysql.Pool, {
  get(_target, property, receiver) {
    return Reflect.get(getDbPool(), property, receiver);
  }
});
