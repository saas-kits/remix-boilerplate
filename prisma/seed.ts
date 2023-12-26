import { PrismaClient } from "@prisma/client"
import { DEFAULT_PLANS } from "~/services/stripe/plans.config"
import {
  createStripePrice,
  createStripeProduct,
  setupStripeCustomerPortal,
} from "~/services/stripe/stripe.server"
import type { Stripe } from "stripe"

const prisma = new PrismaClient()

const seed = async () => {
  const plans = await prisma.plan.findMany()

  if (plans.length) {
    console.log("Plans already seeded")
    return
  }

  const planPromises = Object.values(DEFAULT_PLANS).map(async (plan) => {
    const { limits, prices, name, description, isActive, listOfFeatures } = plan

    const pricesByInterval = Object.entries(prices).flatMap(
      ([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }))
      }
    )

    const stripeProduct = await createStripeProduct({
      name,
      description,
    })
    console.log(JSON.stringify(pricesByInterval, null, 2))

    const stripePrices = await Promise.all(
      pricesByInterval.map((price) =>
        createStripePrice(stripeProduct.id, {
          ...price,
          amount: price.amount * 100,
          nickname: name,
        })
      )
    )

    await prisma.plan.create({
      data: {
        name,
        description,
        isActive,
        listOfFeatures: listOfFeatures as any,
        limits: {
          create: limits,
        },
        stripePlanId: stripeProduct.id,
        prices: {
          create: stripePrices.map((price) => ({
            interval: price?.recurring?.interval || "month",
            currency: price.currency,
            amount: price.unit_amount || 0,
            nickname: price.nickname,
            isActive: true,
            stripePriceId: price.id,
          })),
        },
      },
    })

    return {
      product: stripeProduct.id,
      prices: stripePrices.map((price) => price.id),
    }
  })

  const products: Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product[] =
    await Promise.all(planPromises)

  console.log(products)

  //await setupStripeCustomerPortal(products);
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("Seeding done")
    await prisma.$disconnect()
  })
