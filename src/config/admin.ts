import type { AdminSectionNavItem } from "@/components/admin/admin-section-layout";

export const websiteManagementItems: AdminSectionNavItem[] = [
  { href: "/admin/site/articles", label: "文章列表", description: "查看和编辑文章" },
  { href: "/admin/site/articles/new", label: "发布文章", description: "创建新的 Markdown 文章" },
  { href: "/admin/site/guestbook", label: "留言管理", description: "管理留言板" },
  { href: "/admin/site/tags", label: "标签管理", description: "维护标签" },
  { href: "/admin/site/categories", label: "分类管理", description: "维护分类" },
  { href: "/admin/site/favorites", label: "收藏管理", description: "管理收藏链接" },
  { href: "/admin/site/comments", label: "评论管理", description: "管理文章评论" },
  { href: "/admin/site/holes", label: "树洞管理", description: "管理弹幕树洞" },
  { href: "/admin/site/chats", label: "聊天管理", description: "管理聊天记录" },
  { href: "/admin/site/links", label: "友链管理", description: "管理友情链接" }
];

export const systemManagementItems: AdminSectionNavItem[] = [
  { href: "/admin/system", label: "系统概览", description: "环境和数据库" },
  { href: "/admin/system/users", label: "用户管理", description: "查看多用户账号" },
  { href: "/admin/system/menus", label: "菜单管理", description: "后台菜单配置" },
  { href: "/admin/system/roles", label: "角色管理", description: "角色与权限集合" },
  { href: "/admin/system/permissions", label: "权限管理", description: "权限点列表" },
  { href: "/admin/system/logs", label: "日志管理", description: "登录日志" },
  { href: "/admin/system/monitor", label: "服务监控", description: "Node 服务状态" },
  { href: "/admin/docs", label: "接口文档", description: "后端接口清单" }
];

export const recordModuleLabels: Record<string, string> = {
  tags: "标签管理",
  categories: "分类管理",
  favorites: "收藏管理",
  chats: "聊天管理",
  links: "友链管理"
};

export const interactionModuleLabels: Record<string, string> = {
  guestbook: "留言管理",
  comments: "评论管理",
  holes: "树洞管理"
};
