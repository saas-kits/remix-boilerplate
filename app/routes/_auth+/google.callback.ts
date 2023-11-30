import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
