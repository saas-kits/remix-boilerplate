import type { User } from "@prisma/client";
import { prisma } from "~/services/db/db.server";

export const getUserById = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUserById = async (id: User["id"], data: Partial<User>) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const getUserByStripeCustomerId = async (
  customerId: User["customerId"]
) => {
  return await prisma.user.findFirst({
    where: { customerId },
  });
}
