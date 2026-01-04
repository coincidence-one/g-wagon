"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, Search, X } from "lucide-react";
import { PXStore, stores as mockStores } from "../../../lib/mockData";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedStore, setSelectedStore] = useState<PXStore | null>(null);

  // Store Search State
  const [searchQuery, setSearchQuery] = useState("");
  // searchResults is derived via useMemo
  const [showResults, setShowResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter stores as user types
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockStores
      .filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.address.includes(searchQuery),
      )
      .slice(0, 5);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      user_id: user.id,
      store_id: selectedStore?.id || null,
      store_name: selectedStore?.name || null,
    });

    setLoading(false);

    if (error) {
      alert("게시글 작성 중 오류가 발생했습니다: " + error.message);
    } else {
      router.push("/community");
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Link
          href="/community"
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          목록으로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* Store Tag Input */}
        <div ref={searchRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            관련 마트 (선택)
          </label>

          {selectedStore ? (
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg w-fit">
              <MapPin size={16} className="text-orange-600" />
              <span className="text-sm font-bold text-orange-800">
                {selectedStore.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedStore(null);
                  setSearchQuery("");
                }}
                className="p-0.5 hover:bg-orange-200 rounded-full transition-colors text-orange-600"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) setShowResults(true);
                }}
                onFocus={() => searchQuery && setShowResults(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="마트 이름을 검색해서 태그해보세요"
              />
            </div>
          )}

          {/* Search Dropdown */}
          {showResults && !selectedStore && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => {
                    setSelectedStore(store);
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="font-bold text-gray-900">{store.name}</div>
                  <div className="text-xs text-gray-500">{store.address}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="내용을 자유롭게 작성해주세요"
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            작성하기
          </button>
        </div>
      </form>
    </div>
  );
}
