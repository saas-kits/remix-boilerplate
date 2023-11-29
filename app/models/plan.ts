import type { Plan, Prisma } from "@prisma/client";
import { prisma } from "~/services/db/db.server";

export const getPlanById = async (
  id: Plan["id"],
  options?: Prisma.PlanInclude
) => {
  return await prisma.plan.findUnique({
    where: { id },
  });
};

export const getPlanByIdWithPrices = async (id: Plan["id"]) => {
  return await prisma.plan.findUnique({
    where: { id },
    include: {
      prices: true,
    },
  });
};
