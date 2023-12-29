import { useId } from "react"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { commitSession, getSession } from "@/services/session.server"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import {
  Form,
  MetaFunction,
  NavLink,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { Ratelimit } from "@upstash/ratelimit"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { getClientIPAddress } from "remix-utils/get-client-ip-address"
import { z } from "zod"

import GoogleLogo from "@/lib/assets/logos/google"
import { sendVerificationCode } from "@/lib/server/auth-utils.sever"
import { validateCsrfToken } from "@/lib/server/csrf.server"
import { redis } from "@/lib/server/ratelimit.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommonErrorBoundary } from "@/components/error-boundry"

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z.string().min(8, "min check failed"),
})

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"))
  const error = session.get("error:ratelimit")

  if (error) {
    return json(
      { ratelimitReached: !!error },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    )
  }

  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Login" }]
  }
)

export const action = async ({ request }: ActionFunctionArgs) => {
  const userIp = getClientIPAddress(request)
  const ratelimit = new Ratelimit({
    redis,
    // Maximum 3 requests per 10 seconds
    limiter: Ratelimit.fixedWindow(1, "20 s"),
    analytics: true,
  })

  const { success } = await ratelimit.limit(`${userIp}:login`)
  const session = await getSession(request.headers.get("Cookie"))

  if (!success) {
    session.flash("error:ratelimit", "Too many requests")
  }

  await validateCsrfToken(request)
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = await parse(formData, {
    schema: schema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
        select: { id: true },
      })

      if (!existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Password and email does not match",
        })
        return
      }
    }),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }

  try {
    const user = await authenticator.authenticate("user-pass", request, {
      throwOnError: true,
      context: {
        ...submission.value,
        type: "login",
      },
    })

    let session = await getSession(request.headers.get("cookie"))
    // and store the user data
    session.set(authenticator.sessionKey, user)

    let headers = new Headers({ "Set-Cookie": await commitSession(session) })

    // Todo: make redirect config driven e.g add login success route
    if (user.emailVerified) {
      return redirect("/dashboard", { headers })
    }
    await sendVerificationCode(user)
    return redirect("/verify-email", { headers })
  } catch (error) {
    // TODO: fix type here
    // TODO: create constant for message type of auth errors
    const typedError = error as any

    switch (typedError.message) {
      case "INVALID_PASSWORD":
        return json(
          {
            ...submission,
            error: { email: ["Email and passwords dont match"] },
          },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        )
      case "GOOGLE_SIGNUP":
        return json(
          {
            ...submission,
            error: {
              email: [
                "You signed up with google sign in please use same method to login",
              ],
            },
          },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        )
      default:
        return null
    }
  }
}

export default function Login() {
  const data = useLoaderData<typeof loader>()
  const isRateLimitReached = data ? data.ratelimitReached : false

  const navigation = useNavigation()
  const isFormSubmitting = navigation.state === "submitting"
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { email, password }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Sign in to your account
      </h2>

      <div className="mt-10 w-full sm:mx-auto">
        {isRateLimitReached && (
          <Alert variant="destructive" className="my-2">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Too Many Login attempts please try again later
            </AlertDescription>
          </Alert>
        )}
        <Form className="space-y-6" method="post" {...form.props}>
          <AuthenticityTokenInput />
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
                placeholder="test@example.com"
                id="email"
                type="email"
                autoComplete="email"
                error={email.error}
                {...conform.input(email, { type: "email" })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                error={password.error}
                {...conform.input(password, { type: "password" })}
              />
            </div>
          </div>
          <Button disabled={isFormSubmitting} className="w-full" type="submit">
            {isFormSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>
        </Form>
        <Form action="/auth/google" method="post" className="mt-4">
          <Button
            disabled={isFormSubmitting}
            className="w-full"
            type="submit"
            variant="outline"
          >
            <span className="flex items-center space-x-2">
              <GoogleLogo height={18} /> <span>Sign in with Google</span>
            </span>
          </Button>
        </Form>
        <div className="mt-5 flex justify-between">
          <p className="flex-grow text-sm text-muted-foreground">
            Not a member?{" "}
            <NavLink to="/signup">
              <Button size="sm" variant="link" className="px-1">
                Sign up
              </Button>
            </NavLink>
          </p>
          <NavLink to="/forgot-password">
            <Button variant="link" size="sm">
              Forgot Password
            </Button>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
