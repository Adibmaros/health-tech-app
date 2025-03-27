"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { signInDokterAction } from "@/app/dokter/login/lib/action"
import { useFormStatus } from "react-dom"


const initialState = {
  message : ""
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50">
      {pending ? "Proses..." : "Login"}
    </button>
  );
};

export function LoginFormDokter({
  className,
  ...props
}) {

  const [state, formAction] = useActionState(signInDokterAction,initialState)

  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
            {state.message !== "" && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{state.message}</div>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input name='password' id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <SubmitButton/>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
