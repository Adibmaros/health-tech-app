// src/atoms/cartAtom.js
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Gunakan atomWithStorage untuk menyimpan data cart di localStorage
export const cartAtom = atomWithStorage("cart", {
  items: [],
});

// Atom turunan untuk menghitung total items
export const cartItemCountAtom = atom((get) => get(cartAtom).items.reduce((total, item) => total + item.quantity, 0));

// Atom turunan untuk menghitung total harga
export const cartTotalAmountAtom = atom((get) => get(cartAtom).items.reduce((total, item) => total + item.price * item.quantity, 0));

// Atom untuk mencari produk di cart
export const findCartItemAtom = atom(null, (get, set, productId) => {
  const cart = get(cartAtom);
  return cart.items.find((item) => item.productId === productId);
});

// Atom untuk menambah produk ke cart
export const addToCartAtom = atom(null, (get, set, product) => {
  const cart = get(cartAtom);
  const existingItem = cart.items.find((item) => item.productId === product.id);

  if (existingItem) {
    set(cartAtom, {
      ...cart,
      items: cart.items.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
    });
  } else {
    set(cartAtom, {
      ...cart,
      items: [
        ...cart.items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          quantity: 1,
        },
      ],
    });
  }
});

// Atom untuk mengurangi jumlah produk dari cart
export const decreaseFromCartAtom = atom(null, (get, set, productId) => {
  const cart = get(cartAtom);
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem && existingItem.quantity > 1) {
    set(cartAtom, {
      ...cart,
      items: cart.items.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item)),
    });
  } else if (existingItem && existingItem.quantity <= 1) {
    // Hapus item jika quantity menjadi 0
    set(cartAtom, {
      ...cart,
      items: cart.items.filter((item) => item.productId !== productId),
    });
  }
});

// Atom untuk menghapus produk dari cart
export const removeFromCartAtom = atom(null, (get, set, productId) => {
  const cart = get(cartAtom);
  set(cartAtom, {
    ...cart,
    items: cart.items.filter((item) => item.productId !== productId),
  });
});

// Atom untuk mengosongkan cart
export const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, { items: [] });
});
