# Vercel Deployment

This project can run on Vercel, but production data must not depend on local filesystem writes.

## Recommended Vercel Services

- App hosting: Vercel
- Uploaded images: Vercel Blob
- MySQL: PlanetScale, TiDB Cloud, Aiven, or another externally hosted MySQL-compatible service
- Email: QQ Mail SMTP or another SMTP provider

## Required Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

```env
MYSQL_HOST=
MYSQL_PORT=3306
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_CONNECTION_LIMIT=10

ADMIN_USERNAME=admin
ADMIN_PASSWORD=
AUTH_SECRET=

NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=My Blog
NEXT_PUBLIC_SITE_TITLE=My personal blog
NEXT_PUBLIC_SITE_DESCRIPTION=Notes, photos, ideas, and daily records.
NEXT_PUBLIC_SITE_AUTHOR=Admin
NEXT_PUBLIC_SITE_AUTHOR_BIO=Writing down ordinary days.
NEXT_PUBLIC_SITE_AUTHOR_AVATAR=/avatar.png
NEXT_PUBLIC_SITE_EMAIL=hello@example.com

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

FRIEND_LINK_NOTIFY_EMAIL=2283587900@qq.com
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

BLOB_READ_WRITE_TOKEN=
UPLOAD_MAX_BYTES=5242880
ALLOW_SVG_UPLOADS=false

ENABLE_PUBLIC_REGISTER=false
NEXT_PUBLIC_ENABLE_PUBLIC_REGISTER=false
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 48
```

## Vercel Blob

Create a Vercel Blob store and connect it to the project. Vercel will provide `BLOB_READ_WRITE_TOKEN`.

When `BLOB_READ_WRITE_TOKEN` exists, `/api/admin/upload` stores images in Vercel Blob and returns the public Blob URL.

Without `BLOB_READ_WRITE_TOKEN`, uploads fall back to local filesystem storage. That fallback is for local development or VPS only.

## Database

Run `database/schema.sql` against the hosted MySQL database before first deploy.

The app needs the database for:

- Login users and roles
- Login logs
- Guestbook
- Hole messages
- Article interactions
- Admin records

## GitHub Login

Create a GitHub OAuth App:

- Homepage URL: `https://your-domain.vercel.app`
- Authorization callback URL: `https://your-domain.vercel.app/api/auth/github/callback`

Then set:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Friend Link Email

For QQ Mail, enable SMTP and use the SMTP authorization code as `SMTP_PASS`.

Friend link applications are sent to:

```env
FRIEND_LINK_NOTIFY_EMAIL=2283587900@qq.com
```

## Important Limitation

The current admin article editor writes Markdown files to `src/content/posts` or `POSTS_DIR`.

On Vercel, local filesystem writes are not persistent. Uploaded images are solved by Vercel Blob, but article editing still needs a durable backend for full production use.

Recommended next step for Vercel:

- Move posts from Markdown files to MySQL, or
- Store posts in another durable service.

Until that is done, editing posts in the admin panel on Vercel should be treated as non-persistent.

## Deploy Steps

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add environment variables listed above.
4. Create/connect Vercel Blob.
5. Create the hosted MySQL database and run `database/schema.sql`.
6. Deploy.
7. Test:
   - `/`
   - `/login`
   - GitHub login
   - Friend link application email
   - Admin upload image
