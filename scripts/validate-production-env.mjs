const required = [
  "MYSQL_HOST",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "AUTH_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "FRIEND_LINK_NOTIFY_EMAIL",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "BLOB_READ_WRITE_TOKEN"
];

const weakValues = new Set([
  "",
  "123456",
  "password",
  "admin",
  "change-this-to-a-long-random-secret-before-deploying",
  "replace-with-a-strong-database-password",
  "replace-with-a-strong-admin-password",
  "replace-with-a-long-random-secret",
  "replace-with-smtp-authorization-code",
  "https://your-domain.com"
]);

const errors = [];

for (const name of required) {
  const value = process.env[name] || "";

  if (!value) {
    errors.push(`${name} is required`);
    continue;
  }

  if (weakValues.has(value)) {
    errors.push(`${name} still uses a placeholder or weak value`);
  }
}

if ((process.env.AUTH_SECRET || "").length < 32) {
  errors.push("AUTH_SECRET must be at least 32 characters");
}

try {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");

  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    errors.push("NEXT_PUBLIC_SITE_URL should use https in production");
  }
} catch {
  errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
}

if (errors.length > 0) {
  console.error("Production environment validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Production environment validation passed.");
