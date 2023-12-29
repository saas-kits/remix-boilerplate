import { commitSession, getSession } from "@/services/session.server"
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"

import { ratelimit } from "@/lib/server/ratelimit.server"
import { Input } from "@/components/ui/input"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"))
  const error = session.get("error:ratelimit")
  return json(
    { ratelimitReached: !!error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userIp =
    request.headers.get("X-Forwarded-For") || request.headers.get("x-real-ip")
  const identifier = userIp ?? "global"
  const { success } = await ratelimit.limit(identifier)

  if (!success) {
    // throw new Response("Too many requests", { status: 429 });
    const session = await getSession(request.headers.get("Cookie"))
    session.flash("error:ratelimit", "Too many requests")
    return json(
      { success },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    )
  }

  return json({ success })
}

export default function Test() {
  const { ratelimitReached } = useLoaderData<typeof loader>()
  return (
    <>
      <Form method="POST">
        <Input />
        <button>Submit</button>
      </Form>
      {ratelimitReached && <p>Rate limit reached</p>}
    </>
  )
}

export function ErrorBoundary() {
  return <>Rate limit Reached</>
}
