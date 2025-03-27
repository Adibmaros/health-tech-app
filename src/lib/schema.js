import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(50, "Password maksimal 50 karakter"),
});

export const schemaSignUp = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(50, "Password maksimal 50 karakter"),
});

export const questionSchema = z.object({
  question: z.string().min(10, { message: "Pertanyaan harus memiliki minimal 10 karakter" }).max(500, { message: "Pertanyaan tidak boleh lebih dari 500 karakter" }),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (file) {
          // Validasi ukuran file (misalnya maks 5MB)
          return file.size <= 5 * 1024 * 1024;
        }
        return true;
      },
      { message: "Ukuran file tidak boleh melebihi 5MB" }
    )
    .refine(
      (file) => {
        if (file) {
          // Validasi tipe file (contoh: hanya gambar)
          const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "application/pdf"];
          return allowedTypes.includes(file.type);
        }
        return true;
      },
      { message: "Tipe file tidak diizinkan. Hanya JPEG, PNG, GIF, dan PDF yang diperbolehkan" }
    ),
});

export const answerShema = z.object({
  answer: z.string().min(10, { message: "Jawaban harus memiliki minimal 10 karakter" }).max(500, { message: "Jawaban tidak boleh lebih dari 500 karakter" }),
  question_id: z.number().int("ID pertanyaan tidak valid"),
});
