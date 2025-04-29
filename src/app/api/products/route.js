import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Menangani request GET untuk mengambil semua produk
export async function GET() {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data produk" }, { status: 500 });
  }
}

// Menangani request POST untuk membuat produk baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, stock, description, image_url, requires_prescription } = body;

    // Validasi input
    if (!name || !price || !stock || !description || !image_url || !requires_prescription) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Buat produk baru
    const product = await prisma.products.create({
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        description,
        image_url,
        requires_prescription,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menambahkan produk" }, { status: 500 });
  }
}
