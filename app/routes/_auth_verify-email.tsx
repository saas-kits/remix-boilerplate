import { ReloadIcon } from "@radix-ui/react-icons";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { isWithinExpiration } from "~/lib/server/auth-utils.sever";
import { authenticator, sendVerificationCode } from "~/services/auth.server";
import { prisma } from "~/services/db/db.server";

const requestCodeSchema = z.object({
  email: z
    .string({ required_error: "This field is required" })
    .email("Invalid email"),
});

const codeVerificationSchema = z.object({
  code: z.string({ required_error: "This field is required" }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const result = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!result) {
      return json({
        codeAvailableWithUser: false,
        email: user.email,
      });
    }

    if (!isWithinExpiration(result.expires)) {
      await prisma.verificationCode.deleteMany({
        where: {
          userId: user.id,
        },
      });
      return json({
        codeAvailableWithUser: false,
        email: user.email,
      });
    }

    return json({
      codeAvailableWithUser: true,
      email: user.email,
    });
  }
}

type FormDataType = {
  intent: "requestCode" | "verifyCode";
} & z.infer<typeof requestCodeSchema> &
  z.infer<typeof codeVerificationSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const clonedRequest = request.clone();
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = Object.fromEntries(
    await clonedRequest.formData()
  ) as unknown as FormDataType;

  switch (formData.intent) {
    case "verifyCode":
      const requestCodeSubmission = await codeVerificationSchema
        .superRefine(async (data, ctx) => {
          const verificationCode = await prisma.verificationCode.findFirst({
            where: {
              userId: user.id,
            },
          });

          if (verificationCode?.code !== formData.code) {
            ctx.addIssue({
              path: ["code"],
              code: z.ZodIssueCode.custom,
              message: "Please enter a valid code",
            });
            return;
          }
        })
        .safeParseAsync(formData);

      if (requestCodeSubmission.success) {
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
          },
        });

        await prisma.verificationCode.deleteMany({
          where: {
            userId: user.id,
          },
        });

        console.log({ updatedUser });
        return json({ verified: true });
      } else {
        console.log("test", requestCodeSubmission.error.flatten());
        return json({
          errors: requestCodeSubmission.error.flatten().fieldErrors,
        });
      }
    case "requestCode":
      const verifyCodeSubmission = requestCodeSchema.safeParse(formData);
      if (verifyCodeSubmission.success) {
        console.log("link works too");
        await sendVerificationCode(user);
        return json({ verified: false });
      } else {
        return json({
          errors: verifyCodeSubmission.error.flatten().fieldErrors,
        });
      }
    default:
      break;
  }
};

export default function VerifyEmail() {
  const navigation = useNavigation();
  const data = useLoaderData<typeof loader>();
  const isFormSubmitting = navigation.state === "submitting";
  const actionData = useActionData<{
    errors: { code: Array<string>; email: Array<string> };
    verified?: boolean;
  }>();

  const isVerifiying =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "verifyCode";

  if (actionData?.verified) {
    return (
      <div className="mt-10">
        <Alert>
          <AlertTitle>Email successfully!</AlertTitle>
          <AlertDescription>
            Email has been verified successfully!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (data.codeAvailableWithUser) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Enter a verification code
        </h2>
        {data.codeAvailableWithUser && (
          <p className="mt-2">
            You must have recieved and email verification code on {data?.email}
          </p>
        )}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="post">
            <input type="text" name="intent" defaultValue="verifyCode" hidden />
            <div>
              <Label htmlFor="code">Verification code</Label>
              <div className="mt-2">
                <Input
                  id="code"
                  type="code"
                  name="code"
                  error={actionData?.errors?.code?.[0]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button disabled={isVerifiying} className="w-full" type="submit">
                {isVerifiying && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify
              </Button>
            </div>
          </Form>
          <div className="mt-5 flex">
            <p className="text-sm text-gray-500 flex-grow text-center">
              Did not recieve code?
              <Form method="post">
                <input
                  type="text"
                  name="intent"
                  defaultValue="requestCode"
                  hidden
                />
                <input
                  defaultValue={data.email}
                  id="email"
                  type="email"
                  name="email"
                  readOnly
                  className="cursor-none pointer-events-none"
                  hidden
                />
                <Button type="submit" size="sm" variant="link" className="px-1">
                  Request new code
                </Button>
              </Form>
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!data.codeAvailableWithUser) {
    return (
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post">
          <div>
            <input
              type="text"
              name="intent"
              defaultValue="requestCode"
              hidden
            />
            <Label htmlFor="email">Email</Label>
            <div className="mt-2">
              <Input
                defaultValue={data.email}
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                readOnly
                className="cursor-none pointer-events-none"
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
              Request Verification code
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
