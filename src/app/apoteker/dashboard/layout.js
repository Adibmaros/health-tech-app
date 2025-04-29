import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function RootLayout({ children }) {
  const { session, user } = await getUser(); // Tambahkan await untuk fungsi async

  if (!session || user.role !== "apoteker") {
    return redirect("/apoteker/login"); // Tambahkan return setelah redirect
  }

  return (
    <div className="bg-white">
      {children}
      <Toaster />
    </div>
  );
}
