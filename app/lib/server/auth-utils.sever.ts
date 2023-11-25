import { prisma } from "~/services/db/db.server";
import * as crypto from "crypto";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

const DEFAULT_ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890";

export const generateRandomString = (
  length: number,
  alphabet: string = DEFAULT_ALPHABET
) => {
  const randomUint32Values = new Uint32Array(length);
  crypto.getRandomValues(randomUint32Values);
  const u32Max = 0xffffffff;
  let result = "";
  for (let i = 0; i < randomUint32Values.length; i++) {
    const rand = randomUint32Values[i] / (u32Max + 1);
    result += alphabet[Math.floor(alphabet.length * rand)];
  }
  return result;
};

export const isWithinExpiration = (expiresInMs: number | bigint): boolean => {
  const currentTime = Date.now();
  if (currentTime > expiresInMs) return false;
  return true;
};

export const generatePasswordResetToken = async (userId: string) => {
  const storedUserTokens = await prisma.passwordResetToken.findMany({
    where: {
      userId,
    },
  });
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 1 hour
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(63);
  await prisma.passwordResetToken.create({
    data: {
      token,
      expires: new Date().getTime() + EXPIRES_IN,
      userId: userId,
    },
  });

  return token;
};

export const validatePasswordResetToken = async (token: string) => {
  const storedToken = await prisma.$transaction(async (trx) => {
    const storedToken = await trx.passwordResetToken.findFirst({
      where: {
        token,
      },
    });

    if (!storedToken) {
      throw new Error("Invalid token");
    }

    await trx.passwordResetToken.delete({
      where: {
        id: token,
      },
    });

    return storedToken;
  });
  const tokenExpires = Number(storedToken.expires);
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error("Expired token");
  }
  return storedToken.userId;
};
