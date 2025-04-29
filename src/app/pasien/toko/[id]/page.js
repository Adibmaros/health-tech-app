"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAtom } from "jotai";
import { cartAtom } from "@/lib/atom";
import { StarIcon, Minus, Plus, ShoppingCart, Heart, ArrowLeft, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

// This should be replaced with your actual API call to fetch product details
const fetchProductDetails = async (id) => {
  // Replace with your actual API call
  const response = await fetch(`/api/products/${id}`);
  const data = await response.json();
  return data;
};

export default function ProductDetail({ params }) {
  const productId = params.id;
  const router = useRouter();
  const [cart, setCart] = useAtom(cartAtom);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Check if product is in cart
  const cartItem = cart.items.find((item) => item.productId === parseInt(productId));
  const isInCart = Boolean(cartItem);

  // Calculate cart total
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fetch product details
  React.useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProductDetails(productId);
        setProduct(data);
      } catch (err) {
        setError("Gagal memuat data produk");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProductDetails();
  }, [productId]);

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = () => {
    setCart((prevCart) => {
      // Cek apakah produk sudah ada di keranjang
      const existingItemIndex = prevCart.items.findIndex((item) => item.productId === parseInt(productId));

      if (existingItemIndex >= 0) {
        // Jika sudah ada, tambah quantity
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };

        return {
          ...prevCart,
          items: updatedItems,
        };
      } else if (product) {
        // Jika belum ada, tambahkan produk baru
        return {
          ...prevCart,
          items: [
            ...prevCart.items,
            {
              productId: parseInt(productId),
              name: product.name,
              price: product.price,
              image: product.image_url,
              quantity: quantity,
              requires_prescription: product.requires_prescription,
            },
          ],
        };
      }

      return prevCart;
    });

    // Show the cart after adding item
    setShowCart(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.productId !== productId),
    }));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item)),
    }));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error || "Produk tidak ditemukan"}</p>
          <button onClick={() => router.back()} className="mt-2 bg-white border border-red-300 text-red-700 px-4 py-2 rounded-md flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Use a deterministic approach for discount
  const hasDiscount = product.price > 50000 && parseInt(productId) % 2 === 0;
  const discountedPrice = hasDiscount ? Math.floor(product.price * 0.85) : product.price;
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => router.push("/pasien/toko")} className="hover:text-blue-600">
          Toko Kesehatan
        </button>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Detail Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4 relative">
              {/* Badge jika memerlukan resep */}
              {product.requires_prescription && <div className="absolute top-4 left-4 bg-red-500 text-white text-xs py-1 px-2 rounded-md font-medium z-10">Butuh Resep</div>}

              {/* Badge jika diskon */}
              {hasDiscount && <div className="absolute top-4 right-4 bg-green-500 text-white text-xs py-1 px-2 rounded-md font-medium z-10">Hemat 15%</div>}

              {product.image_url ? (
                <Image src={product.image_url} alt={product.name} width={300} height={300} className="object-contain max-h-80 w-auto" />
              ) : (
                <div className="text-gray-300 h-64 w-64 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={16} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(50 ulasan)</span>

                <button onClick={toggleFavorite} className="ml-4 flex items-center text-sm text-gray-500 hover:text-red-500">
                  <Heart size={16} className={`mr-1 ${isFavorite ? "text-red-500 fill-red-500" : ""}`} />
                  {isFavorite ? "Favorit" : "Tambah ke Favorit"}
                </button>
              </div>

              {/* Price */}
              <div className="mb-4">
                {hasDiscount && <p className="text-sm text-gray-400 line-through">Rp {product.price.toLocaleString("id-ID")}</p>}
                <p className="text-xl font-bold text-gray-800">Rp {discountedPrice.toLocaleString("id-ID")}</p>
              </div>

              {/* Stock */}
              <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-md inline-flex items-center mb-4 w-fit">Stok: {product.stock} tersedia</div>

              {product.requires_prescription && (
                <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md mb-4">
                  <p className="font-medium">Produk ini membutuhkan resep dokter</p>
                  <p className="text-xs">Anda perlu mengunggah resep dokter saat checkout</p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Deskripsi Produk</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center mb-6">
                <span className="text-sm font-medium text-gray-700 mr-4">Jumlah:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={decrementQuantity} disabled={quantity <= 1} className="p-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-1 text-center w-12">{quantity}</span>
                  <button onClick={incrementQuantity} disabled={quantity >= product.stock} className="p-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">Total:</p>
                <p className="text-xl font-bold text-gray-800">Rp {totalPrice.toLocaleString("id-ID")}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex">
                <button onClick={addToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition">
                  <ShoppingCart size={18} className="mr-2" />
                  {isInCart ? "Tambah Lagi ke Keranjang" : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Preview Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-4">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Keranjang Anda</h2>
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">{cart.items.length} item</span>
              </div>
            </div>

            {cart.items.length === 0 ? (
              <div className="p-4 flex flex-col items-center justify-center text-center py-8">
                <ShoppingCart size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Keranjang belanja Anda kosong</p>
                <button onClick={() => router.push("/pasien/toko")} className="mt-4 text-blue-600 text-sm hover:text-blue-700">
                  Lanjutkan Belanja
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 max-h-80 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 mr-3">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={64} height={64} className="object-contain w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <Link href={`/pasien/toko/${item.productId}`}>
                            <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-1">{item.name}</h3>
                          </Link>
                          <button onClick={() => removeFromCart(item.productId)} className="text-gray-400 hover:text-red-500">
                            <X size={16} />
                          </button>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">Rp {item.price.toLocaleString("id-ID")}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2 justify-between">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs">{item.quantity}</span>
                            <button onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="text-sm font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                        </div>

                        {/* Prescription Label */}
                        {item.requires_prescription && (
                          <div className="mt-1">
                            <span className="text-xs text-red-500">Butuh Resep</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-medium">Rp {cartTotal.toLocaleString("id-ID")}</span>
                  </div>

                  <Link href="/pasien/checkout">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition mt-2">
                      <ShoppingCart size={16} className="mr-2" />
                      Checkout
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
