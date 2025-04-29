import { NextResponse } from "next/server";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";

// Karena Next.js App Router tidak mendukung formidable secara langsung
// kita perlu implementasi manual untuk handle file upload

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat direktori upload jika belum ada
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
      await fs.access(uploadDir);
    } catch (error) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Buat nama file unik
    const timestamp = new Date().getTime();
    const originalFilename = file.name.replace(/\s/g, "_");
    const filename = `${timestamp}-${originalFilename}`;
    const filePath = path.join(uploadDir, filename);

    // Simpan file
    await writeFile(filePath, buffer);

    // Return URL relatif
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error saat upload file:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
