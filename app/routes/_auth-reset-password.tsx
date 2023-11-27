import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, NavLink, useActionData, useNavigation } from "@remix-run/react";
import { AlertCircle } from "lucide-react";
import { useId } from "react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components /ui/alert";
import { Button } from "~/components /ui/button";
import { Input } from "~/components /ui/input";
import { Label } from "~/components /ui/label";
import { validatePasswordResetToken } from "~/lib/server/auth-utils.sever";
import { authenticator, hash } from "~/services/auth.server";
import { prisma } from "~/services/db/db.server";

const schema = z
  .object({
    password: z.string().min(8, "min check failed"),
    confirmPassword: z.string().min(8, "min check failed"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");

  const formData = await request.formData();

  const submission = await parse(formData, {
    schema,
  });

  if (!code) {
    return json({ ...submission, isLinkExpired: true, resetSuccess: false });
  }

  if (!submission.value || submission.intent !== "submit") {
    return json({ ...submission, isLinkExpired: false, resetSuccess: false });
  }

  // TODO: check naming conventions
  const resetToken = await prisma.passwordResetToken.findFirst({
    // TODO: confirm if we should keep it code or rename to token
    where: {
      token: code,
    },
  });

  if (resetToken) {
    try {
      const userId = await validatePasswordResetToken(resetToken?.token);

      const hashedPassword = await hash(submission.value.password);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return json({ ...submission, isLinkExpired: false, resetSuccess: true });
    } catch (error) {
      console.log({ error });
      return json({ ...submission, isLinkExpired: true, resetSuccess: false });
    }
  } else {
    return json({ ...submission, isLinkExpired: true, resetSuccess: false });
  }
};

export default function ForgotPassword() {
  const navigation = useNavigation();
  const isFormSubmitting = navigation.state === "submitting";
  const lastSubmission = useActionData<typeof action>();
  const id = useId();

  const [form, { password, confirmPassword }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  if (lastSubmission?.isLinkExpired) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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
    );
  }
  if (!lastSubmission?.isLinkExpired && !lastSubmission?.resetSuccess) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset password
        </h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="post" {...form.props}>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="mt-2">
                <Input
                  id="newPassword"
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
    );
  }

  if (lastSubmission?.resetSuccess) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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
    );
  }
}
