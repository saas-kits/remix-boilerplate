import type { DefaultSeoProps } from "../server/seo/types"

export const siteConfig = {
  title: "Remix SaaSkit",
  description:
    "Remix SaaSkit is a starter kit for building SaaS applications with Remix.",
  baseUrl: "https://demo.saaskits.dev",
  ogImage: "https://demo.saaskits.dev/og-image.png",
} as const

export const seoConfig: DefaultSeoProps = {
  title: siteConfig.title,
  description:
    "Remix SaaSkit is a starter kit for building SaaS applications with Remix.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.baseUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    handle: "@SaaSKits",
    site: siteConfig.baseUrl,
    cardType: "summary_large_image",
  },
}
