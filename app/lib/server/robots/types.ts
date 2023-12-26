export type RobotsPolicy = {
  type: "allow" | "disallow" | "sitemap" | "crawlDelay" | "userAgent"
  value: string
}

export type RobotsConfig = {
  appendOnDefaultPolicies?: boolean
  headers?: HeadersInit
}
