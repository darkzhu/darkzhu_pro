import { AdminSectionLayout } from "@/components/admin/admin-section-layout";
import { systemManagementItems } from "@/config/admin";

export default function AdminSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionLayout
      eyebrow="System"
      title="系统管理"
      description="查看运行环境、数据库、上传限制和接口说明。"
      items={systemManagementItems}
    >
      {children}
    </AdminSectionLayout>
  );
}
