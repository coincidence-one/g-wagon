"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, MessageSquare, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Post {
  id: number;
  title: string;
  created_at: string;
  user_id: string;
  store_name?: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
  comments: { count: number }[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          created_at,
          user_id,
          store_name,
          profiles (username, full_name),
          comments (count)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPosts(data as any);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
          <p className="text-gray-500 text-sm">
            군마트 정보를 공유하고 이야기를 나눠보세요.
          </p>
        </div>
        <Link
          href="/community/write"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span className="hidden md:inline">글쓰기</span>
          <span className="md:hidden">쓰기</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <MessageSquare size={48} className="text-gray-200 mb-4" />
            <p className="text-lg font-medium">아직 게시글이 없습니다.</p>
            <p className="text-sm">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block p-4 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                      {post.title}
                      {post.store_name && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 align-middle">
                          {post.store_name}
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {post.profiles?.full_name ||
                          post.profiles?.username ||
                          "알 수 없음"}
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageSquare size={16} />
                    <span className="text-sm">
                      {post.comments?.[0]?.count || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
