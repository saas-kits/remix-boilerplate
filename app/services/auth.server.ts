// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import { sessionStorage } from "~/services/session.server";

type User = {
  email: String;
  fullName: String;
};

async function login(email: string, password: string) {
  return { email: "shyam@example.com", fullName: "Shyam" };
}

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    const parsedUser = loginSchema.safeParse({ email, password });

    if (parsedUser.success) {
      const { email, password } = parsedUser.data;
      let user = await login(email, password);
      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      return user;
    }

    throw new Error("Login Failed");
  }),

  "user-pass"
);
