import type { Prisma, Subscription, User } from "@prisma/client"
import { prisma } from "~/services/db/db.server"

export const getSubscriptionById = async (
  id: Subscription["id"],
  options?: Prisma.SubscriptionInclude
) => {
  return await prisma.subscription.findUnique({
    where: { id },
    include: options,
  })
}

export const getSubscriptionByStripeId = async (
  subscriptionId: Subscription["subscriptionId"]
) => {
  return await prisma.subscription.findFirst({
    where: { subscriptionId },
  })
}

export const getSubscriptionByUserId = async (userId: User["id"]) => {
  return await prisma.subscription.findFirst({
    where: { userId },
  })
}

export const createSubscription = async (
  data: Prisma.SubscriptionUncheckedCreateInput
) => {
  return await prisma.subscription.create({
    data,
  })
}

export const updateSubscription = async (
  id: Subscription["id"],
  data: Prisma.SubscriptionUncheckedUpdateInput
) => {
  return await prisma.subscription.update({
    where: { id: id },
    data,
  })
}

export const deleteSubscriptionByCustomerId = async (
  customerId: User["customerId"]
) => {
  if (!customerId) throw new Error("User does not have a Stripe Customer ID.")
  return await prisma.subscription.deleteMany({
    where: { customerId },
  })
}
