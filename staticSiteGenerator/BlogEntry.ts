export interface BlogEntry {
  title: string;
  slug: string;
  topic: string;
  tags: string[];
  descriptionMarkdown: string;
  description: string;
  markdown: string;
  html: string;
  featuredImage?: string;
  author: string;
  readingTime: string;
}
