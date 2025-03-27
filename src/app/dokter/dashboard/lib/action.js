"use server";

import { getUser, lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { answerShema } from "@/lib/schema";

export async function createQuestionAction(_, formData) {
  const { session } = await getUser();
  const idUser = session?.userId;

  if (!session || !idUser) {
    throw new Error("Anda harus login terlebih dahulu");
  }

  try {
    const question = formData.get("question");
    const file = formData.get("file");

    if (!question) {
      return {
        success: false,
        message: "Pertanyaan tidak valid",
      };
    }

    const questionData = {
      user_id: idUser,
      question: question.trim(),
    };

    // Handle file upload if present
    if (file && file instanceof File && file.size > 0) {
      const filename = `${idUser}_${Date.now()}_${file.name}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "questions");
      const fullPath = path.join(uploadDir, filename);

      // Ensure upload directory exists
      await mkdir(uploadDir, { recursive: true });

      // Convert File to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write file
      await writeFile(fullPath, buffer);

      // Store relative path in database
      questionData.file_path = `/uploads/questions/${filename}`;
    }

    const newQuestion = await prisma.question.create({
      data: questionData,
    });

    return {
      success: true,
      message: "Pertanyaan berhasil dibuat",
      questionId: newQuestion.id,
    };
  } catch (error) {
    console.error("Error creating question:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat pertanyaan",
    };
  }
}

// Utility to ensure directory exists
async function mkdir(dir, options = {}) {
  const fs = require("fs/promises");
  try {
    await fs.mkdir(dir, options);
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

export async function logOutAction(_, formData) {
  const { session } = await getUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  const cookie = await cookies();
  cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export async function createJawaban(_, formData) {
  const { session } = await getUser();
  const validate = answerShema.safeParse({
    answer: formData.get("answer"),
    question_id: Number(formData.get("question_id")),
  });

  if (!validate.success) {
    return {
      success: false,
      message: validate.error.issues[0].message,
    };
  }

  try {
    // Create jawaban in the database
    const jawaban = await prisma.jawaban.create({
      data: {
        question_id: validate.data.question_id,
        user_id: session.userId, // Assuming the session contains user information
        message: validate.data.answer,
      },
    });

    return {
      success: true,
      message: "Jawaban berhasil dikirim",
      data: jawaban,
    };
  } catch (error) {
    console.error("Error creating jawaban:", error);
    return {
      success: false,
      message: "Gagal mengirim jawaban. Silakan coba lagi.",
    };
  }
}
