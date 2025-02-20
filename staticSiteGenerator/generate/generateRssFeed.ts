import path from "path";
import fs from "fs-extra";
import xml from "xml2js";

import { GenerationContext } from "../Context.js";

export const generateRssFeed = async (
  ctx: GenerationContext,
): Promise<void> => {
  const raw = {
    rss: {
      $: { version: "2.0" },

      channel: {
        title: "ReadThis.io",
        link: "https://readthis.io",
        description:
          "Technical insights and best practices from experienced developers. Deep dives into system architecture, performance optimization, and engineering case studies.",
        language: "en-US",
        copyright: "Senad Redzic and Aiko Jansen",
        pubDate: new Date().toISOString(),
        image: {
          url: `https://readthis.io${ctx.staticImages["readthis_logo.svg"].src}`,
          title: "ReadThis.io Logo",
          link: "https://readthis.io",
        },

        item: [
          ...ctx.entries.map((entry) => ({
            title: entry.title,
            description: entry.description.trim(),
            link: `https://readthis.io/blog/${entry.slug}`,
            author: `${entry.author}, authors@readthis.io`,
            guid: entry.slug,
            pubDate: entry.created,
            category: entry.topic,
            image: `https://readthis.io${ctx.staticImages[entry.featuredImage ?? "defaultFeatureImage.webp"].src}`,
          })),
        ],
      },
    },
  };

  const builder = new xml.Builder({
    renderOpts: {
      pretty: true,
      indent: "  ",
      newline: "\n",
    },
  });
  const feed = builder.buildObject(raw);

  await fs.writeFile(path.join(ctx.outputDirectory, "feed.rss"), feed);
  await fs.writeFile(path.join(ctx.outputDirectory, "rss.xml"), feed);
};
