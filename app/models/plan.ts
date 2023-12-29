import type { Plan, Prisma } from "@prisma/client"

import { prisma } from "@/services/db/db.server"

export const getPlanById = async (
  id: Plan["id"],
  options?: Prisma.PlanInclude
) => {
  return await prisma.plan.findUnique({
    where: { id },
  })
}

export const getAllPlans = async () => {
  return await prisma.plan.findMany({
    where: { isActive: true },
    include: { prices: true },
  })
}

export const getPlanByIdWithPrices = async (id: Plan["id"]) => {
  return await prisma.plan.findUnique({
    where: { id },
    include: {
      prices: true,
    },
  })
}

export const getFreePlan = async () => {
  return await prisma.plan.findFirst({
    where: { name: "Free", isActive: true },
    include: {
      prices: true,
    },
  })
}

export const getPlanByStripeId = async (stripePlanId: Plan["stripePlanId"]) => {
  return await prisma.plan.findFirst({
    where: { stripePlanId },
    include: {
      prices: true,
    },
  })
}
