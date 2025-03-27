"use server";
import { redirect } from "next/navigation";
import { schemaSignUp } from "@/lib/schema";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function signUp(_, formData) {
  const parse = schemaSignUp.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parse.success) {
    return {
      message: parse.error.errors[0].message,
    };
  }

  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email: parse.data.email },
  });

  if (existingUser) {
    return {
      message: "Email sudah terdaftar",
    };
  }

  const hashedPassword = bcrypt.hashSync(parse.data.password, 12);

  try {
    await prisma.user.create({
      data: {
        email: parse.data.email,
        name: parse.data.name,
        password: hashedPassword,
        role: "pasien",
      },
    });
  } catch (err) {
    console.error(err);
    return {
      message: "Gagal mendaftar. Silakan coba lagi.",
    };
  }
  return redirect("/pasien/login");
}
