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
import { signInApotekerAction } from "@/app/apoteker/login/lib/action"
import { useFormStatus } from "react-dom"
import { AlertCircle, Lock, Mail } from "lucide-react"
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
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 h-12 font-medium rounded-md transition duration-300 disabled:opacity-70"
    >
      {pending ? "Memproses..." : "Masuk"}
    </Button>
  );
};

export function LoginFormApoteker({
  className,
  ...props
}) {
  const [state, formAction] = useActionState(signInApotekerAction, initialState)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-emerald-700">Portal Apoteker</h1>
        <p className="text-gray-500 mt-1">Sistem Manajemen Farmasi</p>
      </div>
      
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold text-center">Login Apoteker</CardTitle>
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
                    placeholder="apoteker@example.com" 
                    className="pl-10 py-3 h-12 bg-gray-50 focus:bg-white" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                  <Link href="/apoteker/reset-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-800">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    name='password' 
                    id="password" 
                    type="password" 
                    className="pl-10 py-3 h-12 bg-gray-50 focus:bg-white" 
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
        
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-gray-600">
            Bukan apoteker?{" "}
            <Link href="/pasien/login" className="font-medium text-emerald-600 hover:text-emerald-800">
              Kembali ke login utama
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Health Tech
      </div>
    </div>
  );
}