// app/apoteker/products/[id]/edit/page.jsx
import React from "react";
import { getProductById } from "../../libs/data";
import Link from "next/link";
import EditProductForm from "@/components/EditproductForm";

const EditProductPage = async ({ params }) => {
  const id = params?.id;
  const productId = parseInt(id);

  const product = await getProductById(productId);
  console.log(product);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">Produk tidak ditemukan</p>
        <Link href="/apoteker/products" className="text-blue-500 hover:underline">
          Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Edit Produk</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <EditProductForm product={product} />
      </div>
    </div>
  );
};

export default EditProductPage;
