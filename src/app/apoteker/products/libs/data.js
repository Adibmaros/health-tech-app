import prisma from "@/lib/prisma";

export async function getAllPrdoducts() {
  const products = await prisma.products.findMany();
  return products;
}

export async function getProductById(id) {
  const product = await prisma.products.findUnique({
    where: {
      id: id,
    },
  });
  return product;
}
