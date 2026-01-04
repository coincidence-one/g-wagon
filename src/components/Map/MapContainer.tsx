/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { NavermapsProvider } from "react-naver-maps";
import Script from "next/script";
import NaverMapComponent from "./NaverMap";
import KakaoMapComponent from "./KakaoMap";
import StoreBottomSheet from "./StoreBottomSheet";
import { PXStore } from "@/lib/mockData";

interface MapContainerProps {
  stores: PXStore[];
  selectedStore: PXStore | null;
  onSelectStore: (store: PXStore) => void;
  onMapLoad?: (map: any) => void;
  onSearchNearby?: () => void;
}

type MapProvider = "naver" | "kakao";

export default function MapContainer({
  stores,
  selectedStore,
  onSelectStore,
  onMapLoad,
  onSearchNearby,
}: MapContainerProps) {
  const [activeProvider, setActiveProvider] = useState<MapProvider>("naver");
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
  console.log(naverClientId, kakaoAppKey);
  if (!naverClientId || !kakaoAppKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 p-4 text-center">
        <p>
          API Keys are missing. <br />
          Please check .env.local for NEXT_PUBLIC_NAVER_CLIENT_ID and
          NEXT_PUBLIC_KAKAO_APP_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Provider Toggle */}
      <div className="absolute top-4 right-4 z-50 flex bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <button
          onClick={() => setActiveProvider("naver")}
          className={`px-4 py-2 text-sm font-bold transition-colors ${
            activeProvider === "naver"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          네이버
        </button>
        <div className="w-[1px] bg-gray-200"></div>
        <button
          onClick={() => setActiveProvider("kakao")}
          className={`px-4 py-2 text-sm font-bold transition-colors ${
            activeProvider === "kakao"
              ? "bg-yellow-400 text-black"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          카카오
        </button>
      </div>

      {/* Search Nearby Button */}
      {onSearchNearby && (
        <button
          onClick={onSearchNearby}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <span>현 지도에서 검색</span>
        </button>
      )}

      {/* Naver Map */}
      <div
        className={`w-full h-full ${activeProvider === "naver" ? "block" : "hidden"}`}
      >
        <NavermapsProvider ncpKeyId={naverClientId} submodules={["geocoder"]}>
          <NaverMapComponent
            stores={stores}
            selectedStore={selectedStore}
            onSelectStore={onSelectStore}
            onMapLoad={onMapLoad}
          />
        </NavermapsProvider>
      </div>

      {/* Kakao Map */}
      <div
        className={`w-full h-full ${activeProvider === "kakao" ? "block" : "hidden"}`}
      >
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppKey}&libraries=services,clusterer&autoload=false`}
          strategy="afterInteractive"
          onLoad={() => {
            window.kakao.maps.load(() => {
              setKakaoLoaded(true);
            });
          }}
        />
        {kakaoLoaded && (
          <KakaoMapComponent
            stores={stores}
            selectedStore={selectedStore}
            onSelectStore={onSelectStore}
          />
        )}
      </div>

      {/* Store Bottom Sheet */}
      <StoreBottomSheet
        store={selectedStore}
        onClose={() => onSelectStore(null as any)}
      />
    </div>
  );
}
