"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { Star, Trash2, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Review {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

interface StoreReviewListProps {
  storeId: number;
}

export default function StoreReviewList({ storeId }: StoreReviewListProps) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("store_reviews")
      .select(
        `
        *,
        profiles (username, full_name)
      `,
      )
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setReviews(data as any);
    }
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("store_reviews").insert({
      store_id: storeId,
      user_id: user.id,
      content,
      rating,
    });

    setSubmitting(false);

    if (error) {
      alert("리뷰 등록에 실패했습니다.");
    } else {
      setContent("");
      setRating(5);
      fetchReviews();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("store_reviews")
      .delete()
      .eq("id", id);

    if (error) {
      alert("삭제 실패");
    } else {
      fetchReviews();
    }
  };

  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        리뷰 <span className="text-orange-600">{reviews.length}</span>
      </h4>

      {/* Write Review */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-50 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  <Star
                    size={20}
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {rating}점
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 마트에 대한 리뷰를 남겨주세요"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-orange-600 text-white p-2 rounded-md disabled:opacity-50 hover:bg-orange-700 transition-colors"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
          리뷰를 작성하려면 로그인이 필요합니다.
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            로딩 중...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">
            아직 작성된 리뷰가 없습니다.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="group">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">
                    {review.profiles?.full_name ||
                      review.profiles?.username ||
                      "알 수 없음"}
                  </span>
                  <div className="flex items-center text-yellow-400 text-xs">
                    <Star size={12} fill="currentColor" />
                    <span className="ml-0.5 text-gray-600">
                      {review.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(review.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                  {user?.id === review.user_id && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
