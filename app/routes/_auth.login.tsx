import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, NavLink, useActionData, useNavigation } from "@remix-run/react";
import { useId } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/db/db.server";
import { commitSession, getSession } from "~/services/session.server";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z.string().min(8, "min check failed"),

  // tocAccepted: z.string({
  //   required_error: "You must accept the terms & conditions",
  // }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const submission = await parse(formData, {
    schema: schema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
        select: { id: true },
      });

      if (!existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Password and email does not match",
        });
        return;
      }
    }),
    async: true,
  });

  if (!submission.value || submission.intent !== "submit") {
    console.log(JSON.stringify(submission));
    return json(submission);
  }

  try {
    const user = await authenticator.authenticate("user-pass", request, {
      throwOnError: true,
      context: {
        ...submission.value,
        type: "login",
      },
    });

    let session = await getSession(request.headers.get("cookie"));
    // and store the user data
    session.set(authenticator.sessionKey, user);

    let headers = new Headers({ "Set-Cookie": await commitSession(session) });

    // Todo: make redirect config driven
    return redirect("/", { headers });
  } catch (error) {
    // TODO: fix type here
    const typedError = error as any;

    if (typedError?.message === "INVALID_PASSWORD") {
      return {
        ...submission,
        error: { email: ["Email and passwords dont match"] },
      };
    }
  }
};

export default function Login() {
  const navigation = useNavigation();
  const isFormSubmitting = navigation.state === "submitting";
  const lastSubmission = useActionData<typeof action>();
  const id = useId();

  const [form, { email, password }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post" {...form.props}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
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

          <div className="space-y-4">
            <Button
              disabled={isFormSubmitting}
              className="w-full"
              type="submit"
            >
              {isFormSubmitting && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
          </div>
        </Form>

        <div className="mt-5 flex justify-between">
          <p className="text-sm text-gray-500 flex-grow">
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
  );
}
