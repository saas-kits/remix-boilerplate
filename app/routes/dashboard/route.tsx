import { Outlet } from "@remix-run/react";
import { Shell } from "./shell";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { getSubscriptionByUserId } from "~/models/subscription";
import { getUserById } from "~/models/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
 const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await getUserById(session.id);

  if (!user) {
    return redirect("/login");
  }

  if (!user.customerId) {
    return redirect("/resources/stripe/create-customer");
  }
  

  const subscription = await getSubscriptionByUserId(user.id);

  if (!subscription) {
    return redirect("/resources/stripe/create-subscription");
  }

  return { user };
};
export default function Dashboard() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
