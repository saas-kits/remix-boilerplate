// app/services/auth.server.ts
import type { User } from "@prisma/client";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GoogleStrategy } from "remix-auth-google";
import { z } from "zod";
import { sendVerificationCode } from "~/lib/server/auth-utils.sever";
import { sessionStorage } from "~/services/session.server";
import { prisma } from "./db/db.server";

const payloadSchema = z.object({
  email: z.string(),
  password: z.string(),
  fullName: z.string().optional(),
  tocAccepted: z.literal(true).optional(),
  type: z.enum(["login", "signup"]),
});

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

const keyLength = 32;

export const hash = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt - recommended by NodeJS Docs
    const salt = randomBytes(16).toString("hex");

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      // derivedKey is of type Buffer
      resolve(`${salt}.${derivedKey.toString("hex")}`);
    });
  });
};

export const compare = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, hashKey] = hash.split(".");
    // we need to pass buffer values to timingSafeEqual
    const hashKeyBuff = Buffer.from(hashKey, "hex");
    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      // compare the new supplied password with the hashed password using timeSafeEqual
      resolve(timingSafeEqual(hashKeyBuff, derivedKey));
    });
  });
};

const formStrategy = new FormStrategy(async ({ form, context }) => {
  const parsedData = payloadSchema.safeParse(context);

  if (parsedData.success) {
    const { email, password, type } = parsedData.data;

    if (type === "login") {
      // let user = await login(email, password);
      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (user) {
        if (user.isGoogleSignUp && !user.password) {
          throw new Error("GOOGLE_SIGNUP");
        }

        const isPasswordCorrect = await compare(password, user?.password || "");
        if (isPasswordCorrect) {
          return user;
        } else {
          // TODO: type errors well
          throw new Error("INVALID_PASSWORD");
        }
      }
    } else {
      const hashedPassword = await hash(password);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          fullName: "test",
        },
      });

      sendVerificationCode(user);

      return user;
    }
  } else {
    console.log(parsedData.error.flatten(), "flatten ");
    throw new Error("Parsing Failed", { cause: parsedData.error.flatten() });
  }

  throw new Error("Login failed");
});

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.HOST_URL
      ? `http://${process.env.HOST_URL}/google/callback`
      : "http://localhost:3000/google/callback",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    return await prisma.user.upsert({
      where: {
        email: profile.emails[0].value,
      },
      create: {
        email: profile.emails[0].value,
        emailVerified: true,
        fullName: profile.displayName,
        isGoogleSignUp: true,
      },
      update: {},
    });
  }
);

authenticator.use(formStrategy, "user-pass").use(googleStrategy, "google");
