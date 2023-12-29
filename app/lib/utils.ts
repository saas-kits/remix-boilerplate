import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { CURRENCIES } from "@/services/stripe/plans.config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getformattedCurrency = (
  amount: number,
  defaultCurrency: CURRENCIES
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: defaultCurrency,
  }).format(amount)
}
