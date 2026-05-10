# API 文档

基础路径：同站点域名，例如本地开发为 `http://localhost:3000`。

所有响应均为 JSON。需要登录的接口通过 `my-blog-session` HttpOnly Cookie 鉴权，登录成功后由服务端自动写入。

## 认证

### POST `/api/auth/login`

管理员登录。

请求体：

```json
{
  "username": "admin",
  "password": "replace-with-admin-password"
}
```

成功响应：

```json
{
  "user": {
    "username": "admin",
    "nickname": "admin",
    "provider": "账号登录"
  }
}
```

状态码：

- `200`：登录成功
- `401`：用户名或密码错误
- `429`：请求过于频繁

限流：同 IP 每分钟 8 次。

### POST `/api/auth/logout`

退出登录并清除 Cookie。

成功响应：

```json
{
  "ok": true
}
```

### GET `/api/auth/me`

获取当前登录用户。

成功响应：

```json
{
  "user": {
    "username": "admin",
    "nickname": "admin",
    "provider": "账号登录"
  }
}
```

未登录时：

```json
{
  "user": null
}
```

## 文章后台

以下接口均需要登录。

### GET `/api/admin/posts`

获取可编辑文章列表。

成功响应：

```json
{
  "posts": []
}
```

### POST `/api/admin/posts`

新建文章。

请求体：

```json
{
  "slug": "welcome",
  "title": "标题",
  "date": "2026-05-09",
  "description": "摘要",
  "tags": ["博客"],
  "category": "建站",
  "draft": false,
  "cover": "/uploads/example.jpg",
  "content": "Markdown 内容"
}
```

状态码：

- `201`：创建成功
- `400`：参数错误
- `401`：未登录

### GET `/api/admin/posts/{slug}`

获取单篇可编辑文章。

### PUT `/api/admin/posts/{slug}`

更新文章。请求体同新建文章。

### DELETE `/api/admin/posts/{slug}`

删除文章。

成功响应：

```json
{
  "deleted": true
}
```

### POST `/api/admin/upload`

上传文章图片，需要登录。

请求：`multipart/form-data`

字段：

- `file`：图片文件

支持类型：

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`
- `image/svg+xml` only when `ALLOW_SVG_UPLOADS=true`

成功响应：

```json
{
  "url": "/uploads/1778315191954-id.jpg"
}
```

状态码：

- `200`：上传成功
- `400`：缺少文件或文件类型不支持
- `401`：未登录
- `413`：文件过大
- `429`：请求过于频繁

限制：

- 文件大小默认 5MB，可通过 `UPLOAD_MAX_BYTES` 配置
- 同 IP 每分钟 20 次

## 文章互动

### GET `/api/posts/{slug}/interactions`

获取文章点赞数和评论。

成功响应：

```json
{
  "likes": 1,
  "comments": [
    {
      "id": "uuid",
      "name": "访客",
      "text": "评论内容",
      "likes": 0,
      "createdAt": "2026-05-09T12:00:00.000Z"
    }
  ]
}
```

### POST `/api/posts/{slug}/interactions`

点赞或评论。

点赞请求：

```json
{
  "action": "like"
}
```

评论请求：

```json
{
  "action": "comment",
  "text": "评论内容"
}
```

状态码：

- `200`：点赞成功
- `201`：评论成功
- `400`：参数错误
- `429`：请求过于频繁

限流：同 IP 每分钟 30 次。

## 留言板

### GET `/api/guestbook`

获取留言列表。

成功响应：

```json
{
  "messages": []
}
```

### POST `/api/guestbook`

新增留言。

请求体：

```json
{
  "name": "访客",
  "text": "留言内容"
}
```

状态码：

- `201`：留言成功
- `400`：参数错误
- `429`：请求过于频繁

限流：同 IP 每分钟 10 次。

### POST `/api/guestbook/{id}/like`

给留言点赞。

状态码：

- `200`：点赞成功
- `404`：留言不存在
- `429`：请求过于频繁

限流：同 IP 每分钟 30 次。

## 弹幕墙

### GET `/api/hole`

获取弹幕消息。

成功响应：

```json
{
  "messages": []
}
```

### POST `/api/hole`

新增弹幕消息，需要登录。

请求体：

```json
{
  "text": "今天也要认真生活。"
}
```

状态码：

- `201`：创建成功
- `400`：参数错误
- `401`：未登录
- `429`：请求过于频繁

限制：

- 内容最多 280 字符
- 只保留最近 80 条
- 同 IP 每分钟 10 次
