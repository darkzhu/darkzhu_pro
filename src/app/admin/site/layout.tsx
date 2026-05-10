import { AdminSectionLayout } from "@/components/admin/admin-section-layout";
import { websiteManagementItems } from "@/config/admin";

export default function AdminSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="Website"
      title="网站管理"
      description="管理文章、留言、标签、分类、收藏、评论、树洞、聊天和友链。"
      items={websiteManagementItems}
    >
      {children}
    </AdminSectionLayout>
  );
}
