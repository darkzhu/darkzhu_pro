# Deployment Checklist

## Required Environment Variables

Copy `.env.example` to the production environment and set real values. Do not commit production secrets.

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- `MYSQL_SSL=true` when your MySQL provider requires TLS, such as TiDB Cloud public endpoints
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `FRIEND_LINK_NOTIFY_EMAIL`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_TITLE`
- `NEXT_PUBLIC_SITE_DESCRIPTION`
- `NEXT_PUBLIC_SITE_AUTHOR`
- `NEXT_PUBLIC_SITE_EMAIL`

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 48
```

## Database

Create the database schema before starting production:

```bash
mysql -u <user> -p < database/schema.sql
```

Use a dedicated MySQL user with only the permissions needed by this application.

## Uploads And Posts

The app supports configurable persistent paths:

```env
UPLOAD_DIR=/var/www/my-blog/uploads
UPLOAD_PUBLIC_PATH=/uploads
POSTS_DIR=/var/www/my-blog/posts
```

For a VPS, create those directories and make them writable by the app user. Back them up regularly.

For serverless platforms, do not rely on local filesystem writes. Replace uploads with object storage and move article editing to a database or external storage before production use.

SVG uploads are disabled by default:

```env
ALLOW_SVG_UPLOADS=false
```

Only enable SVG uploads if uploaded files are trusted or sanitized.

## Registration

Public registration is disabled by default:

```env
ENABLE_PUBLIC_REGISTER=false
NEXT_PUBLIC_ENABLE_PUBLIC_REGISTER=false
```

Keep it disabled for a personal blog unless you intentionally want public accounts.

## GitHub Login

Create a GitHub OAuth App and set the callback URL to:

```text
https://your-domain.com/api/auth/github/callback
```

Then configure:

```env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

GitHub avatars are synced into the local user session on every GitHub login.

## Friend Link Email

Friend link applications are sent to `FRIEND_LINK_NOTIFY_EMAIL`.

For QQ Mail, enable SMTP in QQ Mail settings and use the authorization code as `SMTP_PASS`:

```env
FRIEND_LINK_NOTIFY_EMAIL=2283587900@qq.com
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-qq-email@qq.com
SMTP_PASS=your-smtp-authorization-code
SMTP_FROM=your-qq-email@qq.com
```

## Build Verification

Run before deployment:

```bash
npm run check:prod-env
npm run lint
npm test
npm run build
```

## VPS Runtime

Recommended process:

```bash
npm ci
npm run build
npm run start
```

Use a process manager such as PM2 or Docker, and put Nginx/Caddy in front for HTTPS and static compression.

## Backups

Back up these regularly:

- MySQL database
- `UPLOAD_DIR`
- `POSTS_DIR` if configured
- production environment variable values, stored securely

## Post-Deploy Checks

- `/` loads with the correct site title and hero image.
- `/login` works and public registration is hidden unless explicitly enabled.
- Admin login works with the seeded admin account.
- Article upload succeeds and the uploaded image remains available after restart.
- `/sitemap.xml` and `/robots.txt` use the real production domain.
