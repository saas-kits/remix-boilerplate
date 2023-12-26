import { authenticator } from "@/services/auth.server"
import type { ActionFunctionArgs } from "@remix-run/node"

export async function action({ request }: ActionFunctionArgs) {
  console.log("called")
  await authenticator.logout(request, { redirectTo: "/login" })
}
