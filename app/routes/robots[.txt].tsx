import { MetaFunction } from "@remix-run/react";
import { generateRobotsTxt } from "~/lib/server/robots/robots.server";
import buildTags from "~/lib/server/seo/seo-utils";



export function loader() {
  return generateRobotsTxt([
    { type: "sitemap", value: `${process.env.HOST_URL}/sitemap.xml` },
    { type: "disallow", value: "/dashboard" },
  ]);
}