import { createCheckoutSession } from "@/models/checkout"
import { getAllPlans, getPlanByIdWithPrices } from "@/models/plan"
import { getSubscriptionByUserId } from "@/models/subscription"
import { getUserById } from "@/models/user"
import { authenticator } from "@/services/auth.server"
import { getUserCurrencyFromRequest } from "@/utils/currency"
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import { redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import clsx from "clsx"
import { useState } from "react"

import {
  CTAContainer,
  FeatureListContainer,
  FeaturedBadgeContainer,
  PricingCard,
} from "@/components/pricing/containers"
import {
  FeatureDescription,
  FeaturePrice,
  FeatureTitle,
} from "@/components/pricing/feature"
import { PricingSwitch } from "@/components/pricing/pricing-switch"
import { Button } from "@/components/ui/button"

// TODO: to be discussed with Keyur
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

type Feature = {
  name: string
  isAvailable: boolean
  inProgress: boolean
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const subscription = await getSubscriptionByUserId(session.id)

  const defaultCurrency = getUserCurrencyFromRequest(request)

  let plans = await getAllPlans()

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
    subscription,
    defaultCurrency,
  }
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData()
  const planId = formData.get("planId")
  const interval = formData.get("interval") as "month" | "year"
  const currency = formData.get("currency") as string

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  if (!planId || !interval) {
    return redirect("/dashboard/plans")
  }

  const dbPlan = await getPlanByIdWithPrices(planId as string)

  if (!dbPlan) {
    return redirect("/dashboard/plans")
  }

  const user = await getUserById(session.id)

  const price = dbPlan.prices.find(
    (p) => p.interval === interval && p.currency === currency
  )

  if (!price) {
    return redirect("/dashboard/plans")
  }

  const checkout = await createCheckoutSession(
    user?.customerId as string,
    price.stripePriceId,
    `${process.env.HOST_URL}/dashboard/plans`,
    `${process.env.HOST_URL}/dashboard/plans`
  )

  if (!checkout) {
    return redirect("/dashboard/plans")
  }

  return redirect(checkout.url as string)
}

const Feature = ({ name, isAvailable, inProgress }: Feature) => (
  <li
    className={clsx(
      inProgress && "text-muted",
      "flex gap-x-3 text-muted-foreground"
    )}
  >
    {/* If in progress return disabled */}
    {!isAvailable ? (
      <Cross2Icon className={"h-6 w-5 flex-none"} aria-hidden="true" />
    ) : (
      <CheckIcon className={"h-6 w-5 flex-none"} aria-hidden="true" />
    )}
    {name}{" "}
    {inProgress && (
      <span className="text-xs font-semibold leading-6 text-muted-foreground">
        (Coming Soon)
      </span>
    )}
  </li>
)

export default function PlansPage() {
  const { plans, subscription, defaultCurrency } =
    useLoaderData<typeof loader>()
  const [interval, setInterval] = useState<"month" | "year">("month")
  // render shadcn ui pricing table using Card

  const getformattedCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: defaultCurrency,
    }).format(amount)
  }
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
              <>
                <PricingCard key={plan.id} isFeatured={showDiscount}>
                  {showDiscount && discount > 0 && (
                    <FeaturedBadgeContainer>
                      Save {getformattedCurrency(discount)}
                    </FeaturedBadgeContainer>
                  )}
                  <FeatureTitle>{plan.name}</FeatureTitle>
                  <FeatureDescription>{plan.description}</FeatureDescription>
                  <FeaturePrice
                    interval={interval}
                    price={getformattedCurrency(planPrice)}
                  />
                  <FeatureListContainer>
                    {(plan.listOfFeatures as Feature[]).map(
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
                    <Form method="post">
                      <input type="hidden" name="planId" value={plan.id} />
                      <input type="hidden" name="interval" value={interval} />
                      <input
                        type="hidden"
                        name="currency"
                        value={defaultCurrency}
                      />

                      <Button
                        className="mt-8 w-full"
                        disabled={subscription?.planId === plan.id}
                        type="submit"
                      >
                        {subscription?.planId === plan.id
                          ? "Current Plan"
                          : "Choose Plan"}
                      </Button>
                    </Form>
                  </CTAContainer>
                </PricingCard>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}
