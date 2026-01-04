"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { ArrowLeft, User, Clock, Trash2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Unwrap params using React.use() or just useEffect if accessing id via hook
  const [id, setId] = useState<string | null>(null);

  const fetchPostAndComments = useCallback(
    async (postId: string) => {
      // Fetch Post
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select(
          `
        *,
        profiles (username, full_name)
      `,
        )
        .eq("id", postId)
        .single();

      if (postError) {
        console.error("Error fetching post:", postError);
        alert("게시글을 불러올 수 없습니다.");
        router.push("/community");
        return;
      }

      setPost(postData);

      // Fetch Comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
        *,
        profiles (username, full_name)
      `,
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setComments(commentsData as any);
      }

      setLoading(false);
    },
    [router],
  );

  useEffect(() => {
    // Unwrap params
    params.then((p) => {
      setId(p.id);
      fetchPostAndComments(p.id);
    });
  }, [params, fetchPostAndComments]);

  const handleDeletePost = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      alert("삭제 중 오류가 발생했습니다.");
    } else {
      router.push("/community");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("정말로 댓글을 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      alert("삭제 중 오류가 발생했습니다.");
    } else {
      fetchPostAndComments(id!);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      post_id: id,
      user_id: user.id,
      content: newComment,
    });

    setSubmitting(false);

    if (error) {
      alert("댓글 작성 중 오류가 발생했습니다.");
    } else {
      setNewComment("");
      fetchPostAndComments(id!);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  }

  if (!post) {
    return (
      <div className="p-8 text-center text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link
        href="/community"
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors w-fit mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        목록으로
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-gray-900">
                <User size={16} />
                {post.profiles?.full_name ||
                  post.profiles?.username ||
                  "알 수 없음"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} />
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
            {user && user.id === post.user_id && (
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-600 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                <Trash2 size={16} />
                삭제
              </button>
            )}
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          댓글 <span className="text-orange-600">{comments.length}</span>
        </h3>

        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900">
                    {comment.profiles?.full_name ||
                      comment.profiles?.username ||
                      "알 수 없음"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-4 text-sm">
              첫 번째 댓글을 남겨보세요.
            </p>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "댓글을 입력하세요..." : "로그인이 필요합니다."}
            disabled={!user}
            className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none h-14 min-h-[56px]"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim() || !user}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-orange-600 hover:bg-orange-700 text-white rounded-md flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
