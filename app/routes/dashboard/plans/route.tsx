import { useState } from "react"
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

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="mx-auto w-40" onValueChange={onSwitch}>
    <TabsList>
      <TabsTrigger value="0">Monthly</TabsTrigger>
      <TabsTrigger value="1">Yearly</TabsTrigger>
    </TabsList>
  </Tabs>
)

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
            return (
              <>
                <div
                  key={plan.id}
                  className={cn("rounded-[13px] p-px", {
                    "bg-gradient-to-b from-zinc-400 to-white dark:from-zinc-500 dark:to-black":
                      showDiscount,
                    "bg-gradient-to-b from-border to-white dark:to-black":
                      !showDiscount,
                  })}
                >
                  <div className="relative h-full w-full rounded-xl bg-white p-6 pb-24 dark:bg-background">
                    {showDiscount && discount > 0 && (
                      <div className="absolute -top-2 left-0 flex h-4 w-full items-center justify-center text-sm">
                        <span className="rounded-full bg-black px-4 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">
                          Save {getformattedCurrency(discount)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-base font-semibold leading-8">
                      {plan.name}
                    </h3>
                    <p className="wrap-balance mt-4 text-sm font-light leading-5 text-muted-foreground">
                      {plan.description}
                    </p>
                    <h4 className="mt-6 text-4xl font-bold tracking-tight">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: defaultCurrency,
                      }).format(
                        plan.prices.find(
                          (p) =>
                            p.currency === defaultCurrency &&
                            p.interval == interval
                        )?.amount as number
                      )}{" "}
                      <span className="text-sm font-semibold leading-6 text-muted-foreground">
                        /{interval}
                      </span>
                    </h4>

                    <ul className="mt-8 space-y-3 text-sm leading-6 xl:mt-10">
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
                    </ul>
                    <div className="absolute bottom-0 left-0 mx-6 mb-6 mt-8 w-[calc(100%-48px)]">
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
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}
