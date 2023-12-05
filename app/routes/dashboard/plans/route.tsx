import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { createCheckoutSession } from "~/models/checkout";
import { getAllPlans, getPlanByIdWithPrices } from "~/models/plan";
import { getSubscriptionByUserId } from "~/models/subscription";
import { getUserById } from "~/models/user";
import { authenticator } from "~/services/auth.server";
import { getUserCurrencyFromRequest } from "~/utils/currency";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

type Feature = {
  name: string;
  isAvailable: boolean;
  inProgress: boolean;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const subscription = await getSubscriptionByUserId(session.id);

  const defaultCurrency = getUserCurrencyFromRequest(request);

  let plans = await getAllPlans();

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
      };
    })
    .sort((a, b) => a.prices[0].amount - b.prices[0].amount);

  return {
    plans,
    subscription,
    defaultCurrency,
  };
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const planId = formData.get("planId");
  const interval = formData.get("interval") as "month" | "year";
  const currency = formData.get("currency") as string;

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!planId || !interval) {
    return redirect("/dashboard/plans");
  }

  const dbPlan = await getPlanByIdWithPrices(planId as string);

  if (!dbPlan) {
    return redirect("/dashboard/plans");
  }

  const user = await getUserById(session.id);

  const price = dbPlan.prices.find(
    (p) => p.interval === interval && p.currency === currency
  );

  if (!price) {
    return redirect("/dashboard/plans");
  }

  const checkout = await createCheckoutSession(
    user?.customerId as string,
    price.stripePriceId,
    `${process.env.HOST_URL}/dashboard/plans`,
    `${process.env.HOST_URL}/dashboard/plans`
  );

  if (!checkout) {
    return redirect("/dashboard/plans");
  }

  return redirect(checkout.url as string);
};

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        Yearly
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const Feature = ({ name, isAvailable, inProgress }: Feature) => (
  <li className={clsx(inProgress && "text-muted-foreground", "flex gap-x-3")}>
    {/* If in progress return disabled */}
    {!isAvailable ? (
      <Cross2Icon
        className={clsx("text-gray-400", "h-6 w-5 flex-none")}
        aria-hidden="true"
      />
    ) : (
      <CheckIcon
        className={clsx("text-gray-400", "h-6 w-5 flex-none")}
        aria-hidden="true"
      />
    )}
    {name}{" "}
    {inProgress && (
      <span className="text-xs font-semibold leading-6 text-muted-foreground">
        (Coming Soon)
      </span>
    )}
  </li>
);

export default function PlansPage() {
  const { plans, subscription, defaultCurrency } =
    useLoaderData<typeof loader>();
  const [interval, setInterval] = useState<"month" | "year">("month");
  // render shadcn ui pricing table using Card
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mt-16 text-4xl font-medium tracking-tight sm:text-5xl text-center wrap-balance bg-gradient-to-br from-white to-[hsla(0,0%,100%,.5)] bg-clip-text text-transparent">
            Plans & Pricing
          </h1>
        </div>
        <p className="mt-6 text-lg leading-7 font-light text-gray-400 text-center wrap-balance">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum
          quisquam, iusto voluptatem dolore voluptas non laboriosam soluta quos
          quod eos! Sapiente archit
        </p>
        <div className="mt-16 flex justify-center"></div>
        <PricingSwitch
          onSwitch={(value) => setInterval(value === "0" ? "month" : "year")}
        />
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <>
              <Card key={plan.id} className="p-6">
                <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold leading-8">
                  {plan.name}
                </h3>
                {
                  interval === "year" && plan.prices[0].amount !== 0 ?
                  <div
                  className={cn(
                    "px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white",
                    {
                      "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ":
                        subscription?.planId === plan.id,
                    }
                  )}
                >
                  Save ${plan.prices[0].amount * 12 - plan.prices[1].amount}
                </div> : null 
                }
                </div>
                <p className="mt-4 text-sm leading-5 font-light text-gray-400 wrap-balance">
                  {plan.description}
                </p>
                <h5 className="text-4xl font-bold tracking-tight mt-6">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: defaultCurrency,
                  }).format(
                    plan.prices.find(
                      (p) =>
                        p.currency === defaultCurrency && p.interval == interval
                    )?.amount as number
                  )}
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">
                    /{interval}
                  </span>
                </h5>
                <ul
                  className={clsx(
                    "text-gray-400",
                    "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                  )}
                >
                  {(plan.listOfFeatures as Feature[]).map((feature, index) => (
                    <Feature
                      key={index}
                      name={feature.name}
                      isAvailable={feature.isAvailable}
                      inProgress={feature.inProgress}
                    />
                  ))}
                </ul>
                <Button
                  className="w-full mt-8"
                  disabled={subscription?.planId === plan.id}
                >
                  {subscription?.planId === plan.id
                    ? "Current Plan"
                    : "Choose Plan"}
                </Button>
              </Card>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
