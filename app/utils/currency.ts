import { getClientLocales } from "remix-utils/locales/server"

import { CURRENCIES } from "@/services/stripe/plans.config"

export const getUserCurrencyFromRequest = (request: Request) => {
  const locales = getClientLocales(request)

  if (!locales) return CURRENCIES.USD
  const locale = locales[0] ?? "en-US"

  const currency = locale == "en-US" ? CURRENCIES.USD : CURRENCIES.EUR

  return currency
}
