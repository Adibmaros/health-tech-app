// src/app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Menangani request DELETE untuk menghapus produk

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const product = await prisma.products.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Validasi id
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: "ID produk tidak valid" }, { status: 400 });
    }

    // Cari produk yang akan dihapus
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });

    // Jika produk tidak ditemukan
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // Hapus produk
    await prisma.products.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus produk" }, { status: 500 });
  }
}
