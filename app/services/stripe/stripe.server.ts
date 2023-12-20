import type { Stripe } from "stripe";
import type { Plan, Price, User } from "@prisma/client";
import { stripe } from "./setup.server";
import { PLAN_TYPES, type PLAN_INTERVALS } from "./plans.config";
import { brandConfig } from "~/lib/brand/config";

export const createStripeProduct = async (plan: Partial<Plan>) => {
  const product = await stripe.products.create({
    name: plan.name || "",
    description: plan.description || undefined,
  });

  return product;
};

export const createStripePrice = async (
  id: Plan["id"],
  price: Partial<Price>
) => {
  return await stripe.prices.create({
    nickname: price.nickname || undefined,
    product: id,
    currency: price.currency || "usd",
    unit_amount: price.amount || 0,
    tax_behavior: "inclusive",
    recurring: {
      interval: (price.interval as PLAN_INTERVALS) || "month",
    },
  });
};

export const createStripeCustomer = async (
  { email, fullName }: Partial<User>,
  metadata: Stripe.MetadataParam
) => {
  return await stripe.customers.create({
    email,
    name: fullName,
    metadata: metadata,
  });
};

export const createStripeSubscription = async (
  customerId: User["customerId"],
  priceId: Price["id"]
) => {
  if (!customerId) {
    throw new Error("Stripe Customer ID is required");
  }
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
  });
};

export const setupStripeCustomerPortal = async (
  products: Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product[]
) => {
  const portal = await stripe.billingPortal.configurations.create({
    features: {
      customer_update: {
        allowed_updates: ["address", "tax_id", "phone", "shipping"],
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
      payment_method_update: {
        enabled: true,
      },
      subscription_cancel: {
        enabled: true,
      },
      subscription_pause: {
        enabled: false,
      },
      subscription_update: {
        default_allowed_updates: ["price"],
        enabled: true,
        proration_behavior: "always_invoice",
        products: products.filter(({ product }) => product !== PLAN_TYPES.FREE),
      },
    },
    business_profile: {
      headline: `${brandConfig.name} - Manage your subscription`,
    },
  });

  return portal;
};

export const createStripeCheckoutSession = async (
  customerId: User["customerId"],
  priceId: Price["id"],
  successUrl: string,
  cancelUrl: string
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId as string,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
};

export const createStripeCustomerPortalSession = async (
  customerId: User["customerId"],
  returnUrl: string
) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId as string,
    return_url: returnUrl,
  });

  return session;
}


export const createSingleStripeCheckoutSession = async (
  customerId: User["customerId"],
  priceId: Price["id"],
  successUrl: string,
  cancelUrl: string
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId as string,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
