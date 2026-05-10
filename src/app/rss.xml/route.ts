import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();
  const latestPostDate = posts[0]?.date ? new Date(posts[0].date) : new Date();

  const items = posts
    .map((post) => {
      const postUrl = absoluteUrl(`/posts/${post.slug}`);

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <description>${escapeXml(post.description)}</description>
          <category>${escapeXml(post.category)}</category>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(siteConfig.feed.title)}</title>
        <link>${absoluteUrl("/")}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        <language>zh-CN</language>
        <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
        <ttl>60</ttl>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
