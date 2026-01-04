"use client";

import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { PXStore } from "@/lib/mockData";

interface KakaoMapProps {
  stores: PXStore[];
  selectedStore: PXStore | null;
  onSelectStore: (store: PXStore) => void;
}

export default function KakaoMapComponent({
  stores,
  selectedStore,
  onSelectStore,
}: KakaoMapProps) {
  return (
    <Map
      center={
        selectedStore?.lat && selectedStore?.lng
          ? { lat: selectedStore.lat, lng: selectedStore.lng }
          : { lat: 37.5665, lng: 126.978 }
      }
      style={{ width: "100%", height: "100%" }}
      level={selectedStore ? 4 : 8}
    >
      <MarkerClusterer
        averageCenter={true} // Cluster position at the average of contained markers
        minLevel={10} // Level to start clustering
      >
        {stores.map((store) =>
          store.lat && store.lng ? (
            <MapMarker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              onClick={() => onSelectStore(store)}
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 24, height: 35 },
              }}
            />
          ) : null,
        )}
      </MarkerClusterer>
    </Map>
  );
}
