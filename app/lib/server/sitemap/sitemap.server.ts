import type { ServerBuild } from "@remix-run/server-runtime"

import { getSitemapXml } from "./sitemap-utils.server"
import type { SEOOptions } from "./types"

export async function generateSitemap(
  request: Request,
  routes: ServerBuild["routes"],
  options: SEOOptions
) {
  const { siteUrl, headers } = options
  const sitemap = await getSitemapXml(request, routes, { siteUrl })
  const bytes = new TextEncoder().encode(sitemap).byteLength

  return new Response(sitemap, {
    headers: {
      ...headers,
      "Content-Type": "application/xml",
      "Content-Length": String(bytes),
    },
  })
}
