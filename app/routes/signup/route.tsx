import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink } from "@remix-run/react";
import React from "react";
import { Button } from "~/components /ui/button";
import { Input } from "~/components /ui/input";
import { brandConfig } from "~/lib/brand/config";
import { BRAND_ASSETS } from "~/lib/brand/assets";
import { authenticator } from "~/services/auth.server";
import { Label } from "~/components /ui/label";
import { Checkbox } from "~/components /ui/checkbox";

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
  });
  console.log({ user });
  return user;
};

export default function Signup() {
  return (
    <Form className="h-full">
      {/* <Form className="space-y-4 max-w-sm mx-auto py-10" method="POST">
        <Input type="email" name="email" />
        <Input type="password" name="password" />
        <Button>Login</Button>
      </Form> */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center flex-col items-center">
          {BRAND_ASSETS[brandConfig.default_logo]}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="mt-2">
                <Input id="fullName" name="fullName" type="text" required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
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
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </div>
              <div className="mt-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="tocAccepted" />
              <label
                htmlFor="terms"
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>

            <div className="space-y-4">
              <Button className="w-full" type="submit">
                Sign up
              </Button>
            </div>
          </form>

          <div className="mt-5 flex justify-center">
            <p className="text-sm text-gray-500 flex-grow text-center">
              Already a member?{" "}
              <NavLink to="/login">
                <Button size="sm" variant="link" className="px-1">
                  Sign in
                </Button>
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </Form>
  );
}
