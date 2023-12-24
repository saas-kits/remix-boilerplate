import { routes } from "@remix-run/dev/server-build";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { generateSitemap } from "~/lib/server/sitemap/sitemap.server";

export function loader({ request }: LoaderFunctionArgs) {
  return generateSitemap(request, routes, {
    siteUrl: process.env.HOST_URL || "",
  });
}
