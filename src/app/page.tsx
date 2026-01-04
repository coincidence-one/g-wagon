/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PXList from "@/components/PX/PXList";
import { PXStore } from "@/lib/mockData";
import { useMarts } from "@/hooks/useMarts";
import { Map as MapIcon } from "lucide-react";
import { calculateDistance } from "@/lib/location";

const MapContainer = dynamic(() => import("@/components/Map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
      지도를 불러오는 중...
    </div>
  ),
});

export default function Home() {
  const [selectedStore, setSelectedStore] = useState<PXStore | null>(null);
  const { stores, setStores, loading, error } = useMarts();
  const [isSorting, setIsSorting] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [mapInstance, setMapInstance] = useState<any>(null);

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location permission denied or error:", error);
        },
      );
    }
  }, []);

  const handleSelectStore = async (store: PXStore) => {
    if (store.lat && store.lng) {
      setSelectedStore(store);
    } else {
      // Geocode if coordinates are missing
      const { geocodeAddress } = await import("@/lib/geocode");
      const coords = await geocodeAddress(store.address);
      if (coords) {
        const updatedStore = { ...store, ...coords };
        setSelectedStore(updatedStore);

        // Update the store in the list with coordinates to avoid re-geocoding
        setStores((prev) =>
          prev.map((s) => (s.id === store.id ? updatedStore : s)),
        );
      } else {
        alert("위치를 찾을 수 없습니다.");
      }
    }
  };

  const handleMapLoad = (map: any) => {
    setMapInstance(map);
  };

  const handleSearchNearby = async () => {
    if (!mapInstance) return;

    const { reverseGeocode, geocodeAddress } = await import("@/lib/geocode");
    const center = mapInstance.getCenter();
    const address = await reverseGeocode(center.y, center.x);

    if (address) {
      // Extract city/district from address (e.g., "경기도 성남시 분당구" -> "성남시")
      // This is a simplified logic, might need refinement based on address format
      const keywords = address.split(" ");
      const city = keywords.length > 1 ? keywords[1] : keywords[0];

      // Filter stores by this city/district
      const nearbyStores = stores.filter((store) =>
        store.address.includes(city),
      );

      if (nearbyStores.length === 0) {
        alert(`"${city}" 주변에 마트가 없습니다.`);
        return;
      }

      // Geocode these stores
      // Limit to 10 to avoid hitting API limits too fast
      const storesToGeocode = nearbyStores.slice(0, 10);
      let updatedCount = 0;

      const updatedStores = [...stores];

      for (const store of storesToGeocode) {
        // Skip if already has coordinates
        if (store.lat && store.lng) continue;

        const coords = await geocodeAddress(store.address);
        if (coords) {
          const index = updatedStores.findIndex((s) => s.id === store.id);
          if (index !== -1) {
            updatedStores[index] = { ...store, ...coords };
            updatedCount++;
          }
        }
      }

      if (updatedCount > 0) {
        setStores(updatedStores);
        alert(`"${city}" 주변 마트 ${updatedCount}개의 위치를 찾았습니다.`);
      } else {
        alert(`"${city}" 주변 마트 위치를 찾을 수 없거나 이미 표시되었습니다.`);
      }
    } else {
      alert("현재 위치의 주소를 알 수 없습니다.");
    }
  };

  const handleSortByDistance = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setIsSorting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Update user location state as well
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        const sortedStores = [...stores].sort((a, b) => {
          // If either doesn't have coords, push to bottom
          if (!a.lat || !a.lng) return 1;
          if (!b.lat || !b.lng) return -1;

          const distA = calculateDistance(userLoc, {
            latitude: a.lat,
            longitude: a.lng,
          });
          const distB = calculateDistance(userLoc, {
            latitude: b.lat,
            longitude: b.lng,
          });
          return distA - distB;
        });

        setStores(sortedStores);
        setIsSorting(false);
      },
      (error) => {
        console.error(error);
        alert("위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        setIsSorting(false);
      },
    );
  };

  return (
    <main className="flex h-full w-full relative bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] h-1/2 md:h-full absolute md:relative bottom-0 md:left-0 z-20 bg-white border-t md:border-r border-gray-200 shadow-xl transition-all duration-300 flex flex-col">
        {/* Tab Navigation */}
        {/* Tab Navigation - Removed as we only have stores now */}
        <div className="flex p-4 border-b border-gray-100 justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapIcon size={24} className="text-orange-500" />
            <span>군마트 찾기</span>
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {loading || error ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              데이터를 불러오는 중...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              에러 발생: {error}
            </div>
          ) : (
            <PXList
              stores={stores}
              selectedStore={selectedStore}
              onSelectStore={handleSelectStore}
              onSortByDistance={handleSortByDistance}
              isSorting={isSorting}
              onDirectionsClick={async (e, type, store) => {
                e.stopPropagation();

                let targetStore = store;

                // If coordinates are missing, try to geocode
                if (!targetStore.lat || !targetStore.lng) {
                  const { geocodeAddress } = await import("@/lib/geocode");
                  const coords = await geocodeAddress(store.address);

                  if (coords) {
                    targetStore = { ...store, ...coords };
                    // Update state to reflect geocoding
                    setStores((prev) =>
                      prev.map((s) => (s.id === store.id ? targetStore : s)),
                    );
                  } else {
                    alert("위치를 찾을 수 없습니다.");
                    return;
                  }
                }

                // Try to get fresh location if we don't have it, but don't block
                let startLoc = userLocation;
                if (!startLoc && navigator.geolocation) {
                  try {
                    const position = await new Promise<GeolocationPosition>(
                      (resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                          resolve,
                          reject,
                          { timeout: 3000 },
                        );
                      },
                    );
                    startLoc = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };
                    setUserLocation(startLoc);
                  } catch (e) {
                    // Ignore error, just proceed without start location
                  }
                }

                const { getNaverDirectionsUrl, getKakaoDirectionsUrl } =
                  await import("@/lib/navigation");
                const url =
                  type === "naver"
                    ? getNaverDirectionsUrl(
                        targetStore.name,
                        targetStore.lat!,
                        targetStore.lng!,
                        startLoc?.lat,
                        startLoc?.lng,
                      )
                    : getKakaoDirectionsUrl(
                        targetStore.name,
                        targetStore.lat!,
                        targetStore.lng!,
                        startLoc?.lat,
                        startLoc?.lng,
                      );

                window.open(url, "_blank");
              }}
            />
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 h-1/2 md:h-full relative z-10">
        <MapContainer
          stores={stores}
          selectedStore={selectedStore}
          onSelectStore={handleSelectStore}
          onMapLoad={handleMapLoad}
          onSearchNearby={handleSearchNearby}
        />
      </div>
    </main>
  );
}
