import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const { session, user } = await getUser(); // Tambahkan await untuk fungsi async

  if (!session || user.role !== "pasien") {
    return redirect("/pasien/login"); // Tambahkan return setelah redirect
  }

  return <div className="bg-white">{children}</div>;
}
