import type { ActionFunctionArgs } from "@remix-run/node"
import { authenticator } from "~/services/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  console.log("called")
  await authenticator.logout(request, { redirectTo: "/login" })
}
