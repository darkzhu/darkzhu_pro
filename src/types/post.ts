export type PostFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  draft?: boolean;
  cover?: string;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Post = PostSummary & {
  contentHtml: string;
};

export type TaxonomyItem = {
  name: string;
  count: number;
};

export type ArchiveGroup = {
  year: string;
  posts: PostSummary[];
};
