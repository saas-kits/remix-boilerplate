import { RobotsPolicy } from "./types"

const typeTextMap = {
  userAgent: "User-agent",
  allow: "Allow",
  disallow: "Disallow",
  sitemap: "Sitemap",
  crawlDelay: "Crawl-delay",
}

export function getRobotsText(policies: RobotsPolicy[]): string {
  return policies.reduce((acc, policy) => {
    const { type, value } = policy
    return `${acc}${typeTextMap[type]}: ${value}\n`
  }, "")
}
