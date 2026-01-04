import AuthForm from "@/components/Auth/AuthForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 flex justify-start">
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          돌아가기
        </Link>
      </div>
      <AuthForm />
    </div>
  );
}
