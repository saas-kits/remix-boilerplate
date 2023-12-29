import { useId, useRef } from "react"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import type { FieldConfig } from "@conform-to/react"
import { conform, useForm, useInputEvent } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import {
  Form,
  MetaFunction,
  NavLink,
  useActionData,
  useNavigation,
} from "@remix-run/react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import GoogleLogo from "@/lib/assets/logos/google"
import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommonErrorBoundary } from "@/components/error-boundry"

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Sign up" }]
  }
)

const schema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Email is invalid"),
    fullName: z.string({ required_error: "Full name is required" }),
    password: z.string().min(8, "min check failed"),
    confirmPassword: z.string().min(8, "min check failed"),
    tocAccepted: z.literal("on", {
      errorMap: () => ({ message: "You must accept the terms & conditions" }),
    }),
    // tocAccepted: z.string({
    //   required_error: "You must accept the terms & conditions",
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const action = async ({ request }: ActionFunctionArgs) => {
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

      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this email",
        })
        return
      }
    }),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission)
  }

  return authenticator.authenticate("user-pass", request, {
    successRedirect: "/verify-email",
    throwOnError: true,
    context: { ...submission.value, type: "signup", tocAccepted: true },
  })
}

export default function Signup() {
  const navigation = useNavigation()
  const isFormSubmitting = navigation.state === "submitting"
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { email, fullName, password, confirmPassword, tocAccepted }] =
    useForm({
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
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
        Create new account
      </h2>
      <div className="mt-10 w-full sm:mx-auto">
        <Form className="h-full w-full" {...form.props} method="post">
          <AuthenticityTokenInput />
          <div className="w-full space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="mt-2">
                <Input
                  error={fullName.error}
                  id="fullName"
                  type="text"
                  required
                  {...conform.input(fullName, { type: "text" })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  error={email.error}
                  id="email"
                  type="email"
                  autoComplete="email"
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
                  error={password.error}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...conform.input(password, { type: "password" })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </div>
              <div className="mt-2">
                <Input
                  error={confirmPassword.error}
                  id="confirmPassword"
                  type="password"
                  {...conform.input(confirmPassword, { type: "password" })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <CustomCheckbox
                  label="Accept terms and conditions"
                  id="terms"
                  {...conform.input(tocAccepted, { type: "checkbox" })}
                />
              </div>
              <div className="mt-1 text-sm text-error">{tocAccepted.error}</div>
            </div>

            <Button
              disabled={isFormSubmitting}
              className="w-full"
              type="submit"
            >
              {isFormSubmitting && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up
            </Button>
          </div>
        </Form>
        <Form action="/auth/google" method="post" className="mt-4">
          <Button
            disabled={isFormSubmitting}
            className="w-full"
            type="submit"
            variant="outline"
          >
            <span className="flex items-center space-x-2">
              <GoogleLogo height={18} /> <span>Sign up with Google</span>
            </span>
          </Button>
        </Form>

        <div className="mt-5 flex justify-center">
          <p className="flex-grow text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <NavLink to="/login">
              <Button size="sm" variant="link" className="px-1">
                Sign in
              </Button>
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}

function CustomCheckbox({
  label,
  ...config
}: FieldConfig<string> & { label: string }) {
  const shadowInputRef = useRef<HTMLInputElement>(null)
  const control = useInputEvent({
    ref: shadowInputRef,
  })
  // The type of the ref might be different depends on the UI library
  const customInputRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        ref={customInputRef}
        defaultValue={config.defaultValue}
        onCheckedChange={control.change}
        onBlur={control.blur}
      />
      <input
        ref={shadowInputRef}
        {...conform.input(config, {
          hidden: true,
          type: "checkbox",
        })}
        onFocus={() => customInputRef.current?.focus()}
      />
      <label
        htmlFor="terms"
        className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
