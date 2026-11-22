import { SignJWT, jwtVerify } from "jose";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";

export const COOKIE = "admin_session";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function checkCredentials(email: string, password: string) {
  // Always run the hash check so timing doesn't reveal whether the email matched.
  const okEmail = email.toLowerCase() === process.env.ADMIN_EMAIL!.toLowerCase();
  const okPass = await verify(process.env.ADMIN_PASSWORD_HASH!, password).catch(() => false);
  return okEmail && okPass;
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}
