import prisma from "@/lib/prisma";

export async function updateProduct(id, data) {
  try {
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: data,
    });

    return updatedProduct;
  } catch (error) {
    console.error("Error saat memperbarui produk:", error);
    throw error;
  }
}
