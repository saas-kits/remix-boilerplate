import { useState } from "react"
import { NavLink, useLoaderData } from "@remix-run/react"

import { getformattedCurrency } from "@/lib/utils"
import {
  CTAContainer,
  FeaturedBadgeContainer,
  FeatureListContainer,
  PricingCard,
} from "@/components/pricing/containers"
import {
  Feature,
  FeatureDescription,
  FeaturePrice,
  FeatureTitle,
  FeatureType,
} from "@/components/pricing/feature"
import { PricingSwitch } from "@/components/pricing/pricing-switch"
import { Button } from "@/components/ui/button"

import type { loader } from "./route"

export const Pricing = () => {
  const { plans, defaultCurrency } = useLoaderData<typeof loader>()
  const [interval, setInterval] = useState<"month" | "year">("month")

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="wrap-balance mt-16 bg-black bg-gradient-to-br bg-clip-text text-center text-4xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-tight">
            Pricing Plans
          </h1>
        </div>
        <p className="wrap-balance mt-6 text-center text-lg font-light leading-7 text-muted-foreground">
          {/* TODO: add content here @keyur */}
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum
          quisquam, iusto voluptatem dolore voluptas non laboriosam soluta quos
          quod eos! Sapiente archit
        </p>
        <div className="mt-16 flex justify-center"></div>
        <PricingSwitch
          onSwitch={(value) => setInterval(value === "0" ? "month" : "year")}
        />

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
          {plans.map((plan) => {
            const discount = plan.prices[0].amount * 12 - plan.prices[1].amount
            const showDiscount =
              interval === "year" && plan.prices[0].amount !== 0
            const planPrice = plan.prices.find(
              (p) => p.currency === defaultCurrency && p.interval == interval
            )?.amount as number

            return (
              <PricingCard key={plan.id} isFeatured={showDiscount}>
                {showDiscount && discount > 0 && (
                  <FeaturedBadgeContainer>
                    Save {getformattedCurrency(discount, defaultCurrency)}
                  </FeaturedBadgeContainer>
                )}
                <FeatureTitle>{plan.name}</FeatureTitle>
                <FeatureDescription>{plan.description}</FeatureDescription>
                <FeaturePrice
                  interval={interval}
                  price={getformattedCurrency(planPrice, defaultCurrency)}
                />
                <FeatureListContainer>
                  {(plan.listOfFeatures as FeatureType[]).map(
                    (feature, index) => (
                      <Feature
                        key={index}
                        name={feature.name}
                        isAvailable={feature.isAvailable}
                        inProgress={feature.inProgress}
                      />
                    )
                  )}
                </FeatureListContainer>
                <CTAContainer>
                  <NavLink to="/login">
                    <Button className="w-full">Choose Plan</Button>
                  </NavLink>
                </CTAContainer>
              </PricingCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
