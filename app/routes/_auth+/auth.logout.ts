import type { LoaderFunctionArgs,ActionFunctionArgs } from "@remix-run/node"

import { authenticator } from "@/services/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" })
}
export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" })
  return redirect("/login")
}
