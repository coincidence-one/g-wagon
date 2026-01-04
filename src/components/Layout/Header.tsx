"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, LogOut, Map } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black text-orange-600 tracking-tighter flex items-center gap-2"
          >
            <span>G-WAGON</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Map size={16} />
              지도
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              커뮤니티
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">
                {user.email?.split("@")[0]}님
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="로그아웃"
              >
                <LogOut size={20} />
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm font-bold text-white bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <User size={16} />
              <span>로그인</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
