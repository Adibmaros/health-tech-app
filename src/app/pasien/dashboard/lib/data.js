import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function getQuestionsByUser() {
  const { user } = await getUser();
  const userId = user.id;

  try {
    const questions = await prisma.question.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        file_path: true, // Explicitly select file_path
        question: true,
        created_at: true,
        jawaban: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
      orderBy: {
        created_at: "desc", // Sort by most recent first
      },
    });

    return questions;
  } catch (error) {
    console.error("Error fetching user questions:", error);
    return [];
  }
}

export async function getQuestionById(questionId) {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        jawaban: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    return question;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    return null;
  }
}
