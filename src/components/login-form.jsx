"use client"

import { useState } from "react"
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
import { signInAction } from "@/app/pasien/login/lib/action"
import { useFormStatus } from "react-dom"
import { AlertCircle } from "lucide-react"

const initialState = {
  message: ""
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Processing..." : "Sign In"}
    </Button>
  );
};

export function LoginForm({
  className,
  ...props
}) {
  const [state, formAction] = useActionState(signInAction, initialState)

  return (
    <Card className={cn("shadow-lg border-gray-200", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Patient Portal</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          {state.message !== "" && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center space-x-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{state.message}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email" 
              type="email"
              placeholder="name@example.com"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="w-full"
            />
          </div>
          
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/pasien/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}