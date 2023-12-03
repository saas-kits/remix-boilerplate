import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { createCheckoutSession } from "~/models/checkout";
import { getAllPlans, getPlanByIdWithPrices } from "~/models/plan";
import { getSubscriptionByUserId } from "~/models/subscription";
import { getUserById } from "~/models/user";
import { authenticator } from "~/services/auth.server";
import { getUserCurrencyFromRequest } from "~/utils/currency";

declare global {
    interface BigInt {
      toJSON(): string
    }
  }

BigInt.prototype.toJSON = function () {
    return this.toString()
    }

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const subscription = await getSubscriptionByUserId(session.id);

  const defaultCurrency = getUserCurrencyFromRequest(request);

  let plans = await getAllPlans();

  plans = plans.map((plan) => {
    return {
      ...plan,
      prices: plan.prices.filter((price) => price.currency === defaultCurrency).map(
        (price) => ({
          ...price,
          amount: price.amount/100,
        })
      ),
    };
  });

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

export default function PlansPage() {
  const { plans, subscription, defaultCurrency } =
    useLoaderData<typeof loader>();
  // render shadcn ui pricing table using Card
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Plans</h1>
      <div className="flex flex-wrap justify-center max-w-4xl mt-6 sm:w-full">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col justify-between w-full px-4 py-8 mx-2 my-4 bg-white rounded-lg shadow sm:w-96"
          >
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <p className="mt-2 text-gray-600">
                {plan.prices.map((price) => (
                  <span key={price.id}>
                    {price.currency.toUpperCase()}{" "}
                    {price.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: price.currency,
                    })}{" "}
                    / {price.interval}
                  </span>
                ))}
              </p>
            </div>
            <form
              action="/dashboard/plans"
              method="post"
              className="flex flex-col items-center w-full mt-4"
            >
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="interval" value="month" />
              <input type="hidden" name="currency" value={defaultCurrency} />
              <Button
                type="submit"
                className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                disabled={subscription?.planId === plan.id}
              >
                {subscription?.planId === plan.id ? "Current Plan" : "Subscribe"}
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
