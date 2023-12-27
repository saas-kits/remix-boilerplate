import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node"

import { mergeMeta } from "@/lib/server/seo/seo-helpers"

import Faqs from "./faq"
import { FeatureSection } from "./feature-section"
import FeatureWithImage from "./feature-with-image"
import FeaturesVariantB from "./features-variant-b"
import Footer from "./footer"
import { HeroSection } from "./hero-section"
import { LogoCloud } from "./logo-cloud"
import { getAllPlans } from "@/models/plan"
import { getUserCurrencyFromRequest } from "@/utils/currency"
import { authenticator } from "@/services/auth.server"
import { Pricing } from "./pricing"

const loginFeatures = [
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
  "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
  "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })

  let plans = await getAllPlans()

  const defaultCurrency = getUserCurrencyFromRequest(request)

  plans = plans
    .map((plan) => {
      return {
        ...plan,
        prices: plan.prices
          .filter((price) => price.currency === defaultCurrency)
          .map((price) => ({
            ...price,
            amount: price.amount / 100,
          })),
      }
    })
    .sort((a, b) => a.prices[0].amount - b.prices[0].amount)

  return {
    plans,
    defaultCurrency,
  }
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Home Page" }]
  }
)

export default function Index() {
  return (
    <div className="h-full">
      <HeroSection />
      <div className="relative z-10">
        <LogoCloud />
        <FeatureSection />
        <FeatureWithImage
          features={loginFeatures}
          title="Social and Email Password Login"
          darkFeatureImage="/login-dark.jpeg"
          lightFeatureImage="/login-light.jpeg"
        />
        <FeaturesVariantB />
        <Pricing/>
        <Faqs />
        <Footer />
      </div>
    </div>
  )
}
