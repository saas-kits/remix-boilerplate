import { Outlet } from "@remix-run/react";
import { Shell } from "./shell";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return { user };
};
export default function Dashboard() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
