// import { routes } from "@remix-run/dev/server-build"
import type { LoaderFunctionArgs } from "@remix-run/node"

import { generateSitemap } from "@/lib/server/sitemap/sitemap.server"

export async function loader({ request }: LoaderFunctionArgs) {

  let build = await (
    import.meta.env.DEV
    ? import("../../build/server/index.js")
    : import(
      /* @vite-ignore */
      import.meta.resolve("../../build/server/index.js"
    )))

  return generateSitemap(request, build.routes, {
    siteUrl: process.env.HOST_URL || "",
  })
}
