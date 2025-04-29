import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
}