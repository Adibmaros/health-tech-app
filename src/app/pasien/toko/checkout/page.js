// app/pasien/toko/checkout/page.jsx
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
