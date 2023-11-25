// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import { sessionStorage } from "~/services/session.server";
import { prisma } from "./db/db.server";
import type { User } from "@prisma/client";

async function login(email: string, password: string) {
  return { email: "shyam@example.com", fullName: "Shyam", id: "1234" } as User;
}

const payloadSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    fullName: z.string().optional(),
    tocAccepted: z.literal(true).optional(),
    type: z.enum(["login", "signup"]),
  })
  .refine((data) => data.type === "signup" && data.fullName?.length, {
    path: ["fullName"],
    message: "Full Name is required",
  })
  .refine((data) => data.type === "signup" && data.tocAccepted, {
    path: ["tocAccepted"],
    message: "Please accept the terms and conditions",
  });

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    const parsedData = payloadSchema.safeParse(context);

    if (parsedData.success) {
      const { email, password, type } = parsedData.data;
      if (type === "login") {
        let user = await login(email, password);
        // the type of this user must match the type you pass to the Authenticator
        // the strategy will automatically inherit the type if you instantiate
        // directly inside the `use` method
        return user;
      } else {
        // TODO: hash password
        const user = await prisma.user.create({
          data: {
            email: parsedData.data.email,
            password: parsedData.data.password,
            fullName: "test",
          },
        });
        return user;
      }
    }

    throw new Error("Login Failed", { cause: parsedData.error.flatten() });
  }),

  "user-pass"
);
