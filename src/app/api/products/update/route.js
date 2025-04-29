// app/api/products/update/route.js
import { NextResponse } from "next/server";
import { updateProduct } from "@/app/apoteker/products/libs/action";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request) {
  try {
    // Ambil data dari form yang dikirim
    const formData = await request.formData();

    // Dapatkan nilai dari tiap field
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const imageFile = formData.get("image");
    const currentImageUrl = formData.get("currentImageUrl");
    // Tambahkan field requires_prescription
    const requiresPrescription = formData.get("requires_prescription") === "true";

    // Tetapkan imageUrl dengan nilai saat ini terlebih dahulu
    let imageUrl = currentImageUrl;

    // Menangani upload gambar jika ada gambar baru yang diunggah
    if (imageFile && imageFile.size > 0) {
      // Tentukan direktori uploads
      const uploadsDir = path.join(process.cwd(), "public/uploads");

      // Cek jika direktori tidak ada, maka buat
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      try {
        // Buat nama file yang unik dengan timestamp
        const uniqueFilename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const imagePath = path.join(uploadsDir, uniqueFilename);

        // Tulis file ke server
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(imagePath, buffer);

        // Perbarui imageUrl dengan path yang baru
        imageUrl = `/uploads/${uniqueFilename}`;
      } catch (error) {
        console.error("Error saat menyimpan gambar:", error);
        return NextResponse.json({ error: "Gagal menyimpan gambar" }, { status: 500 });
      }
    }

    // Perbarui produk di database
    const updatedProduct = await updateProduct(parseInt(id), {
      name,
      description,
      price: parseInt(price),
      stock: parseInt(stock),
      image_url: imageUrl,
      // Tambahkan field requires_prescription ke update
      requires_prescription: requiresPrescription,
      updated_at: new Date().toISOString(),
    });

    // Kirim respons sukses
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    // Tangani kesalahan
    console.error("Error saat memperbarui produk:", error);
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}
