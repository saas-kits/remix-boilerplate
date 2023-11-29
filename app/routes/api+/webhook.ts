// generate action for remix which accepets stripe webhook events

import type { Subscription } from "@prisma/client";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import {
  deleteSubscriptionByCustomerId,
  getSubscriptionById,
  updateSubscription,
} from "~/models/subscription";
import { getUserById } from "~/models/user";
import { stripe } from "~/services/stripe/setup.server";

const getStripeWebhookEvent = async (request: Request) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) return json({}, { status: 400 });

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) return json({}, { status: 400 });

  try {
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    return event;
  } catch (err) {
    return json({}, { status: 400 });
  }
};

const sendPlanEndNotification = async (subscriptionId: Subscription["id"]) => {
  const subscription = await getSubscriptionById(subscriptionId, {
    user: true,
    plan: true,
    price: true,
  });
  if (!subscription) return;
  if (subscription.status == "trialing") {
    console.log("Trial ending soon");
  } else {
    console.log("Plan ending soon");
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const event = await getStripeWebhookEvent(request);

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      // Update subscription in database.
      // We have handled this in the create-subscription route.
      break;
    case "customer.subscription.updated":
      // Update subscription in database.
      const stripeSubscription = event.data.object;
      const userId = stripeSubscription.metadata.userId;

      if (!userId) return new Response("Success", { status: 200 });

      const user = await getUserById(userId);

      if (!user) return new Response("Success", { status: 200 });

      await updateSubscription(stripeSubscription.id, {
        isActive: stripeSubscription.status === "active",
        status: stripeSubscription.status,
        planId: String(stripeSubscription.items.data[0].plan.product),
        priceId: String(stripeSubscription.items.data[0].price.id),
        interval: String(stripeSubscription.items.data[0].plan.interval),
        currentPeriodStart: stripeSubscription.current_period_start,
        currentPeriodEnd: stripeSubscription.current_period_end,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      });

      break;
    case "customer.subscription.deleted":
      // Delete subscription from database.
      const subscriptionId = event.data.object.id;
      await sendPlanEndNotification(subscriptionId);

      await deleteSubscriptionByCustomerId(
        event.data.object.customer.toString()
      );
      break;
  }

  return json({}, { status: 200 });
}
