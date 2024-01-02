import { useId } from "react"
import { json } from "@remix-run/node"
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { Form, NavLink, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { AlertCircle } from "lucide-react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validatePasswordResetToken } from "@/lib/server/auth-utils.sever"
import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator, hash } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { CommonErrorBoundary } from "@/components/error-boundry"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Please make sure your passwords match",
    path: ["confirmPassword"],
  })

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Reset Password" }]
  }
)

export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrfToken(request)
  const url = new URL(request.url)

  const code = url.searchParams.get("code")

  const formData = await request.formData()

  const submission = await parse(formData, {
    schema,
  })

  if (!code) {
    return json({ ...submission, isLinkExpired: true, resetSuccess: false })
  }

  if (!submission.value || submission.intent !== "submit") {
    return json({ ...submission, isLinkExpired: false, resetSuccess: false })
  }

  // TODO: check naming conventions
  const resetToken = await prisma.passwordResetToken.findFirst({
    // TODO: confirm if we should keep it code or rename to token
    where: {
      token: code,
    },
  })

  if (resetToken) {
    try {
      const userId = await validatePasswordResetToken(resetToken?.token)

      const hashedPassword = await hash(submission.value.password)

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      })

      return json({ ...submission, isLinkExpired: false, resetSuccess: true })
    } catch (error) {
      return json({ ...submission, isLinkExpired: true, resetSuccess: false })
    }
  } else {
    return json({ ...submission, isLinkExpired: true, resetSuccess: false })
  }
}

export default function ForgotPassword() {
  const navigation = useNavigation()
  const isFormSubmitting = navigation.state === "submitting"
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { password, confirmPassword }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })

  if (lastSubmission?.isLinkExpired) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Reset Link expired
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Reset link has expired please request new one{" "}
              <NavLink className="underline" to="/forgot-password">
                Request new link
              </NavLink>
            </AlertDescription>
          </Alert>
        </div>
      </>
    )
  }
  if (!lastSubmission?.isLinkExpired && !lastSubmission?.resetSuccess) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
          Reset password
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="post" {...form.props}>
            <AuthenticityTokenInput />
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="mt-2">
                <Input
                  id="newPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  error={password.error}
                  {...conform.input(password, { type: "password" })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="mt-2">
                <Input
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  error={confirmPassword.error}
                  {...conform.input(confirmPassword, { type: "password" })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                disabled={isFormSubmitting}
                className="w-full"
                type="submit"
              >
                {isFormSubmitting && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>
            </div>
          </Form>
        </div>
      </>
    )
  }

  if (lastSubmission?.resetSuccess) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Reset Successful
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your password has been reset successfully.{" "}
              <NavLink className="underline" to="/login">
                Login
              </NavLink>
            </AlertDescription>
          </Alert>
        </div>
      </>
    )
  }
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
