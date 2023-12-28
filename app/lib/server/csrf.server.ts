// app/utils/csrf.server.ts
import { createCookie } from "@remix-run/node" // or cloudflare/deno
import { CSRF, CSRFError } from "remix-utils/csrf/server"

export const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  secrets: [process.env.SESSION_SECRET!],
})

export const csrf = new CSRF({
  cookie,
  // what key in FormData objects will be used for the token, defaults to `csrf`
  formDataKey: "csrf",
  // an optional secret used to sign the token, recommended for extra safety
  secret: process.env.SESSION_SECRET!,
})

export async function validateCsrfToken(request: Request) {
  try {
    await csrf.validate(request)
  } catch (error) {
    if (error instanceof CSRFError) {
      throw new Response("Invalid CSRF token", { status: 403 })
    }
    throw error
  }
}
