import prisma from "@/lib/prisma";

export async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      where: {
        jawaban: {
          none: {}, // This ensures only questions without answers are returned
        },
      },
      include: {
        jawaban: true,
      },
    });
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
