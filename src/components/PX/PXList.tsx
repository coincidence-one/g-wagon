"use client";

import { PXStore } from "@/lib/mockData";
import { MapPin, Phone, Clock, Navigation, LocateFixed } from "lucide-react";
import StoreReviewList from "./StoreReviewList";

interface PXListProps {
  stores: PXStore[];
  onSelectStore: (store: PXStore) => void;
  selectedStore: PXStore | null;
  onSortByDistance: () => void;
  isSorting: boolean;
  onDirectionsClick: (
    e: React.MouseEvent,
    type: "naver" | "kakao",
    store: PXStore,
  ) => void;
}

export default function PXList({
  stores,
  onSelectStore,
  selectedStore,
  onSortByDistance,
  isSorting,
  onDirectionsClick,
}: PXListProps) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">내 주변 군마트</h2>
        <button
          onClick={onSortByDistance}
          disabled={isSorting}
          className="text-sm px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-1.5 trasition-colors disabled:opacity-50"
        >
          <LocateFixed size={14} className={isSorting ? "animate-spin" : ""} />
          <span>거리순 정렬</span>
        </button>
      </div>

      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => onSelectStore(store)}
          className={`
            p-4 cursor-pointer karrot-card relative group
            ${
              selectedStore?.id === store.id
                ? "border-orange-500 ring-1 ring-orange-500"
                : "border-gray-200 hover:border-orange-300"
            }
          `}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-1">{store.name}</h3>
          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              <span>{store.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span>{store.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span>{store.hours}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={(e) => onDirectionsClick(e, "naver", store)}
              className="flex-1 py-1.5 text-xs font-bold bg-[#03C75A] text-white rounded hover:bg-[#02b351] transition-colors flex items-center justify-center gap-1"
            >
              <Navigation size={12} />
              네이버 길찾기
            </button>
            <button
              onClick={(e) => onDirectionsClick(e, "kakao", store)}
              className="flex-1 py-1.5 text-xs font-bold bg-[#FEE500] text-black rounded hover:bg-[#fdd835] transition-colors flex items-center justify-center gap-1"
            >
              <Navigation size={12} />
              카카오 길찾기
            </button>
          </div>

          {/* Reviews Section - Only for selected store */}
          {selectedStore?.id === store.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="cursor-default"
            >
              <StoreReviewList storeId={store.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
