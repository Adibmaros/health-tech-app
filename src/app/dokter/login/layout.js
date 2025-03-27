import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const { session, user } = await getUser(); // Tambahkan await untuk fungsi async

  if (session && user.role === "dokter") {
    return redirect("/dokter/dashboard"); // Tambahkan return setelah redirect
  }

  return <div className="bg-white">{children}</div>;
}
