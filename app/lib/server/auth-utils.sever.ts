import * as crypto from "crypto"
import type { User } from "@prisma/client"

import { prisma } from "@/services/db/db.server"
import { sendEmail } from "@/services/email/resend.server"
import ResetPasswordEmailTemplate from "@/components/email/reset-password-template"
import VerificationEmailTemplate from "@/components/email/verify-email-template"

import { siteConfig } from "../brand/config"

const EXPIRES_IN = 1000 * 60 * 20 // 20 mins

const DEFAULT_ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890"

export const generateRandomString = (
  length: number,
  alphabet: string = DEFAULT_ALPHABET
) => {
  const randomUint32Values = new Uint32Array(length)
  crypto.getRandomValues(randomUint32Values)
  const u32Max = 0xffffffff
  let result = ""
  for (let i = 0; i < randomUint32Values.length; i++) {
    const rand = randomUint32Values[i] / (u32Max + 1)
    result += alphabet[Math.floor(alphabet.length * rand)]
  }
  return result
}

export const isWithinExpiration = (expiresInMs: number | bigint): boolean => {
  const currentTime = Date.now()
  if (currentTime > expiresInMs) return false
  return true
}

// TODO: decide where this util should reside here or auth.server.ts
export const sendResetPasswordLink = async (user: User) => {
  async function emailResetLink(code: string) {
    // TODO: user env variable for url of reset link
    const url = process.env.HOST_URL
      ? `http://${process.env.HOST_URL}/reset-password?code=${code}`
      : `http://localhost:3000/reset-password?code=${code}`
    await sendEmail(
      `${user.fullName} <${user.email}>`,
      `Password reset - ${siteConfig.title}`,
      ResetPasswordEmailTemplate({ resetLink: url })
    )
  }

  const storedUserTokens = await prisma.passwordResetToken.findMany({
    where: {
      userId: user.id,
    },
  })
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 1 hour
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2)
    })
    if (reusableStoredToken) {
      await emailResetLink(reusableStoredToken.token)
      return
    }
  }
  const token = generateRandomString(63)
  await prisma.passwordResetToken.create({
    data: {
      token,
      expires: new Date().getTime() + EXPIRES_IN,
      userId: user.id,
    },
  })

  await emailResetLink(token)
}

export const sendVerificationCode = async (user: User) => {
  const code = generateRandomString(8, "0123456789")

  await prisma.$transaction(async (trx) => {
    await trx.verificationCode
      .deleteMany({
        where: {
          userId: user.id,
        },
      })
      .catch()

    await trx.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expires: Date.now() + 1000 * 60 * 20, // 10 minutes
      },
    })

    await sendEmail(
      `${user.fullName} <${user.email}>`,
      `Verification code - ${siteConfig.title}`,
      VerificationEmailTemplate({ validationCode: code })
    )
  })

  if (process.env.NODE_ENV === "development") {
    console.log(`verification for ${user.email} code is: ${code}`)
    // TODO: drive port number using env variable
  } else {
    // TODO: add handling for sending mails
  }
}

export const validatePasswordResetToken = async (token: string) => {
  const storedToken = await prisma.$transaction(async (trx) => {
    const storedToken = await trx.passwordResetToken.findFirst({
      where: {
        token,
      },
    })

    if (!storedToken) {
      throw new Error("Invalid token")
    }

    await trx.passwordResetToken.delete({
      where: {
        token,
      },
    })

    return storedToken
  })
  const tokenExpires = Number(storedToken.expires)
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error("Expired token")
  }
  return storedToken.userId
}
