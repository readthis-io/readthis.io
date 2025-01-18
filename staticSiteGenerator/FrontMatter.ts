import { z } from "zod";

export const frontMatterScheme = z.object({
  data: z.object({
    title: z.string(),
    slug: z.string().optional(),
    topic: z.string(),
    tags: z.string().array(),
    description: z.string(),
    created: z.string().datetime({ offset: true }),
    featured_image: z.string().optional(),
  }),

  path: z.string(),
  content: z.string(),
});

export type FrontMatter = z.infer<typeof frontMatterScheme>;
