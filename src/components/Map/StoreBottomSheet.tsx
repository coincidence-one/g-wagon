"use client";

import { PXStore } from "@/lib/mockData";
import { X, Map as MapIcon, Info } from "lucide-react";
import StoreStatusReporter from "./StoreStatusReporter";

interface StoreBottomSheetProps {
  store: PXStore | null;
  onClose: () => void;
}

export default function StoreBottomSheet({
  store,
  onClose,
}: StoreBottomSheetProps) {
  if (!store) return null;

  const accessConfig = {
    GREEN: {
      color: "bg-green-50 text-green-700 border-green-200",
      label: "가족 출입 가능",
      description:
        "국군가족(신분증 소지)이라면 누구나 자유롭게 이용할 수 있습니다.",
    },
    YELLOW: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "방문 전 확인 필요",
      description:
        "부대 사정에 따라 출입이 제한되거나 특정 시간만 개방될 수 있습니다.",
    },
    RED: {
      color: "bg-red-50 text-red-700 border-red-200",
      label: "영내 마트 (제한)",
      description: "현역 장병의 인솔(동행)이 있어야만 입장할 수 있습니다.",
    },
  };

  const config = accessConfig[store.accessLevel || "YELLOW"]; // Default to Yellow

  // Navigation Deep Links
  // Note: These schemes work on mobile devices with the apps installed.
  const handleNavigation = (app: "tmap" | "naver" | "kakao") => {
    if (!store.lat || !store.lng) return;

    switch (app) {
      case "tmap":
        // T-Map URL Scheme
        window.location.href = `tmap://route?goalname=${store.name}&goalx=${store.lng}&goaly=${store.lat}`;
        break;
      case "naver":
        // Naver Map URL Scheme
        window.location.href = `nmap://route/car?dlat=${store.lat}&dlng=${store.lng}&dname=${store.name}&appname=sonic-planetary`;
        break;
      case "kakao":
        // Kakao Map URL Scheme
        window.location.href = `kakaomap://route?ep=${store.lat},${store.lng}&by=car`;
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl z-50 animate-in slide-in-from-bottom border-t border-gray-100 safe-area-bottom">
      {/* Handle Bar */}
      <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      <div className="p-5 pb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border mb-2 ${config.color}`}
            >
              {config.label}
            </span>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {store.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{store.address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Access Info Box */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex gap-3">
          <Info
            className={`shrink-0 mt-0.5 ${config.color.split(" ")[1]}`}
            size={18}
          />
          <p className="text-sm text-gray-600 leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="block text-gray-400 text-xs mb-0.5">운영시간</span>
            <span className="font-medium text-gray-800">{store.hours}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-xs mb-0.5">전화번호</span>
            <span className="font-medium text-gray-800">{store.phone}</span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            길안내 앱으로 바로가기
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleNavigation("tmap")}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#00A0E9] to-[#005E8D] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                T
              </div>
              <span className="text-xs font-semibold">티맵</span>
            </button>

            <button
              onClick={() => handleNavigation("naver")}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-[#03C75A] flex items-center justify-center text-white shadow-sm">
                <span className="font-bold text-lg">N</span>
              </div>
              <span className="text-xs font-semibold">네이버지도</span>
            </button>

            <button
              onClick={() => handleNavigation("kakao")}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center text-black shadow-sm">
                <MapIcon size={20} className="text-[#191919]" />
              </div>
              <span className="text-xs font-semibold">카카오내비</span>
            </button>
          </div>
        </div>

        {/* Real-time Status Reporting */}
        <StoreStatusReporter store={store} />
      </div>
    </div>
  );
}
