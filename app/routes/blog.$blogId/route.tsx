import type { SEOHandle } from "~/lib/server/sitemap/types";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    const blogs = [{ slug: "blog-1" }, { slug: "blog-2" }, { slug: "blog-3" }];
    return blogs.map((blog) => {
      return { route: `/blog/${blog.slug}`, priority: 0.7 };
    });
  },
};

export default function BlogSlug() {
  return <div>Blog Slug</div>;
}
