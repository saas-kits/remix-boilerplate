import { authenticator } from "@/services/auth.server"
import type { LoaderFunctionArgs } from "@remix-run/node"

export let loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
}
