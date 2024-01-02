// generate action for remix which accepets stripe webhook events

import { json, type ActionFunctionArgs } from "@remix-run/node"
import type { Subscription } from "@prisma/client"

import { stripe } from "@/services/stripe/setup.server"
import { getPlanByStripeId } from "@/models/plan"
import {
  deleteSubscriptionByCustomerId,
  getSubscriptionById,
  getSubscriptionByStripeId,
  updateSubscription,
} from "@/models/subscription"
import { getUserByStripeCustomerId } from "@/models/user"

const getStripeWebhookEvent = async (request: Request) => {
  const sig = request.headers.get("stripe-signature")
  if (!sig) return json({}, { status: 400 })

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!endpointSecret) return json({}, { status: 400 })

  try {
    const payload = await request.text()
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    return event
  } catch (err) {
    return json({}, { status: 400 })
  }
}

const sendPlanEndNotification = async (id: Subscription["id"]) => {
  const subscription = await getSubscriptionById(id, {
    user: true,
    plan: true,
    price: true,
  })
  if (!subscription) return
  if (subscription.status == "trialing") {
    // TODO: send trial ending soon email
    console.log("Trial ending soon")
  } else {
    // TODO: send trial ending soon email
    console.log("Plan ending soon")
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const event = await getStripeWebhookEvent(request)

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      // Update subscription in database.
      // We have handled this in the create-subscription route.
      break
    case "customer.subscription.updated":
      // Update subscription in database.
      const stripeSubscription = event.data.object
      const customerId = stripeSubscription.customer

      if (!customerId) return new Response("Success", { status: 200 })

      const user = await getUserByStripeCustomerId(customerId as string)

      if (!user) return new Response("Success", { status: 200 })

      const subscriptionByStripeId = await getSubscriptionByStripeId(
        stripeSubscription.id
      )

      console.log(subscriptionByStripeId)

      if (!subscriptionByStripeId?.id) return json({}, { status: 200 })

      const dbPlan = await getPlanByStripeId(
        stripeSubscription.items.data[0].plan.product as string
      )
      const dbPrice = dbPlan?.prices.find(
        (price) =>
          price.stripePriceId === stripeSubscription.items.data[0].price.id
      )

      await updateSubscription(subscriptionByStripeId.id, {
        isActive:
          stripeSubscription.status === "active" ||
          stripeSubscription.status === "trialing",
        status: stripeSubscription.status,
        planId: dbPlan?.id,
        priceId: dbPrice?.id,
        interval: String(stripeSubscription.items.data[0].plan.interval),
        currentPeriodStart: stripeSubscription.current_period_start,
        currentPeriodEnd: stripeSubscription.current_period_end,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      })

      break
    case "customer.subscription.deleted":
      // Delete subscription from database.
      const subscriptionId = event.data.object.id
      const subscription = await getSubscriptionByStripeId(subscriptionId)
      if (!subscription) return json({}, { status: 200 })
      await sendPlanEndNotification(subscription.id)

      await deleteSubscriptionByCustomerId(
        event.data.object.customer.toString()
      )
      break
    default:
      return json({}, { status: 200 })
  }

  return json({}, { status: 200 })
}
