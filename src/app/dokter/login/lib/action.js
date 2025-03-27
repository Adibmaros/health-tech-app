"use server";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function signInDokterAction(_, formData) {
  const validate = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validate.success) {
    return {
      message: "Email atau password tidak valid",
    };
  }

  const existingPasien = await prisma.user.findFirst({
    where: {
      email: validate.data.email,
      role: "dokter",
    },
  });

  if (!existingPasien) {
    return {
      message: "Email atau password tidak valid",
    };
  }

  const validatePassword = bcrypt.compareSync(validate.data.password, existingPasien.password);

  if (!validatePassword) {
    return {
      message: "Email atau password tidak valid",
    };
  }

  const session = await lucia.createSession(existingPasien.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/dokter/dashboard");
}
