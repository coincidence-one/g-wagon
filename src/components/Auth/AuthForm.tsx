"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      if (isLogin) {
        // Redirect to home on successful login
        router.push("/");
        router.refresh();
      } else {
        setMessage(
          "Registration successful! Please check your email to confirm.",
        );
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? "환영합니다!" : "회원가입"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isLogin
            ? "군마트 정보를 확인하고 커뮤니티에 참여하세요."
            : "새 계정을 만들고 시작하세요."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">비밀번호</label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {isLogin ? "로그인" : "가입하기"}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs text-gray-400">또는</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <button
        type="button"
        onClick={async () => {
          setLoading(true);
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
            options: {
              redirectTo: window.location.origin,
              scopes: "profile_nickname profile_image", // Explicitly ask for only what is enabled
            },
          });
          if (error) setMessage(error.message);
          // Note: OAuth redirect happens automatically, so loading state persists until redirect
        }}
        disabled={loading}
        className="w-full py-3 bg-[#FEE500] text-[#000000] font-bold rounded-lg shadow-sm hover:bg-[#FDD835] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className="fill-[#000000]"
        >
          <path d="M12 3C5.373 3 0 7.373 0 12.768c0 3.39 2.15 6.426 5.513 8.237-.245.908-.887 3.284-.913 3.447-.04.257.092.254.34.204.22-.046 3.666-2.433 4.256-2.856.918.133 1.867.204 2.804.204 6.627 0 12-4.373 12-9.768C24 7.373 18.627 3 12 3z" />
        </svg>
        카카오로 시작하기
      </button>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }}
          className="text-sm text-gray-500 hover:text-orange-600 font-medium transition-colors"
        >
          {isLogin
            ? "계정이 없으신가요? 회원가입"
            : "이미 계정이 있으신가요? 로그인"}
        </button>
      </div>
    </div>
  );
}
