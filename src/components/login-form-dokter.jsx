
"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { signInDokterAction } from "@/app/dokter/login/lib/action"
import { useFormStatus } from "react-dom"
import { AlertCircle, Mail, LockKeyhole, Stethoscope } from "lucide-react"
import Link from "next/link"

const initialState = {
  message: ""
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button 
      disabled={pending} 
      type="submit" 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12 font-medium rounded-md transition duration-300 shadow-sm disabled:opacity-70"
    >
      {pending ? "Memproses..." : "Masuk"}
    </Button>
  );
};

export function LoginFormDokter({
  className,
  ...props
}) {
  const [state, formAction] = useActionState(signInDokterAction, initialState)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center mb-2">
        <div className="flex justify-center mb-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Stethoscope className="h-8 w-8 text-blue-700" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-blue-800">Portal Dokter</h1>
        <p className="text-gray-500 mt-1">Sistem Informasi Medis</p>
      </div>
      
      <Card className="shadow-lg border-gray-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-sky-400"></div>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold text-center">Login Dokter</CardTitle>
          <CardDescription className="text-center">
            Masukkan kredensial untuk mengakses akun Anda
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-5">
              {state.message !== "" && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{state.message}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-gray-700">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input 
                    name="email" 
                    id="email" 
                    type="email" 
                    placeholder="dokter@example.com" 
                    className="pl-10 py-3 h-12 bg-gray-50 focus:bg-white border-gray-300" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                  <Link href="/dokter/reset-password" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <Input 
                    name='password' 
                    id="password" 
                    type="password" 
                    className="pl-10 py-3 h-12 bg-gray-50 focus:bg-white border-gray-300" 
                    required 
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <SubmitButton />
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t p-6">
          <p className="text-sm text-gray-600">
            Bukan dokter?{" "}
            <Link href="/pasien/login" className="font-medium text-blue-600 hover:text-blue-800">
              Kembali ke login utama
            </Link>
          </p>
          
          <div className="w-full border-t border-gray-200 pt-4">
            <p className="text-xs text-center text-gray-500">
              Akses sistem ini hanya untuk tenaga medis yang terdaftar.
            </p>
          </div>
        </CardFooter>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sistem Informasi Kesehatan
      </div>
    </div>
  );
}