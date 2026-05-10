import { redirect } from "next/navigation";

export default function AdminPostsRedirectPage() {
  redirect("/admin/site/articles");
}
