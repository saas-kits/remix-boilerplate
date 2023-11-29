import type { LoaderFunctionArgs } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getUserById, updateUserById } from "~/models/user";
import { authenticator } from "~/services/auth.server";
import { createStripeCustomer } from "~/services/stripe/stripe.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await getUserById(session.id);
  if (!user) return redirect("/login");
  if (!user.email || !user.fullName) return redirect("/login");
  if (user.customerId) return redirect("/");

  const stripeCustomer = await createStripeCustomer(
    {
      email: user.email,
      fullName: user.fullName,
    },
    {
      // send user id to stripe so we can match it later in webhook
      userId: user.id,
    }
  );
  if (!stripeCustomer) throw new Error("Unable to create Stripe Customer.");

  // Update user.
  await updateUserById(user.id, { customerId: stripeCustomer.id });

  return redirect("/account");
}
