"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { PXStore } from "@/lib/mockData";
import { calculateDistance } from "@/lib/location"; // Assuming this utility exists or I'll create it
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface StoreStatusReporterProps {
  store: PXStore;
}

export default function StoreStatusReporter({
  store,
}: StoreStatusReporterProps) {
  const { user } = useUser();
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (!store.lat || !store.lng) return;

    // Check user location to see if they are nearby (< 500m)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const dist = calculateDistance(
            { latitude: userLat, longitude: userLng },
            { latitude: store.lat!, longitude: store.lng! },
          );
          setDistance(dist);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // setMessage("위치 정보를 가져올 수 없어 참여가 불가능합니다.");
          console.log("위치 정보를 가져올 수 없어 참여가 불가능합니다.");
        },
      );
    }
  }, [store]);

  const handleReport = async (status: "OPEN" | "CLOSED" | "OUT_OF_STOCK") => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("store_status_logs").insert({
      store_id: store.id,
      user_id: user.id,
      status: status,
    });

    setLoading(false);

    if (error) {
      alert("전송 실패: " + error.message);
    } else {
      setReported(true);
    }
  };

  if (!user) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center text-xs text-gray-500">
        로그인 후 실시간 정보를 공유해보세요.
      </div>
    );
  }

  if (distance === null) {
    return (
      <div className="mt-4 text-center text-xs text-gray-400">
        위치 확인 중...
      </div>
    );
  }

  const isNearby = distance <= 0.5; // 500m

  if (!isNearby) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2 justify-center text-xs text-gray-500">
        <AlertCircle size={14} />
        <span>마트 근처(500m)에서만 현황을 제보할 수 있어요.</span>
      </div>
    );
  }

  if (reported) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl flex flex-col items-center justify-center text-green-700 animate-in fade-in">
        <CheckCircle2 size={24} className="mb-1" />
        <span className="font-bold text-sm">소중한 정보 감사합니다!</span>
        <span className="text-xs opacity-80">
          다른 가족들에게 큰 도움이 됩니다.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h3 className="text-xs font-bold text-gray-600 mb-2 flex items-center justify-between">
        <span>지금 이 마트는 어떤가요?</span>
        <span className="text-[10px] font-normal text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
          인증됨 (거리 {Math.round(distance * 1000)}m)
        </span>
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleReport("OPEN")}
          disabled={loading}
          className="py-2 px-1 bg-white border border-green-200 text-green-700 hover:bg-green-50 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1"
        >
          <span className="text-lg">🟢</span>
          영업중
        </button>
        <button
          onClick={() => handleReport("CLOSED")}
          disabled={loading}
          className="py-2 px-1 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1"
        >
          <span className="text-lg">⛔️</span>문 닫음
        </button>
        <button
          onClick={() => handleReport("OUT_OF_STOCK")}
          disabled={loading}
          className="py-2 px-1 bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1"
        >
          <span className="text-lg">📦</span>
          재고 부족
        </button>
      </div>
      {loading && (
        <div className="text-center mt-2">
          <Loader2 className="animate-spin inline text-gray-400" size={16} />
        </div>
      )}
    </div>
  );
}
